const DAY_MS = 24 * 60 * 60 * 1000;

export function recordCharge(store, { patientId, description, amount, date = new Date() }) {
  return store.insert("ledger", {
    type: "charge",
    patientId,
    description,
    amount: round2(amount),
    date: date.toISOString()
  });
}

export function recordPayment(store, { patientId, description = "Payment", amount, method = "card", date = new Date() }) {
  return store.insert("ledger", {
    type: "payment",
    patientId,
    description,
    method,
    amount: round2(amount),
    date: date.toISOString()
  });
}

export function recordPackageSale(store, clinic, { patientId, packageId, date = new Date() }) {
  const pkg = clinic.packages.find((p) => p.id === packageId);
  if (!pkg) throw new Error(`Unknown package ${packageId}`);
  const patient = store.get("patients", patientId);
  if (!patient) throw new Error(`Unknown patient ${patientId}`);
  patient.packages ||= [];
  patient.packages.push({
    packageId,
    purchasedAt: date.toISOString(),
    visitsTotal: pkg.visits,
    visitsUsed: 0,
    expiresAt: new Date(date.getTime() + pkg.expiresDays * DAY_MS).toISOString()
  });
  store.save();
  recordCharge(store, { patientId, description: `Package sale: ${pkg.name}`, amount: pkg.price, date });
  return recordPayment(store, { patientId, description: `Package payment: ${pkg.name}`, amount: pkg.price, date });
}

export function patientBalance(store, patientId) {
  return store
    .list("ledger", (e) => e.patientId === patientId)
    .reduce((sum, e) => sum + (e.type === "charge" ? e.amount : -e.amount), 0);
}

export function dailySummary(store, clinic, date = new Date()) {
  const dayKey = dateKey(date, clinic.timezone);
  const entries = store.list("ledger", (e) => dateKey(new Date(e.date), clinic.timezone) === dayKey);
  const charges = entries.filter((e) => e.type === "charge");
  const payments = entries.filter((e) => e.type === "payment");
  return {
    date: dayKey,
    chargesTotal: round2(charges.reduce((s, e) => s + e.amount, 0)),
    paymentsTotal: round2(payments.reduce((s, e) => s + e.amount, 0)),
    chargeCount: charges.length,
    paymentCount: payments.length
  };
}

export function agingReport(store, now = new Date()) {
  const balances = new Map();
  for (const entry of store.list("ledger")) {
    if (!entry.patientId) continue;
    const current = balances.get(entry.patientId) || { balance: 0, oldestChargeMs: null };
    current.balance += entry.type === "charge" ? entry.amount : -entry.amount;
    if (entry.type === "charge") {
      const ms = Date.parse(entry.date);
      if (current.oldestChargeMs === null || ms < current.oldestChargeMs) current.oldestChargeMs = ms;
    }
    balances.set(entry.patientId, current);
  }
  const rows = [];
  for (const [patientId, { balance, oldestChargeMs }] of balances) {
    if (balance <= 0.005) continue;
    const days = oldestChargeMs ? Math.floor((now.getTime() - oldestChargeMs) / DAY_MS) : 0;
    rows.push({ patientId, balance: round2(balance), oldestChargeDays: days });
  }
  return rows.sort((a, b) => b.balance - a.balance);
}

export function toQuickBooksCsv(store, entries = store.list("ledger")) {
  const header = "Date,Type,Description,Amount,Patient";
  const lines = entries.map((e) => {
    const patient = e.patientId ? store.get("patients", e.patientId) : null;
    const name = patient ? `${patient.firstName} ${patient.lastName}` : "";
    const signed = e.type === "payment" ? e.amount : -e.amount;
    return [e.date.slice(0, 10), e.type, csvCell(e.description), signed.toFixed(2), csvCell(name)].join(",");
  });
  return [header, ...lines].join("\n");
}

function csvCell(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function dateKey(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
