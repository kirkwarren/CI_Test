import test from "node:test";
import assert from "node:assert/strict";
import { queueMessage, processOutbox, handleOptKeywords } from "../src/messaging/outbox.js";
import { tempStore, testClinic } from "./helpers.js";

test("messages queued during quiet hours are deferred to morning", () => {
  const store = tempStore();
  const queued = queueMessage(store, testClinic, {
    to: "+15550001111",
    kind: "test",
    body: "hello",
    earliest: new Date("2026-07-20T22:00:00-04:00")
  });
  assert.ok(Date.parse(queued.earliestSend) >= Date.parse("2026-07-21T08:00:00-04:00"));
});

test("processOutbox sends due messages and records them", async () => {
  const store = tempStore();
  queueMessage(store, testClinic, {
    to: "+15550001111",
    kind: "test",
    body: "hello",
    earliest: new Date("2026-07-20T12:00:00-04:00")
  });
  const sentCalls = [];
  const result = await processOutbox(store, testClinic, {
    now: new Date("2026-07-20T12:05:00-04:00"),
    send: async (m) => (sentCalls.push(m), { sid: "test" })
  });
  assert.equal(result.sent, 1);
  assert.equal(sentCalls[0].to, "+15550001111");
  assert.equal(store.list("outbox")[0].status, "sent");
  assert.equal(store.list("messages").length, 1);
});

test("processOutbox does nothing during quiet hours", async () => {
  const store = tempStore();
  queueMessage(store, testClinic, {
    to: "+15550001111",
    kind: "test",
    body: "hello",
    earliest: new Date("2026-07-20T12:00:00-04:00")
  });
  const result = await processOutbox(store, testClinic, {
    now: new Date("2026-07-20T23:00:00-04:00"),
    send: async () => ({ sid: "x" })
  });
  assert.equal(result.sent, 0);
});

test("opted-out patients are skipped", async () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "A", lastName: "B", phone: "+15550001111", optedOut: true });
  queueMessage(store, testClinic, {
    to: patient.phone,
    patientId: patient.id,
    kind: "test",
    body: "hello",
    earliest: new Date("2026-07-20T12:00:00-04:00")
  });
  const result = await processOutbox(store, testClinic, {
    now: new Date("2026-07-20T12:05:00-04:00"),
    send: async () => ({ sid: "x" })
  });
  assert.equal(result.sent, 0);
  assert.equal(result.skipped, 1);
  assert.equal(store.list("outbox")[0].status, "skipped_opted_out");
});

test("STOP opts a patient out and START opts back in", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "A", lastName: "B", phone: "+15550001111", optedOut: false });
  assert.equal(handleOptKeywords(store, patient.phone, "STOP"), "opted_out");
  assert.equal(store.get("patients", patient.id).optedOut, true);
  assert.equal(handleOptKeywords(store, patient.phone, "start"), "opted_in");
  assert.equal(store.get("patients", patient.id).optedOut, false);
  assert.equal(handleOptKeywords(store, patient.phone, "hi there"), null);
});
