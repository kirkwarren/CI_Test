import test from "node:test";
import assert from "node:assert/strict";
import {
  recordCharge,
  recordPayment,
  recordPackageSale,
  patientBalance,
  dailySummary,
  agingReport,
  toQuickBooksCsv
} from "../src/bookkeeping/ledger.js";
import { tempStore, testClinic } from "./helpers.js";

test("charges and payments net out in patient balance", () => {
  const store = tempStore();
  const p = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555" });
  recordCharge(store, { patientId: p.id, description: "Visit", amount: 110 });
  recordPayment(store, { patientId: p.id, amount: 60 });
  assert.equal(patientBalance(store, p.id), 50);
});

test("package sale attaches package to patient and settles to zero balance", () => {
  const store = tempStore();
  const p = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555" });
  recordPackageSale(store, testClinic, { patientId: p.id, packageId: "recovery-6" });
  const patient = store.get("patients", p.id);
  assert.equal(patient.packages.length, 1);
  assert.equal(patient.packages[0].visitsTotal, 6);
  assert.equal(patientBalance(store, p.id), 0);
});

test("dailySummary totals today's entries", () => {
  const store = tempStore();
  const p = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555" });
  recordCharge(store, { patientId: p.id, description: "Visit", amount: 110 });
  recordPayment(store, { patientId: p.id, amount: 110 });
  const summary = dailySummary(store, testClinic);
  assert.equal(summary.chargesTotal, 110);
  assert.equal(summary.paymentsTotal, 110);
});

test("agingReport lists only outstanding balances", () => {
  const store = tempStore();
  const paidUp = store.insert("patients", { firstName: "A", lastName: "B", phone: "+1555" });
  const owing = store.insert("patients", { firstName: "C", lastName: "D", phone: "+1556" });
  recordCharge(store, { patientId: paidUp.id, description: "Visit", amount: 110 });
  recordPayment(store, { patientId: paidUp.id, amount: 110 });
  recordCharge(store, { patientId: owing.id, description: "Visit", amount: 150, date: new Date(Date.now() - 40 * 86400000) });
  const rows = agingReport(store);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].patientId, owing.id);
  assert.equal(rows[0].balance, 150);
  assert.ok(rows[0].oldestChargeDays >= 39);
});

test("QuickBooks CSV export escapes and signs amounts", () => {
  const store = tempStore();
  const p = store.insert("patients", { firstName: "Ann, Marie", lastName: "B", phone: "+1555" });
  recordCharge(store, { patientId: p.id, description: 'Visit "eval"', amount: 150 });
  recordPayment(store, { patientId: p.id, amount: 150 });
  const csv = toQuickBooksCsv(store);
  const lines = csv.split("\n");
  assert.equal(lines[0], "Date,Type,Description,Amount,Patient");
  assert.ok(lines[1].includes("-150.00"));
  assert.ok(lines[2].includes("150.00"));
  assert.ok(csv.includes('"Visit ""eval"""'));
  assert.ok(csv.includes('"Ann, Marie B"'));
});
