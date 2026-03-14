/**
 * Invoke the built Lambda handler locally with scripts/payload-example.json.
 * Run from repo root: make test-local, or from src: npm run invoke-local.
 * Skips S3 unless TRANSCRIPTS_BUCKET is set.
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { handler } = require("../dist/handler.js") as {
  handler: (event: Record<string, unknown>, context: object) => Promise<unknown>;
};

const payloadPath = path.join(__dirname, "payload-example.json");
const body = fs.readFileSync(payloadPath, "utf8");
const event: Record<string, unknown> = {
  body,
  requestContext: { requestId: "local-test" },
  headers: { "content-type": "application/json" },
};

handler(event, {})
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
