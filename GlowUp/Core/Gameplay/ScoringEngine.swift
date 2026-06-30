import Foundation

/// Context for scoring a single banished gremlin.
public struct ScoringContext {
    public var species: GremlinSpecies
    public var evidence: DisposalEvidence
    /// Detector confidence at confirmation (0...1).
    public var detectionConfidence: Double
    /// How many gremlins the player has banished in an unbroken combo.
    public var comboStreak: Int
    /// Priority/condition of the area (1 = pristine ... 5 = blighted/underserved).
    public var regionPriority: Int
    /// A sanctioned live event is active here.
    public var eventActive: Bool
    /// The player's private trust score (0...1).
    public var trustScore: Double

    public init(species: GremlinSpecies,
                evidence: DisposalEvidence,
                detectionConfidence: Double,
                comboStreak: Int = 0,
                regionPriority: Int = 1,
                eventActive: Bool = false,
                trustScore: Double = 0.7) {
        self.species = species
        self.evidence = evidence
        self.detectionConfidence = detectionConfidence
        self.comboStreak = comboStreak
        self.regionPriority = regionPriority
        self.eventActive = eventActive
        self.trustScore = trustScore
    }
}

public struct ScoreBreakdown: Equatable {
    public let basePoints: Int
    public let comboMultiplier: Double
    public let priorityMultiplier: Double
    public let sortingBonus: Double
    public let eventMultiplier: Double
    public let total: Int
    /// True when evidence/plausibility is too weak to award now — the banish is
    /// recorded but points are held for a quiet review.
    public let heldForReview: Bool

    public var gramsRemoved: Double
}

/// Pure scoring logic. Deliberately *not* dominated by litter weight: weight is
/// tracked as an environmental metric, but points come from verified clearing,
/// correct sorting, area priority, combos, and events — so there's no incentive
/// to drag heavy junk from home.
public enum ScoringEngine {
    /// Hard cap so a single banish can't produce an absurd score (anti-cheat).
    public static let perBanishCap = 600

    public static func score(_ ctx: ScoringContext) -> ScoreBreakdown {
        let species = ctx.species

        // Verification gate: a banish must be a real pickup with an after-shot,
        // and the detection must have been confident enough. Otherwise hold it.
        let plausibleDwell = ctx.evidence.dwellSeconds >= 3
        let verified = ctx.evidence.bagged
            && ctx.evidence.afterCaptured
            && ctx.detectionConfidence >= 0.6
            && plausibleDwell
        let suspicious = ctx.trustScore < 0.35

        let base = species.rarity.basePoints

        // Combo: +10% per consecutive banish, capped at +100%.
        let combo = 1.0 + min(Double(max(0, ctx.comboStreak)), 10) * 0.1

        // Priority: pristine areas worth less; blighted/underserved worth more.
        let priority = 0.8 + Double(max(1, min(5, ctx.regionPriority)) - 1) * 0.1 // 0.8 ... 1.2

        // Correct sorting into the matching recycling stream.
        let sorting = ctx.evidence.sortedCorrectly(for: species) ? 1.25 : 1.0

        // Sanctioned live event.
        let event = ctx.eventActive ? 1.5 : 1.0

        let rawTotal = Double(base) * combo * priority * sorting * event
        let capped = min(Double(perBanishCap), rawTotal)
        let held = !verified || suspicious
        let total = held ? 0 : Int(capped.rounded())

        return ScoreBreakdown(
            basePoints: base,
            comboMultiplier: combo,
            priorityMultiplier: priority,
            sortingBonus: sorting,
            eventMultiplier: event,
            total: total,
            heldForReview: held,
            gramsRemoved: species.estimatedGrams)
    }
}
