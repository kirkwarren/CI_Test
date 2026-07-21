import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFollowups } from "../src/followups/rules.js";

const DAY = 24 * 3600 * 1000;
const now = new Date("2026-07-20T12:00:00-04:00");
const ago = (days) => new Date(now.getTime() - days * DAY).toISOString();
const ahead = (days) => new Date(now.getTime() + days * DAY).toISOString();

function patient(overrides = {}) {
  return { id: "p1", phone: "+15550001111", optedOut: false, packages: [], ...overrides };
}

test("recent no-show with no future booking triggers nudge", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient()],
      appointments: [{ patientId: "p1", startIso: ago(1), status: "no_show" }],
      recentNudges: []
    },
    now
  );
  assert.deepEqual(nudges.map((n) => n.type), ["no_show"]);
});

test("no-show with a future booking does not trigger", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient()],
      appointments: [
        { patientId: "p1", startIso: ago(1), status: "no_show" },
        { patientId: "p1", startIso: ahead(2), status: "confirmed" }
      ],
      recentNudges: []
    },
    now
  );
  assert.equal(nudges.length, 0);
});

test("plan-of-care gap triggers after 10 days without future booking", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient({ activePlanOfCare: true })],
      appointments: [{ patientId: "p1", startIso: ago(12), status: "completed" }],
      recentNudges: []
    },
    now
  );
  assert.deepEqual(nudges.map((n) => n.type), ["plan_of_care_gap"]);
});

test("expiring package with remaining visits triggers", () => {
  const nudges = evaluateFollowups(
    {
      patients: [
        patient({
          packages: [{ packageId: "recovery-6", visitsTotal: 6, visitsUsed: 4, expiresAt: ahead(7) }]
        })
      ],
      appointments: [],
      recentNudges: []
    },
    now
  );
  assert.equal(nudges[0].type, "package_expiring");
  assert.equal(nudges[0].remaining, 2);
});

test("fully used package does not trigger expiry nudge", () => {
  const nudges = evaluateFollowups(
    {
      patients: [
        patient({
          packages: [{ packageId: "recovery-6", visitsTotal: 6, visitsUsed: 6, expiresAt: ahead(7) }]
        })
      ],
      appointments: [],
      recentNudges: []
    },
    now
  );
  assert.equal(nudges.length, 0);
});

test("dormant patient triggers re-engagement", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient()],
      appointments: [{ patientId: "p1", startIso: ago(70), status: "completed" }],
      recentNudges: []
    },
    now
  );
  assert.deepEqual(nudges.map((n) => n.type), ["dormant"]);
});

test("cooldown suppresses repeat nudges", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient()],
      appointments: [{ patientId: "p1", startIso: ago(1), status: "no_show" }],
      recentNudges: [{ patientId: "p1", type: "no_show", createdAt: ago(3) }]
    },
    now
  );
  assert.equal(nudges.length, 0);
});

test("opted-out patients are never nudged", () => {
  const nudges = evaluateFollowups(
    {
      patients: [patient({ optedOut: true })],
      appointments: [{ patientId: "p1", startIso: ago(1), status: "no_show" }],
      recentNudges: []
    },
    now
  );
  assert.equal(nudges.length, 0);
});
