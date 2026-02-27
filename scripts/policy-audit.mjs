import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const isPrepublish = args.has("--prepublish");

const indexedUrls = new Set([
  "https://ai-automation-djq.pages.dev/",
  "https://ai-automation-djq.pages.dev/blog/",
  "https://ai-automation-djq.pages.dev/blog/post-01-salary-day-budget.html",
  "https://ai-automation-djq.pages.dev/blog/post-02-delivery-spend-control.html",
  "https://ai-automation-djq.pages.dev/blog/post-06-emergency-fund-30days.html",
  "https://ai-automation-djq.pages.dev/blog/post-08-weekend-spend-reset.html",
  "https://ai-automation-djq.pages.dev/about.html",
  "https://ai-automation-djq.pages.dev/methodology.html",
  "https://ai-automation-djq.pages.dev/editorial-policy.html",
  "https://ai-automation-djq.pages.dev/privacy.html",
  "https://ai-automation-djq.pages.dev/contact.html",
]);

const noindexFiles = [
  "blog/post-03-subscription-cleanup-checklist.html",
  "blog/post-04-secondhand-selling-guide.html",
  "blog/post-05-card-benefit-routine.html",
  "blog/post-07-transport-communication-savings.html",
  "blog/post-09-cafe-expense-reduction.html",
  "blog/post-10-beginner-investment-risk-check.html",
];

const publicPosts = [
  "blog/post-01-salary-day-budget.html",
  "blog/post-02-delivery-spend-control.html",
  "blog/post-06-emergency-fund-30days.html",
  "blog/post-08-weekend-spend-reset.html",
];

const issues = [];
const notes = [];

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtml(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function rel(fullPath) {
  return path.relative(ROOT, fullPath).replaceAll("\\", "/");
}

function getRobotsMeta(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  return m ? m[1].toLowerCase() : "";
}

function textFromArticle(html) {
  const article = html.match(/<article class="panel article-body">([\s\S]*?)<\/article>/i);
  const src = article ? article[1] : html;
  return src
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ngrams(tokens, n) {
  const set = new Set();
  if (tokens.length < n) return set;
  for (let i = 0; i <= tokens.length - n; i += 1) {
    set.add(tokens.slice(i, i + n).join(" "));
  }
  return set;
}

function checkAds(htmlFiles) {
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("pagead2.googlesyndication.com")) {
      issues.push(`Ad script found: ${rel(file)}`);
    }
  }
}

function checkRobots() {
  const indexedFiles = [
    "index.html",
    "blog/index.html",
    ...publicPosts,
    "about.html",
    "methodology.html",
    "editorial-policy.html",
    "privacy.html",
    "contact.html",
  ];

  for (const file of indexedFiles) {
    const robots = getRobotsMeta(read(file));
    if (!robots.includes("index") || robots.includes("noindex")) {
      issues.push(`Robots mismatch for indexed file: ${file} -> ${robots || "missing"}`);
    }
  }

  for (const file of noindexFiles) {
    const robots = getRobotsMeta(read(file));
    if (!robots.includes("noindex")) {
      issues.push(`Robots mismatch for noindex file: ${file} -> ${robots || "missing"}`);
    }
  }
}

function checkSitemap() {
  const xml = read("sitemap.xml");
  const found = new Set(Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim()));

  for (const url of indexedUrls) {
    if (!found.has(url)) issues.push(`Sitemap missing indexed URL: ${url}`);
  }

  for (const file of noindexFiles) {
    const url = `https://ai-automation-djq.pages.dev/${file}`;
    if (found.has(url)) issues.push(`Sitemap contains noindex URL: ${url}`);
  }
}

function checkDuplicateContent() {
  const data = [];

  for (const file of publicPosts) {
    const text = textFromArticle(read(file));
    const tokens = text.split(/\s+/).filter(Boolean);
    const noSpaceChars = text.replace(/\s+/g, "").length;
    data.push({
      file,
      text,
      tokens,
      grams: ngrams(tokens, 12),
    });
    if (noSpaceChars < 1800 && tokens.length < 700) {
      issues.push(`Public post too short: ${file} (${tokens.length} words, ${noSpaceChars} chars)`);
    }
  }

  for (let i = 0; i < data.length; i += 1) {
    for (let j = i + 1; j < data.length; j += 1) {
      const a = data[i];
      const b = data[j];
      let inter = 0;
      for (const gram of a.grams) {
        if (b.grams.has(gram)) inter += 1;
      }
      const denom = Math.max(1, Math.min(a.grams.size, b.grams.size));
      const ratio = inter / denom;
      if (ratio > 0.05) {
        issues.push(`12-gram overlap too high: ${a.file} vs ${b.file} -> ${(ratio * 100).toFixed(2)}%`);
      }
    }
  }

  const sentenceMap = new Map();
  for (const item of data) {
    const local = new Set(
      item.text
        .split(/[.!?]\s+|\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 20)
        .filter((s) => !s.includes("안내:"))
    );
    for (const sentence of local) {
      sentenceMap.set(sentence, (sentenceMap.get(sentence) || 0) + 1);
    }
  }

  const repeated = [...sentenceMap.values()].filter((count) => count >= 3).length;
  if (repeated > 2) {
    issues.push(`Too many repeated sentences across public posts: ${repeated}`);
  }
}

function checkBrokenLinks(htmlFiles) {
  const attrPattern = /(?:href|src)=["']([^"']+)["']/g;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const m of content.matchAll(attrPattern)) {
      const raw = m[1];
      if (/^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(raw)) continue;

      const clean = raw.split("#")[0].split("?")[0];
      if (!clean) continue;

      let target = path.resolve(path.dirname(file), clean);
      if (clean.endsWith("/")) target = path.join(target, "index.html");

      if (!fs.existsSync(target)) {
        issues.push(`Broken local link: ${rel(file)} -> ${raw}`);
      }
    }
  }
}

function run() {
  const htmlFiles = walkHtml(ROOT);

  checkAds(htmlFiles);
  checkRobots();
  checkSitemap();
  checkDuplicateContent();
  checkBrokenLinks(htmlFiles);

  notes.push(`Mode: ${isPrepublish ? "prepublish" : "standard"}`);
  notes.push(`Scanned HTML files: ${htmlFiles.length}`);

  if (issues.length > 0) {
    console.error("Policy audit failed.");
    for (const line of notes) console.error(`- ${line}`);
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("Policy audit passed.");
  for (const line of notes) console.log(`- ${line}`);
}

run();
