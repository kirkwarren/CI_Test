import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Store } from "../src/lib/store.js";

export function tempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mmpt-test-"));
  return new Store(dir);
}

export const testClinic = {
  name: "Mindful Movement PT",
  tagline: "Test clinic",
  timezone: "America/New_York",
  phone: "+15551230000",
  ownerName: "Emily",
  ownerPhone: "+15551239999",
  address: "123 Main St",
  bookingUrl: "https://example.com/book",
  googleReviewUrl: "https://example.com/review",
  hours: {
    mon: ["08:00", "18:00"],
    tue: ["08:00", "18:00"],
    wed: ["08:00", "18:00"],
    thu: ["08:00", "18:00"],
    fri: ["08:00", "16:00"],
    sat: null,
    sun: null
  },
  quietHours: { start: "20:00", end: "08:00" },
  digestTime: "17:30",
  services: [
    { id: "eval", name: "Initial Evaluation", durationMin: 60, cashPrice: 150 },
    { id: "followup", name: "Follow-up Session", durationMin: 60, cashPrice: 110 }
  ],
  packages: [
    {
      id: "recovery-6",
      name: "6-Visit Recovery Package",
      visits: 6,
      price: 594,
      expiresDays: 120,
      pitch: "Test pitch",
      pitchWhen: ["pricing_question"]
    }
  ],
  pitchGuidelines: "Prescribed by Emily: only pitch when it fits.",
  receptionistNotes: "Cash-based practice."
};
