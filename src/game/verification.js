// GlowUp — verified cleanup engine.
//
// The product spec is explicit: never trust a single signal. A cleanup is scored
// by combining many independent signals into a confidence value, which maps to a
// verification tier. Separately, an Impact Score is computed from weighted
// components so that raw bag weight can never dominate the rankings.
//
// This module is intentionally pure (no React, no storage) so it can be unit
// tested and reasoned about on its own.

// Verification tiers, strongest last. Higher tiers carry more weight in civic
// reporting and unlock stronger rewards.
export const TIERS = {
  REVIEW: {
    key: 'REVIEW', label: 'Needs Review', glow: 'amber',
    blurb: 'Some signals looked unusual. Rewards are held pending a quick review — this is quiet and appealable.',
  },
  GLOW: {
    key: 'GLOW', label: 'Glow Verified', glow: 'emerald',
    blurb: 'Present on site, plausible time spent, in-app before/after captured, image analysis shows likely improvement.',
  },
  HIGH_IMPACT: {
    key: 'HIGH_IMPACT', label: 'High-Impact Verified', glow: 'cyan',
    blurb: 'All standard signals plus bag/collection evidence and confirmed disposal at a checkpoint.',
  },
  OFFICIAL: {
    key: 'OFFICIAL', label: 'Official Event Verified', glow: 'fuchsia',
    blurb: 'Geofenced event check-in and coordinator/collection-station validation. Counts fully toward city dashboards.',
  },
};

// Weighted components of the Impact Score (must sum to 1.0), straight from spec.
export const IMPACT_WEIGHTS = {
  cleanupQuality: 0.35, // verified quality + item density
  locationPriority: 0.20, // priority/condition of the area
  disposal: 0.15, // proper disposal / recycling confirmation
  consistency: 0.15, // streaks and return participation
  teamEvent: 0.10, // team + event contribution
  community: 0.05, // organizing, recruiting, hazard reporting
};

const clamp01 = (n) => Math.max(0, Math.min(1, n));

// -------------------------------------------------------------------------
// Confidence: blend independent signals into a single 0..1 value.
//
// `signals` is whatever evidence the mission flow gathered. Every field is
// optional; missing evidence simply contributes less confidence rather than
// failing outright. Fraud signals subtract.
// -------------------------------------------------------------------------
export function computeConfidence(signals = {}) {
  const {
    locationConfidence = 0, // 0..1 GPS/geofence plausibility
    dwellRatio = 0, // time spent vs. expected, capped at 1
    movementPlausible = false, // walking/movement looked real (not teleporting)
    beforeCapture = false,
    afterCapture = false,
    improvementScore = 0, // 0..1 image-analysis "looks cleaner"
    bagConfirmed = false,
    disposalConfirmed = false,
    checkpointScanned = false, // QR / station / coordinator
    eventCheckIn = false,
    // fraud signals (each 0..1, higher = more suspicious)
    duplicateImageRisk = 0,
    impossibleTravelRisk = 0,
    deviceMultiAccountRisk = 0,
    repeatLocationRisk = 0,
    deviceTrust = 1, // 0..1 long-run trust for this device/account
  } = signals;

  // Positive evidence, each capped to its max contribution.
  const positive =
    0.22 * clamp01(locationConfidence) +
    0.16 * clamp01(dwellRatio) +
    0.08 * (movementPlausible ? 1 : 0) +
    0.10 * (beforeCapture ? 1 : 0) +
    0.10 * (afterCapture ? 1 : 0) +
    0.14 * clamp01(improvementScore) +
    0.06 * (bagConfirmed ? 1 : 0) +
    0.08 * (disposalConfirmed ? 1 : 0) +
    0.06 * (checkpointScanned ? 1 : 0);

  // Fraud penalties.
  const fraud =
    0.45 * clamp01(duplicateImageRisk) +
    0.40 * clamp01(impossibleTravelRisk) +
    0.35 * clamp01(deviceMultiAccountRisk) +
    0.25 * clamp01(repeatLocationRisk);

  // Trust acts as a gentle multiplier on the net, and event check-in adds a
  // small floor of confidence because it is independently coordinator-backed.
  const base = clamp01(positive - fraud);
  const trusted = clamp01(base * (0.6 + 0.4 * clamp01(deviceTrust)));
  const withEvent = eventCheckIn ? clamp01(trusted + 0.05) : trusted;

  return Math.round(withEvent * 100) / 100;
}

// Highest aggregated fraud signal — used to decide whether to force review.
export function maxFraudSignal(signals = {}) {
  return Math.max(
    signals.duplicateImageRisk || 0,
    signals.impossibleTravelRisk || 0,
    signals.deviceMultiAccountRisk || 0,
    signals.repeatLocationRisk || 0,
  );
}

// Map confidence + evidence to a verification tier.
export function resolveTier(confidence, signals = {}) {
  // Any strong fraud signal, or low confidence, routes to quiet review.
  if (maxFraudSignal(signals) >= 0.5 || confidence < 0.45) return TIERS.REVIEW;

  if (signals.eventCheckIn && (signals.checkpointScanned || signals.disposalConfirmed) && confidence >= 0.6) {
    return TIERS.OFFICIAL;
  }
  if (signals.bagConfirmed && signals.disposalConfirmed && confidence >= 0.7) {
    return TIERS.HIGH_IMPACT;
  }
  return TIERS.GLOW;
}

// Per-tier multiplier applied to the final impact score.
export const TIER_MULTIPLIER = {
  REVIEW: 0.0, // held until cleared
  GLOW: 1.0,
  HIGH_IMPACT: 1.25,
  OFFICIAL: 1.5,
};

// -------------------------------------------------------------------------
// Impact Score: weighted, capped, and never weight-dominated.
//
// `ctx` carries the cleanup particulars and a little player context so the
// consistency / team / community components can be scored.
// -------------------------------------------------------------------------
export function computeImpact(ctx = {}) {
  const {
    confidence = 0,
    tierKey = 'GLOW',
    pieces = 0,
    expectedPieces = 12,
    priority = 1, // 1..5
    underserved = false,
    recycledFraction = 0, // 0..1 of items sorted/recycled
    disposalConfirmed = false,
    streakDays = 0,
    isReturnVisit = false,
    inEvent = false,
    inCrewMission = false,
    organizedOrRecruited = false,
    hazardsReported = 0,
  } = ctx;

  // 35% — cleanup quality: confidence blended with item density vs. expectation.
  const density = clamp01(pieces / Math.max(1, expectedPieces));
  const quality = clamp01(0.6 * confidence + 0.4 * density);

  // 20% — location priority & condition (1..5 scale), bonus for underserved.
  const priorityScore = clamp01((priority - 1) / 4) * (underserved ? 1 : 0.85) + (underserved ? 0.15 : 0);

  // 15% — proper disposal / recycling confirmation.
  const disposalScore = clamp01((disposalConfirmed ? 0.6 : 0) + 0.4 * recycledFraction);

  // 15% — consistency & return participation (streak saturates around 2 weeks).
  const consistencyScore = clamp01(0.7 * clamp01(streakDays / 14) + (isReturnVisit ? 0.3 : 0));

  // 10% — team & event contribution.
  const teamScore = clamp01((inCrewMission ? 0.5 : 0) + (inEvent ? 0.5 : 0));

  // 5% — community leadership (organizing, recruiting, correct hazard reports).
  const communityScore = clamp01((organizedOrRecruited ? 0.6 : 0) + Math.min(0.4, hazardsReported * 0.2));

  const weighted =
    IMPACT_WEIGHTS.cleanupQuality * quality +
    IMPACT_WEIGHTS.locationPriority * priorityScore +
    IMPACT_WEIGHTS.disposal * disposalScore +
    IMPACT_WEIGHTS.consistency * consistencyScore +
    IMPACT_WEIGHTS.teamEvent * teamScore +
    IMPACT_WEIGHTS.community * communityScore;

  // Scale to points, apply tier multiplier, and cap unusually large claims.
  const BASE_POINTS = 1000;
  const ANOMALY_CAP = 1600; // soft cap; anything above is flagged for review elsewhere
  const raw = weighted * BASE_POINTS * (TIER_MULTIPLIER[tierKey] ?? 1);
  const points = Math.round(Math.min(ANOMALY_CAP, raw));

  return {
    points,
    breakdown: {
      cleanupQuality: quality,
      locationPriority: priorityScore,
      disposal: disposalScore,
      consistency: consistencyScore,
      teamEvent: teamScore,
      community: communityScore,
    },
    capped: raw > ANOMALY_CAP,
  };
}

// Estimate pounds removed from item count — tracked as an environmental metric
// only, deliberately NOT a driver of the score (see spec: avoid weight-gaming).
export function estimatePounds(pieces) {
  // ~0.33 lb per item is a rough field heuristic; clamp to avoid silly numbers.
  return Math.round(pieces * 0.33 * 10) / 10;
}
