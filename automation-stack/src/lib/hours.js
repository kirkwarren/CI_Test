export function tzParts(date, timezone) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
  );
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return {
    weekday: parts.weekday.toLowerCase().slice(0, 3),
    hhmm: `${hour}:${parts.minute}`
  };
}

export function isOpen(clinic, date = new Date()) {
  const { weekday, hhmm } = tzParts(date, clinic.timezone);
  const window = clinic.hours[weekday];
  if (!window) return false;
  const [open, close] = window;
  return hhmm >= open && hhmm < close;
}

export function inQuietHours(clinic, date = new Date()) {
  const { hhmm } = tzParts(date, clinic.timezone);
  const { start, end } = clinic.quietHours;
  if (start > end) return hhmm >= start || hhmm < end;
  return hhmm >= start && hhmm < end;
}

const STEP_MS = 15 * 60 * 1000;

export function nextAllowedSendTime(clinic, from = new Date()) {
  let t = new Date(from);
  for (let i = 0; i < (24 * 60) / 15 && inQuietHours(clinic, t); i++) {
    t = new Date(t.getTime() + STEP_MS);
  }
  return t;
}

export function nextOpenTime(clinic, from = new Date()) {
  let t = new Date(from);
  for (let i = 0; i < (7 * 24 * 60) / 15 && !isOpen(clinic, t); i++) {
    t = new Date(t.getTime() + STEP_MS);
  }
  return t;
}
