import fs from "node:fs";

process.env.DRY_RUN = "1";
process.env.DATA_DIR = "./data-demo";
fs.rmSync("./data-demo", { recursive: true, force: true });

const { getClinic } = await import("../src/lib/config.js");
const { getStore } = await import("../src/lib/store.js");
const { runFollowups } = await import("../src/followups/engine.js");
const { runReminderJob } = await import("../src/booking/booking.js");
const { processOutbox } = await import("../src/messaging/outbox.js");
const { handleInboundMessage } = await import("../src/receptionist/receptionist.js");
const { buildDigest } = await import("../src/jobs/scheduler.js");
const { nextAllowedSendTime } = await import("../src/lib/hours.js");

await import("./seed.js");

const clinic = getClinic();
const store = getStore();

console.log("\n--- Simulated after-hours text from a prospective patient ---");
const { reply } = await handleInboundMessage(store, clinic, {
  channel: "sms",
  from: "+15550000099",
  body: "Hi, do you take new patients? My back has been killing me. How much does a visit cost?"
});
console.log("Receptionist reply:", reply);

console.log("\n--- Running nightly automations ---");
const reminders = runReminderJob(store, clinic);
console.log(`Reminders queued: ${reminders}`);
const nudges = runFollowups(store, clinic);
console.log("Follow-up nudges:", nudges.map((n) => n.type).join(", ") || "none");

console.log("\n--- Outbox contents (what would be texted) ---");
for (const m of store.list("outbox")) {
  console.log(`[${m.kind}] -> ${m.to}: ${m.body}`);
}

const sendTime = nextAllowedSendTime(clinic, new Date(Date.now() + 1000));
const result = await processOutbox(store, clinic, { now: sendTime });
console.log(`\nProcessed outbox: sent=${result.sent} skipped=${result.skipped}`);

console.log("\n--- Owner digest ---");
console.log(buildDigest(store, clinic));
