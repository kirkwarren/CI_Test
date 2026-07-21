import test from "node:test";
import assert from "node:assert/strict";
import { generateSlots, bookAppointment, runReminderJob } from "../src/booking/booking.js";
import { tempStore, testClinic } from "./helpers.js";

test("generateSlots stays within business hours", () => {
  const slots = generateSlots({
    clinic: testClinic,
    appointments: [],
    from: new Date("2026-07-20T06:00:00-04:00"),
    days: 1,
    durationMin: 60
  });
  assert.ok(slots.length > 0);
  assert.ok(slots.includes(new Date("2026-07-20T08:00:00-04:00").toISOString()));
  assert.ok(slots.includes(new Date("2026-07-20T17:00:00-04:00").toISOString()));
  assert.ok(!slots.includes(new Date("2026-07-20T17:30:00-04:00").toISOString()));
  assert.ok(!slots.includes(new Date("2026-07-20T07:30:00-04:00").toISOString()));
});

test("generateSlots excludes overlapping appointments", () => {
  const appointments = [
    { startIso: new Date("2026-07-20T14:00:00-04:00").toISOString(), durationMin: 60, status: "confirmed" }
  ];
  const slots = generateSlots({
    clinic: testClinic,
    appointments,
    from: new Date("2026-07-20T06:00:00-04:00"),
    days: 1,
    durationMin: 60
  });
  assert.ok(!slots.includes(new Date("2026-07-20T14:00:00-04:00").toISOString()));
  assert.ok(!slots.includes(new Date("2026-07-20T13:30:00-04:00").toISOString()));
  assert.ok(slots.includes(new Date("2026-07-20T15:00:00-04:00").toISOString()));
});

test("bookAppointment stores appointment and queues confirmation", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "Ana", lastName: "Kim", phone: "+15551110000" });
  const startIso = new Date("2026-07-20T10:00:00-04:00").toISOString();
  const appointment = bookAppointment(store, testClinic, { patientId: patient.id, startIso, serviceId: "followup" });
  assert.equal(appointment.status, "confirmed");
  const queued = store.list("outbox");
  assert.equal(queued.length, 1);
  assert.equal(queued[0].kind, "booking_confirmation");
  assert.ok(queued[0].body.includes("Ana"));
});

test("bookAppointment rejects taken slots", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "Ana", lastName: "Kim", phone: "+15551110000" });
  const startIso = new Date("2026-07-20T10:00:00-04:00").toISOString();
  bookAppointment(store, testClinic, { patientId: patient.id, startIso, serviceId: "followup" });
  assert.throws(() => bookAppointment(store, testClinic, { patientId: patient.id, startIso, serviceId: "followup" }));
});

test("runReminderJob queues reminders 24-26h out exactly once", () => {
  const store = tempStore();
  const patient = store.insert("patients", { firstName: "Ana", lastName: "Kim", phone: "+15551110000" });
  const now = new Date("2026-07-20T10:00:00-04:00");
  store.insert("appointments", {
    patientId: patient.id,
    serviceId: "followup",
    startIso: new Date(now.getTime() + 25 * 3600 * 1000).toISOString(),
    durationMin: 60,
    status: "confirmed",
    reminderSent: false
  });
  assert.equal(runReminderJob(store, testClinic, now), 1);
  assert.equal(runReminderJob(store, testClinic, now), 0);
  assert.equal(store.list("outbox", (m) => m.kind === "appointment_reminder").length, 1);
});
