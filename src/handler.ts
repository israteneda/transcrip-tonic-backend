import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const s3 = new S3Client({});
const BUCKET = process.env.TRANSCRIPTS_BUCKET;

const MAX_BODY_BYTES = 1 * 1024 * 1024;

function isTranscripTonicPayload(obj: unknown): obj is Record<string, unknown> {
  if (obj === null || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (o.webhookBodyType !== "simple" && o.webhookBodyType !== "advanced") return false;
  if (typeof o.meetingSoftware !== "string") return false;
  if (typeof o.meetingTitle !== "string") return false;
  if (typeof o.meetingStartTimestamp !== "string") return false;
  if (typeof o.meetingEndTimestamp !== "string") return false;
  if (typeof o.transcript !== "string" && !Array.isArray(o.transcript)) return false;
  if (typeof o.chatMessages !== "string" && !Array.isArray(o.chatMessages)) return false;
  return true;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const raw = event.body ?? "";
  const bodyBytes = event.isBase64Encoded
    ? Buffer.from(raw, "base64").length
    : Buffer.byteLength(raw, "utf8");
  if (bodyBytes > MAX_BODY_BYTES) {
    return { statusCode: 413, body: "" };
  }
  const body = event.isBase64Encoded ? Buffer.from(raw, "base64").toString("utf8") : raw;

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return { statusCode: 400, body: "" };
  }
  if (!isTranscripTonicPayload(parsed)) {
    return { statusCode: 400, body: "" };
  }

  const key = `webhook/${event.requestContext?.requestId ?? Date.now()}.json`;

  if (BUCKET && body) {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: event.headers?.["content-type"] ?? "application/json",
      })
    );
  }

  return {
    statusCode: 202,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true, key: BUCKET ? key : null }),
  };
};
