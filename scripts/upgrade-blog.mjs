import { spawnSync } from "node:child_process";
import path from "node:path";

const force = process.argv.includes("--force-template");

if (!force) {
  console.error("Template bulk generation is disabled by policy.");
  console.error("This script no longer publishes repeated article structures.");
  console.error("Use manually written articles and run: node scripts/policy-audit.mjs");
  process.exit(1);
}

const auditScript = path.resolve("scripts", "policy-audit.mjs");
const audit = spawnSync(process.execPath, [auditScript, "--prepublish"], { stdio: "inherit" });

if ((audit.status ?? 1) !== 0) {
  console.error("Pre-publish audit failed. Generation stopped.");
  process.exit(audit.status ?? 1);
}

console.error("Template generation remains blocked to prevent low-value duplicate content.");
console.error("Write unique content manually, then re-run policy audit before deploy.");
process.exit(1);
