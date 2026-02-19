import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

const vercelModule = await import(pathToFileURL(path.join(ROOT, "api/contact.js")).href);
const cfModule = await import(pathToFileURL(path.join(ROOT, "functions/api/contact.js")).href);

const vercelHandler = vercelModule.default;
const cloudflarePost = cfModule.onRequestPost;

const ORIG_FETCH = global.fetch;
const ORIG_ENV = {
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

function resetEnv() {
  process.env.CONTACT_RECEIVER_EMAIL = ORIG_ENV.CONTACT_RECEIVER_EMAIL;
  process.env.UPSTASH_REDIS_REST_URL = ORIG_ENV.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN = ORIG_ENV.UPSTASH_REDIS_REST_TOKEN;
}

function clearEnv() {
  delete process.env.CONTACT_RECEIVER_EMAIL;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
}

function baseForm() {
  const form = new FormData();
  form.set("name", "홍길동");
  form.set("email", "tester@example.com");
  form.set("subject", "문의 테스트");
  form.set("message", "전송 동작 확인");
  return form;
}

function makeJsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function parseJson(response) {
  const json = await response.json();
  return { status: response.status, json };
}

async function runVercel(request) {
  return vercelHandler(request);
}

async function runCloudflare(request, env = {}) {
  return cloudflarePost({ request, env });
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test("vercel: success without upstash env uses fallback receiver", async () => {
  clearEnv();
  let calledUrl = "";
  global.fetch = async (url) => {
    calledUrl = String(url);
    return makeJsonResponse(200, { success: true });
  };

  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: baseForm(),
  });

  const { status, json } = await parseJson(await runVercel(req));
  assert.equal(status, 200);
  assert.equal(json.code, "SENT");
  assert.match(calledUrl, /formsubmit\.co\/ajax\/luvsoul%40kakao\.com/);
});

test("vercel: missing required field returns 400", async () => {
  clearEnv();
  global.fetch = async () => {
    throw new Error("network should not be called");
  };

  const form = new FormData();
  form.set("name", "홍길동");
  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: form,
  });

  const { status, json } = await parseJson(await runVercel(req));
  assert.equal(status, 400);
  assert.equal(json.code, "REQUIRED_FIELDS_MISSING");
});

test("vercel: attachment too large returns 400", async () => {
  clearEnv();
  global.fetch = async () => {
    throw new Error("network should not be called");
  };

  const form = baseForm();
  const huge = new File([new Uint8Array((10 * 1024 * 1024) + 1)], "huge.png", { type: "image/png" });
  form.set("attachment", huge);
  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: form,
  });

  const { status, json } = await parseJson(await runVercel(req));
  assert.equal(status, 400);
  assert.equal(json.code, "ATTACHMENT_TOO_LARGE");
});

test("vercel: upstash rate limit returns 429", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "token";

  global.fetch = async (url) => {
    const asString = String(url);
    if (asString.includes("/pipeline")) {
      return makeJsonResponse(200, [{ result: 6 }, { result: 1 }]);
    }
    return makeJsonResponse(200, { success: true });
  };

  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: baseForm(),
  });

  const { status, json } = await parseJson(await runVercel(req));
  assert.equal(status, 429);
  assert.equal(json.code, "DAILY_LIMIT_EXCEEDED_IP");
});

test("vercel: formsubmit rejection returns 502", async () => {
  clearEnv();
  global.fetch = async () => makeJsonResponse(200, { success: false });

  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: baseForm(),
  });

  const { status, json } = await parseJson(await runVercel(req));
  assert.equal(status, 502);
  assert.equal(json.code, "FORMSUBMIT_REJECTED");
});

test("cloudflare: success path with explicit env receiver", async () => {
  let calledUrl = "";
  global.fetch = async (url) => {
    calledUrl = String(url);
    return makeJsonResponse(200, { success: true });
  };

  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: baseForm(),
  });

  const { status, json } = await parseJson(await runCloudflare(req, {
    CONTACT_RECEIVER_EMAIL: "owner@example.com",
  }));
  assert.equal(status, 200);
  assert.equal(json.code, "SENT");
  assert.match(calledUrl, /formsubmit\.co\/ajax\/owner%40example\.com/);
});

test("cloudflare: rate limit returns 429", async () => {
  global.fetch = async (url) => {
    const asString = String(url);
    if (asString.includes("/pipeline")) {
      return makeJsonResponse(200, [{ result: 7 }, { result: 1 }]);
    }
    return makeJsonResponse(200, { success: true });
  };

  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    body: baseForm(),
  });

  const { status, json } = await parseJson(await runCloudflare(req, {
    CONTACT_RECEIVER_EMAIL: "owner@example.com",
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "token",
  }));
  assert.equal(status, 429);
  assert.equal(json.code, "DAILY_LIMIT_EXCEEDED_IP");
});

let passed = 0;
try {
  for (const { name, fn } of tests) {
    await fn();
    passed += 1;
    console.log(`PASS ${name}`);
  }
  console.log(`\nAll tests passed: ${passed}/${tests.length}`);
} finally {
  global.fetch = ORIG_FETCH;
  resetEnv();
}
