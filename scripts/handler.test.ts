import { describe, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { handler } = require("../dist/handler.js") as {
  handler: (
    event: Record<string, unknown>,
    context: object
  ) => Promise<{ statusCode: number; body?: string }>;
};

const validPayload = fs.readFileSync(path.join(__dirname, "payload-example.json"), "utf8");

function run(event: Record<string, unknown>) {
  return handler(event, {});
}

describe("webhook handler", () => {
  it("returns 202 for valid TranscripTonic payload", async () => {
    const res = await run({
      body: validPayload,
      requestContext: { requestId: "test-id" },
      headers: { "content-type": "application/json" },
    });
    assert.strictEqual(res.statusCode, 202);
    const body = JSON.parse(res.body ?? "{}");
    assert.strictEqual(body.received, true);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await run({
      body: "not json",
      requestContext: {},
      headers: {},
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("returns 400 for valid JSON but wrong shape (missing required fields)", async () => {
    const res = await run({
      body: '{"foo":"bar"}',
      requestContext: {},
      headers: {},
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("returns 400 when webhookBodyType is invalid", async () => {
    const bad = JSON.parse(validPayload) as Record<string, unknown>;
    bad.webhookBodyType = "other";
    const res = await run({
      body: JSON.stringify(bad),
      requestContext: {},
      headers: {},
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("returns 413 when body exceeds 1 MB", async () => {
    const big = "x".repeat(1024 * 1024 + 1);
    const res = await run({
      body: big,
      requestContext: {},
      headers: {},
      isBase64Encoded: false,
    });
    assert.strictEqual(res.statusCode, 413);
  });

  it("returns 202 for advanced webhookBodyType with array transcript", async () => {
    const advanced = {
      webhookBodyType: "advanced",
      meetingSoftware: "google_meet",
      meetingTitle: "Meet",
      meetingStartTimestamp: "2025-01-01T00:00:00.000Z",
      meetingEndTimestamp: "2025-01-01T01:00:00.000Z",
      transcript: [{ personName: "A", timestamp: "00:00", transcriptText: "Hi" }],
      chatMessages: [] as string[],
    };
    const res = await run({
      body: JSON.stringify(advanced),
      requestContext: {},
      headers: {},
    });
    assert.strictEqual(res.statusCode, 202);
  });
});
