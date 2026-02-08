export const config = {
  runtime: "edge",
};

const DAILY_LIMIT = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const KEY_TTL_SECONDS = 60 * 60 * 24 * 2;

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function kstDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeText(value) {
  return String(value || "").trim();
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return "unknown-ip";
}

async function sha256(text) {
  const input = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function runUpstashPipeline(commands) {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("UPSTASH_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    throw new Error("UPSTASH_REQUEST_FAILED");
  }

  return response.json();
}

async function incrementDailyCounter(scope, rawValue, dateKey) {
  const hashedValue = await sha256(rawValue);
  const key = `contact:${scope}:${dateKey}:${hashedValue.slice(0, 32)}`;

  const pipelineResult = await runUpstashPipeline([
    ["INCR", key],
    ["EXPIRE", key, KEY_TTL_SECONDS],
  ]);

  const count = Number(pipelineResult?.[0]?.result || 0);
  return count;
}

function validateAttachment(file) {
  if (!(file instanceof File)) {
    return "ATTACHMENT_REQUIRED";
  }

  if (!file.type || !file.type.startsWith("image/")) {
    return "ATTACHMENT_NOT_IMAGE";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "ATTACHMENT_TOO_LARGE";
  }

  return null;
}

async function forwardToFormSubmit(payload) {
  const receiver = process.env.CONTACT_RECEIVER_EMAIL;
  if (!receiver) {
    throw new Error("CONTACT_RECEIVER_NOT_CONFIGURED");
  }

  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(receiver)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error("FORMSUBMIT_HTTP_ERROR");
  }

  const result = await response.json().catch(() => ({}));
  const isSuccess = result.success === true || result.success === "true";
  if (!isSuccess) {
    throw new Error("FORMSUBMIT_REJECTED");
  }
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(405, {
      ok: false,
      code: "METHOD_NOT_ALLOWED",
    });
  }

  const formData = await request.formData();
  const name = normalizeText(formData.get("name"));
  const email = normalizeText(formData.get("email")).toLowerCase();
  const subject = normalizeText(formData.get("subject"));
  const message = normalizeText(formData.get("message"));
  const attachment = formData.get("attachment");

  if (!name || !email || !subject || !message) {
    return jsonResponse(400, {
      ok: false,
      code: "REQUIRED_FIELDS_MISSING",
    });
  }

  const attachmentError = validateAttachment(attachment);
  if (attachmentError) {
    return jsonResponse(400, {
      ok: false,
      code: attachmentError,
    });
  }

  const dateKey = kstDateKey();
  const clientIp = getClientIp(request);

  try {
    const ipCount = await incrementDailyCounter("ip", `${clientIp}|${dateKey}`, dateKey);
    if (ipCount > DAILY_LIMIT) {
      return jsonResponse(429, {
        ok: false,
        code: "DAILY_LIMIT_EXCEEDED_IP",
      });
    }

    const emailCount = await incrementDailyCounter("email", `${email}|${dateKey}`, dateKey);
    if (emailCount > DAILY_LIMIT) {
      return jsonResponse(429, {
        ok: false,
        code: "DAILY_LIMIT_EXCEEDED_EMAIL",
      });
    }
  } catch (error) {
    const errorCode = String(error?.message || "");
    return jsonResponse(500, {
      ok: false,
      code: errorCode || "RATE_LIMIT_ERROR",
    });
  }

  const forwardPayload = new FormData();
  forwardPayload.set("name", name);
  forwardPayload.set("email", email);
  forwardPayload.set("subject", subject);
  forwardPayload.set(
    "message",
    `[문의 정보]
이름: ${name}
회신 이메일: ${email}

[문의 내용]
${message}`,
  );
  forwardPayload.set("_subject", `[길돈 운세 문의] ${subject}`);
  forwardPayload.set("_captcha", "false");
  forwardPayload.set("_template", "table");
  forwardPayload.set("attachment", attachment, attachment.name || "upload-image");

  try {
    await forwardToFormSubmit(forwardPayload);
    return jsonResponse(200, {
      ok: true,
      code: "SENT",
    });
  } catch (error) {
    return jsonResponse(502, {
      ok: false,
      code: String(error?.message || "MAIL_FORWARD_FAILED"),
    });
  }
}
