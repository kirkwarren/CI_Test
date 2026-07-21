import { evaluateFollowups } from "./rules.js";
import { queueMessage } from "../messaging/outbox.js";
import {
  noShowNudgeSms,
  planOfCareNudgeSms,
  packageExpiringSms,
  dormantReengagementSms
} from "../messaging/templates.js";

export function runFollowups(store, clinic, now = new Date()) {
  const nudges = evaluateFollowups(
    {
      patients: store.list("patients"),
      appointments: store.list("appointments"),
      recentNudges: store.list("followups", (f) => f.kind === "nudge")
    },
    now
  );

  for (const nudge of nudges) {
    const patient = store.get("patients", nudge.patientId);
    if (!patient) continue;
    let body;
    switch (nudge.type) {
      case "no_show":
        body = noShowNudgeSms(clinic, patient);
        break;
      case "plan_of_care_gap":
        body = planOfCareNudgeSms(clinic, patient);
        break;
      case "package_expiring": {
        const pkg = clinic.packages.find((p) => p.id === nudge.packageId) || { name: "package" };
        body = packageExpiringSms(clinic, patient, pkg, nudge.remaining);
        break;
      }
      case "dormant":
        body = dormantReengagementSms(clinic, patient);
        break;
      default:
        continue;
    }
    queueMessage(store, clinic, {
      to: patient.phone,
      patientId: patient.id,
      kind: `nudge_${nudge.type}`,
      body
    });
    store.insert("followups", { kind: "nudge", type: nudge.type, patientId: patient.id, status: "sent" });
  }

  return nudges;
}
