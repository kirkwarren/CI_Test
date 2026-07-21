import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = path.join(here, "..", "..", "config", "clinic.json");

let cached;

export function getClinic(configPath = process.env.CLINIC_CONFIG || DEFAULT_CONFIG_PATH) {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
  return cached;
}

export function isDryRun() {
  return process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
}
