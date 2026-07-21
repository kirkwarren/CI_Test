import crypto from "node:crypto";
import { isDryRun } from "./config.js";

export async function sendSms({ to, body }) {
  if (isDryRun() || !process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[dry-run sms] to=${to} body=${JSON.stringify(body)}`);
    return { sid: `dry_${Date.now()}`, dryRun: true };
  }
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ To: to, From: from, Body: body })
  });
  if (!res.ok) {
    throw new Error(`Twilio send failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export function validateTwilioSignature({ url, params, signature, authToken }) {
  const sorted = Object.keys(params).sort();
  let payload = url;
  for (const key of sorted) payload += key + params[key];
  const expected = crypto.createHmac("sha1", authToken).update(payload).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function twimlMessage(body) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(body)}</Message></Response>`;
}

export function twimlSayGather({ say, gatherAction, gatherPrompt }) {
  const gather = gatherAction
    ? `<Gather input="speech" action="${escapeXml(gatherAction)}" method="POST" speechTimeout="auto">` +
      (gatherPrompt ? `<Say>${escapeXml(gatherPrompt)}</Say>` : "") +
      `</Gather>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${escapeXml(say)}</Say>${gather}</Response>`;
}
