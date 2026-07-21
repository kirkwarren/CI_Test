import { inQuietHours, nextAllowedSendTime } from "../lib/hours.js";
import { sendSms } from "../lib/twilio.js";

export function queueMessage(store, clinic, { to, patientId = null, kind, body, earliest = new Date() }) {
  const earliestSend = inQuietHours(clinic, earliest)
    ? nextAllowedSendTime(clinic, earliest)
    : earliest;
  return store.insert("outbox", {
    to,
    patientId,
    kind,
    body,
    status: "queued",
    earliestSend: earliestSend.toISOString()
  });
}

export async function processOutbox(store, clinic, { now = new Date(), send = sendSms } = {}) {
  if (inQuietHours(clinic, now)) return { sent: 0, skipped: 0 };
  const due = store.list(
    "outbox",
    (m) => m.status === "queued" && Date.parse(m.earliestSend) <= now.getTime()
  );
  let sent = 0;
  let skipped = 0;
  for (const message of due) {
    const patient = message.patientId ? store.get("patients", message.patientId) : null;
    if (patient?.optedOut) {
      store.update("outbox", message.id, { status: "skipped_opted_out" });
      skipped++;
      continue;
    }
    try {
      const result = await send({ to: message.to, body: message.body });
      store.update("outbox", message.id, {
        status: "sent",
        sentAt: now.toISOString(),
        providerSid: result?.sid || null
      });
      store.insert("messages", {
        direction: "outbound",
        channel: "sms",
        phone: message.to,
        patientId: message.patientId,
        body: message.body,
        kind: message.kind
      });
      sent++;
    } catch (err) {
      console.error(`outbox: failed to send ${message.id}`, err);
      store.update("outbox", message.id, { status: "error", error: String(err) });
    }
  }
  return { sent, skipped };
}

const STOP_WORDS = new Set(["stop", "stopall", "unsubscribe", "cancel", "end", "quit"]);
const START_WORDS = new Set(["start", "unstop", "yes"]);

export function handleOptKeywords(store, phone, body) {
  const word = body.trim().toLowerCase();
  const patient = store.findOne("patients", (p) => p.phone === phone);
  if (STOP_WORDS.has(word)) {
    if (patient) store.update("patients", patient.id, { optedOut: true });
    return "opted_out";
  }
  if (START_WORDS.has(word) && patient?.optedOut) {
    store.update("patients", patient.id, { optedOut: false });
    return "opted_in";
  }
  return null;
}
