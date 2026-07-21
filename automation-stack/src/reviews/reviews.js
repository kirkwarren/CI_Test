import { queueMessage } from "../messaging/outbox.js";
import { reviewRequestSms } from "../messaging/templates.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_COOLDOWN_DAYS = 90;
const SEND_DELAY_HOURS = 2;

export function requestReviewAfterVisit(store, clinic, appointment, now = new Date()) {
  const patient = store.get("patients", appointment.patientId);
  if (!patient || patient.optedOut) return null;
  const asked = store.findOne(
    "reviewRequests",
    (r) => r.patientId === patient.id && now.getTime() - Date.parse(r.createdAt) < REVIEW_COOLDOWN_DAYS * DAY_MS
  );
  if (asked) return null;
  const earliest = new Date(now.getTime() + SEND_DELAY_HOURS * 3600 * 1000);
  const queued = queueMessage(store, clinic, {
    to: patient.phone,
    patientId: patient.id,
    kind: "review_request",
    body: reviewRequestSms(clinic, patient),
    earliest
  });
  return store.insert("reviewRequests", {
    patientId: patient.id,
    appointmentId: appointment.id,
    outboxId: queued.id
  });
}
