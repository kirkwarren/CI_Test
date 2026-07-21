import { processOutbox } from "../messaging/outbox.js";
import { runReminderJob } from "../booking/booking.js";
import { runFollowups } from "../followups/engine.js";
import { dailySummary } from "../bookkeeping/ledger.js";
import { queueMessage } from "../messaging/outbox.js";
import { ownerDigestSms } from "../messaging/templates.js";
import { tzParts } from "../lib/hours.js";

const OUTBOX_INTERVAL_MS = 60 * 1000;
const HOURLY_INTERVAL_MS = 60 * 60 * 1000;

export function startScheduler(store, clinic) {
  const timers = [
    setInterval(() => {
      processOutbox(store, clinic).catch((err) => console.error("outbox job failed", err));
    }, OUTBOX_INTERVAL_MS),
    setInterval(() => {
      try {
        hourlyTick(store, clinic);
      } catch (err) {
        console.error("hourly job failed", err);
      }
    }, HOURLY_INTERVAL_MS)
  ];
  hourlyTick(store, clinic);
  return () => timers.forEach(clearInterval);
}

export function hourlyTick(store, clinic, now = new Date()) {
  runReminderJob(store, clinic, now);

  const todayKey = dayKey(now, clinic.timezone);
  if (store.getMeta("lastFollowupsDay") !== todayKey) {
    runFollowups(store, clinic, now);
    store.setMeta("lastFollowupsDay", todayKey);
  }

  const { hhmm } = tzParts(now, clinic.timezone);
  if (hhmm >= clinic.digestTime && store.getMeta("lastDigestDay") !== todayKey) {
    sendOwnerDigest(store, clinic, now);
    store.setMeta("lastDigestDay", todayKey);
  }
}

export function buildDigest(store, clinic, now = new Date()) {
  const todayKey = dayKey(now, clinic.timezone);
  const tomorrowKey = dayKey(new Date(now.getTime() + 24 * 3600 * 1000), clinic.timezone);
  const appointments = store.list("appointments");
  const todays = appointments.filter((a) => dayKey(new Date(a.startIso), clinic.timezone) === todayKey);
  const money = dailySummary(store, clinic, now);
  return {
    completed: todays.filter((a) => a.status === "completed").length,
    noShows: todays.filter((a) => a.status === "no_show").length,
    upcomingTomorrow: appointments.filter(
      (a) => a.status === "confirmed" && dayKey(new Date(a.startIso), clinic.timezone) === tomorrowKey
    ).length,
    paymentsTotal: money.paymentsTotal,
    messagesSent: store.list(
      "outbox",
      (m) => m.status === "sent" && m.sentAt && dayKey(new Date(m.sentAt), clinic.timezone) === todayKey
    ).length,
    openFollowups: store.list("followups", (f) => f.status === "open").length
  };
}

function sendOwnerDigest(store, clinic, now) {
  const digest = buildDigest(store, clinic, now);
  queueMessage(store, clinic, {
    to: clinic.ownerPhone,
    kind: "owner_digest",
    body: ownerDigestSms(clinic, digest)
  });
}

function dayKey(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}
