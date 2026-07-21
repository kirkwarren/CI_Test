import { isOpen } from "../lib/hours.js";
import { queueMessage } from "../messaging/outbox.js";
import { confirmationSms, reminderSms } from "../messaging/templates.js";

const SLOT_STEP_MS = 30 * 60 * 1000;

export function generateSlots({ clinic, appointments, from = new Date(), days = 7, durationMin = 60, limit = 60 }) {
  const active = appointments.filter((a) => a.status === "confirmed");
  const slots = [];
  const start = new Date(Math.ceil(from.getTime() / SLOT_STEP_MS) * SLOT_STEP_MS);
  const end = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
  for (let t = start; t < end && slots.length < limit; t = new Date(t.getTime() + SLOT_STEP_MS)) {
    const slotEnd = new Date(t.getTime() + durationMin * 60 * 1000);
    if (!isOpen(clinic, t)) continue;
    if (!isOpen(clinic, new Date(slotEnd.getTime() - 60 * 1000))) continue;
    const overlaps = active.some((a) => {
      const aStart = new Date(a.startIso);
      const aEnd = new Date(aStart.getTime() + (a.durationMin || 60) * 60 * 1000);
      return aStart < slotEnd && t < aEnd;
    });
    if (overlaps) continue;
    slots.push(t.toISOString());
  }
  return slots;
}

export function bookAppointment(store, clinic, { patientId, startIso, serviceId }) {
  const patient = store.get("patients", patientId);
  if (!patient) throw new Error(`Unknown patient ${patientId}`);
  const service = clinic.services.find((s) => s.id === serviceId) || clinic.services[0];
  const open = generateSlots({
    clinic,
    appointments: store.list("appointments"),
    from: new Date(Date.parse(startIso) - 1),
    days: 1,
    durationMin: service.durationMin
  });
  if (!open.includes(new Date(startIso).toISOString())) {
    throw new Error(`Slot ${startIso} is not available`);
  }
  const appointment = store.insert("appointments", {
    patientId,
    serviceId: service.id,
    startIso: new Date(startIso).toISOString(),
    durationMin: service.durationMin,
    status: "confirmed",
    reminderSent: false
  });
  queueMessage(store, clinic, {
    to: patient.phone,
    patientId,
    kind: "booking_confirmation",
    body: confirmationSms(clinic, patient, appointment)
  });
  return appointment;
}

export function cancelAppointment(store, id) {
  return store.update("appointments", id, { status: "cancelled" });
}

export function completeAppointment(store, id) {
  const appointment = store.update("appointments", id, { status: "completed" });
  if (appointment) {
    const patient = store.get("patients", appointment.patientId);
    if (patient?.packages?.length) {
      const pkg = patient.packages.find((p) => p.visitsUsed < p.visitsTotal && new Date(p.expiresAt) > new Date());
      if (pkg) {
        pkg.visitsUsed += 1;
        store.save();
      }
    }
  }
  return appointment;
}

export function markNoShow(store, id) {
  return store.update("appointments", id, { status: "no_show" });
}

const REMINDER_WINDOW_START_H = 24;
const REMINDER_WINDOW_END_H = 26;

export function runReminderJob(store, clinic, now = new Date()) {
  const windowStart = now.getTime() + REMINDER_WINDOW_START_H * 3600 * 1000;
  const windowEnd = now.getTime() + REMINDER_WINDOW_END_H * 3600 * 1000;
  const due = store.list(
    "appointments",
    (a) =>
      a.status === "confirmed" &&
      !a.reminderSent &&
      Date.parse(a.startIso) >= windowStart &&
      Date.parse(a.startIso) < windowEnd
  );
  for (const appointment of due) {
    const patient = store.get("patients", appointment.patientId);
    if (!patient) continue;
    queueMessage(store, clinic, {
      to: patient.phone,
      patientId: patient.id,
      kind: "appointment_reminder",
      body: reminderSms(clinic, patient, appointment)
    });
    store.update("appointments", appointment.id, { reminderSent: true });
  }
  return due.length;
}
