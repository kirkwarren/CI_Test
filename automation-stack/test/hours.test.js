import test from "node:test";
import assert from "node:assert/strict";
import { isOpen, inQuietHours, nextAllowedSendTime, tzParts } from "../src/lib/hours.js";
import { testClinic } from "./helpers.js";

// 2026-07-20 is a Monday; America/New_York is UTC-4 in July.

test("tzParts converts to clinic timezone", () => {
  const parts = tzParts(new Date("2026-07-20T14:30:00-04:00"), "America/New_York");
  assert.equal(parts.weekday, "mon");
  assert.equal(parts.hhmm, "14:30");
});

test("isOpen true during Monday business hours", () => {
  assert.equal(isOpen(testClinic, new Date("2026-07-20T10:00:00-04:00")), true);
});

test("isOpen false before opening and after closing", () => {
  assert.equal(isOpen(testClinic, new Date("2026-07-20T07:59:00-04:00")), false);
  assert.equal(isOpen(testClinic, new Date("2026-07-20T18:00:00-04:00")), false);
});

test("isOpen false on closed days", () => {
  assert.equal(isOpen(testClinic, new Date("2026-07-19T12:00:00-04:00")), false);
});

test("quiet hours wrap midnight", () => {
  assert.equal(inQuietHours(testClinic, new Date("2026-07-20T21:00:00-04:00")), true);
  assert.equal(inQuietHours(testClinic, new Date("2026-07-20T06:00:00-04:00")), true);
  assert.equal(inQuietHours(testClinic, new Date("2026-07-20T12:00:00-04:00")), false);
});

test("nextAllowedSendTime defers into the morning", () => {
  const t = nextAllowedSendTime(testClinic, new Date("2026-07-20T22:00:00-04:00"));
  assert.equal(inQuietHours(testClinic, t), false);
  assert.equal(tzParts(t, testClinic.timezone).hhmm, "08:00");
});

test("nextAllowedSendTime is identity outside quiet hours", () => {
  const from = new Date("2026-07-20T12:00:00-04:00");
  assert.equal(nextAllowedSendTime(testClinic, from).getTime(), from.getTime());
});
