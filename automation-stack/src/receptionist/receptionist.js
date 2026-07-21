import { complete } from "../lib/claude.js";
import { isOpen } from "../lib/hours.js";
import { buildReceptionistSystemPrompt } from "./prompts.js";

const REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "intent", "pitched_package_id", "needs_human_followup"],
  properties: {
    reply: { type: "string" },
    intent: {
      type: "string",
      enum: ["book", "reschedule", "cancel", "pricing", "clinical", "general", "emergency"]
    },
    pitched_package_id: { anyOf: [{ type: "string" }, { type: "null" }] },
    needs_human_followup: { type: "boolean" }
  }
};

const HISTORY_LIMIT = 12;

export async function handleInboundMessage(store, clinic, { channel, from, body }) {
  const patient = store.findOne("patients", (p) => p.phone === from);
  store.insert("messages", {
    direction: "inbound",
    channel,
    phone: from,
    patientId: patient?.id || null,
    body
  });

  const history = store
    .list("messages", (m) => m.phone === from)
    .slice(-HISTORY_LIMIT)
    .map((m) => ({
      role: m.direction === "inbound" ? "user" : "assistant",
      content: m.body
    }));

  const afterHours = !isOpen(clinic);
  const system = buildReceptionistSystemPrompt(clinic, { afterHours, channel });

  let result;
  try {
    result = await complete({
      system,
      messages: history,
      schema: REPLY_SCHEMA,
      maxTokens: 1000,
      dryRunValue: {
        reply: `Thanks for reaching ${clinic.name}! The front desk is away right now — you can book online at ${clinic.bookingUrl} and we'll follow up when we open.`,
        intent: "general",
        pitched_package_id: null,
        needs_human_followup: true
      }
    });
  } catch (err) {
    console.error("receptionist: model call failed, using fallback reply", err);
    result = {
      reply: `Thanks for reaching ${clinic.name}. The front desk will get back to you as soon as we open. For booking, visit ${clinic.bookingUrl}.`,
      intent: "general",
      pitched_package_id: null,
      needs_human_followup: true
    };
  }

  let reply = result.reply;
  if (channel === "sms" && result.intent === "book" && !reply.includes(clinic.bookingUrl)) {
    reply = `${reply} Book online any time: ${clinic.bookingUrl}`;
  }

  store.insert("messages", {
    direction: "outbound",
    channel,
    phone: from,
    patientId: patient?.id || null,
    body: reply,
    intent: result.intent,
    pitchedPackageId: result.pitched_package_id
  });

  if (result.needs_human_followup || result.intent === "clinical") {
    store.insert("followups", {
      type: "front_desk_callback",
      phone: from,
      patientId: patient?.id || null,
      reason: `Receptionist flagged ${result.intent} conversation for human follow-up`,
      status: "open"
    });
  }

  return { reply, ...result };
}
