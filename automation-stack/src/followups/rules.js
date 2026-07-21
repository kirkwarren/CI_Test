const DAY_MS = 24 * 60 * 60 * 1000;

export const COOLDOWN_DAYS = 14;
export const NO_SHOW_LOOKBACK_DAYS = 2;
export const PLAN_GAP_DAYS = 10;
export const PACKAGE_EXPIRY_WARN_DAYS = 14;
export const DORMANT_DAYS = 60;
export const DORMANT_COOLDOWN_DAYS = 90;

export function evaluateFollowups({ patients, appointments, recentNudges }, now = new Date()) {
  const nudges = [];
  const nowMs = now.getTime();

  const nudgedRecently = (patientId, type, cooldownDays = COOLDOWN_DAYS) =>
    recentNudges.some(
      (n) =>
        n.patientId === patientId &&
        n.type === type &&
        nowMs - Date.parse(n.createdAt) < cooldownDays * DAY_MS
    );

  for (const patient of patients) {
    if (patient.optedOut) continue;
    const theirAppointments = appointments.filter((a) => a.patientId === patient.id);
    const future = theirAppointments.filter(
      (a) => a.status === "confirmed" && Date.parse(a.startIso) > nowMs
    );
    const past = theirAppointments
      .filter((a) => Date.parse(a.startIso) <= nowMs)
      .sort((a, b) => Date.parse(b.startIso) - Date.parse(a.startIso));
    const lastVisit = past.find((a) => a.status === "completed");

    const recentNoShow = past.find(
      (a) => a.status === "no_show" && nowMs - Date.parse(a.startIso) < NO_SHOW_LOOKBACK_DAYS * DAY_MS
    );
    if (recentNoShow && future.length === 0 && !nudgedRecently(patient.id, "no_show")) {
      nudges.push({ patientId: patient.id, type: "no_show" });
      continue;
    }

    for (const pkg of patient.packages || []) {
      const remaining = pkg.visitsTotal - pkg.visitsUsed;
      const expiresMs = Date.parse(pkg.expiresAt);
      const expiringSoon = expiresMs > nowMs && expiresMs - nowMs < PACKAGE_EXPIRY_WARN_DAYS * DAY_MS;
      if (remaining > 0 && expiringSoon && !nudgedRecently(patient.id, "package_expiring")) {
        nudges.push({ patientId: patient.id, type: "package_expiring", packageId: pkg.packageId, remaining });
      }
    }

    if (
      patient.activePlanOfCare &&
      lastVisit &&
      future.length === 0 &&
      nowMs - Date.parse(lastVisit.startIso) > PLAN_GAP_DAYS * DAY_MS &&
      nowMs - Date.parse(lastVisit.startIso) <= DORMANT_DAYS * DAY_MS &&
      !nudgedRecently(patient.id, "plan_of_care_gap")
    ) {
      nudges.push({ patientId: patient.id, type: "plan_of_care_gap" });
      continue;
    }

    if (
      lastVisit &&
      future.length === 0 &&
      nowMs - Date.parse(lastVisit.startIso) > DORMANT_DAYS * DAY_MS &&
      !nudgedRecently(patient.id, "dormant", DORMANT_COOLDOWN_DAYS)
    ) {
      nudges.push({ patientId: patient.id, type: "dormant" });
    }
  }

  return nudges;
}
