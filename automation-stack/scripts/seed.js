import { getClinic } from "../src/lib/config.js";
import { getStore } from "../src/lib/store.js";
import { recordPackageSale, recordPayment } from "../src/bookkeeping/ledger.js";

const clinic = getClinic();
const store = getStore();

const DAY = 24 * 3600 * 1000;
const now = Date.now();

function addPatient(fields) {
  return store.insert("patients", { optedOut: false, packages: [], activePlanOfCare: false, ...fields });
}

const maria = addPatient({ firstName: "Maria", lastName: "Lopez", phone: "+15550000001", activePlanOfCare: true });
const james = addPatient({ firstName: "James", lastName: "Chen", phone: "+15550000002", activePlanOfCare: true });
const priya = addPatient({ firstName: "Priya", lastName: "Patel", phone: "+15550000003" });
const dan = addPatient({ firstName: "Dan", lastName: "Wright", phone: "+15550000004" });

store.insert("appointments", {
  patientId: maria.id,
  serviceId: "followup",
  startIso: new Date(now - 12 * DAY).toISOString(),
  durationMin: 60,
  status: "completed",
  reminderSent: true
});

store.insert("appointments", {
  patientId: james.id,
  serviceId: "followup",
  startIso: new Date(now - 1 * DAY).toISOString(),
  durationMin: 60,
  status: "no_show",
  reminderSent: true
});

store.insert("appointments", {
  patientId: priya.id,
  serviceId: "wellness",
  startIso: new Date(now - 70 * DAY).toISOString(),
  durationMin: 45,
  status: "completed",
  reminderSent: true
});

store.insert("appointments", {
  patientId: dan.id,
  serviceId: "eval",
  startIso: new Date(now + 25 * 3600 * 1000).toISOString(),
  durationMin: 60,
  status: "confirmed",
  reminderSent: false
});

recordPackageSale(store, clinic, { patientId: maria.id, packageId: "recovery-6", date: new Date(now - 110 * DAY) });
const pkg = maria.packages[0];
pkg.visitsUsed = 4;
pkg.expiresAt = new Date(now + 8 * DAY).toISOString();
store.save();

recordPayment(store, { patientId: dan.id, amount: 150, description: "Eval deposit" });

console.log(`Seeded ${store.list("patients").length} patients, ${store.list("appointments").length} appointments into ${store.dir}`);
