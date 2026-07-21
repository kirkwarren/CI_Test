import test from "node:test";
import assert from "node:assert/strict";
import { buildReceptionistSystemPrompt } from "../src/receptionist/prompts.js";
import { requestReviewAfterVisit } from "../src/reviews/reviews.js";
import { tempStore, testClinic } from "./helpers.js";

process.env.DRY_RUN = "1";

test("system prompt includes Emily's pitch guidelines and package rules", () => {
  const prompt = buildReceptionistSystemPrompt(testClinic, { afterHours: true, channel: "sms" });
  assert.ok(prompt.includes("PRESCRIBED BY EMILY"));
  assert.ok(prompt.includes(testClinic.pitchGuidelines));
  assert.ok(prompt.includes("6-Visit Recovery Package"));
  assert.ok(prompt.includes("pricing_question"));
  assert.ok(prompt.includes("911"));
});

test("receptionist replies in dry-run and records both sides of the conversation", async () => {
  const { handleInboundMessage } = await import("../src/receptionist/receptionist.js");
  const store = tempStore();
  const result = await handleInboundMessage(store, testClinic, {
    channel: "sms",
    from: "+15550009999",
    body: "Do you have anything open this week?"
  });
  assert.ok(result.reply.length > 0);
  const messages = store.list("messages");
  assert.equal(messages.length, 2);
  assert.equal(messages[0].direction, "inbound");
  assert.equal(messages[1].direction, "outbound");
});

test("review requests are rate-limited to one per 90 days", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555", optedOut: false });
  const appointment = store.insert("appointments", { patientId: patient.id, status: "completed", startIso: new Date().toISOString() });
  const first = requestReviewAfterVisit(store, testClinic, appointment);
  assert.ok(first);
  const second = requestReviewAfterVisit(store, testClinic, appointment);
  assert.equal(second, null);
  assert.equal(store.list("outbox", (m) => m.kind === "review_request").length, 1);
});

test("review requests skip opted-out patients", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555", optedOut: true });
  const appointment = store.insert("appointments", { patientId: patient.id, status: "completed", startIso: new Date().toISOString() });
  assert.equal(requestReviewAfterVisit(store, testClinic, appointment), null);
});
