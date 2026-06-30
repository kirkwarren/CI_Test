import XCTest
@testable import GlowUp

final class ScoringEngineTests: XCTestCase {
    private func verifiedEvidence(stream: RecyclingStream?) -> DisposalEvidence {
        DisposalEvidence(bagged: true, sortedStream: stream, checkpointScanned: false,
                         dwellSeconds: 5, afterCaptured: true)
    }

    func testVerifiedBottleCorrectlySortedScores() {
        let species = LitterCategory.plasticBottle.species // base 10, stream .plastic
        let ctx = ScoringContext(species: species, evidence: verifiedEvidence(stream: .plastic),
                                 detectionConfidence: 0.85, comboStreak: 0, regionPriority: 3)
        let r = ScoringEngine.score(ctx)
        // 10 * combo 1.0 * priority 1.0 * sorting 1.25 * event 1.0 = 12.5 -> 13
        XCTAssertEqual(r.total, 13)
        XCTAssertFalse(r.heldForReview)
        XCTAssertEqual(r.gramsRemoved, species.estimatedGrams)
    }

    func testWrongSortingLosesBonus() {
        let species = LitterCategory.plasticBottle.species
        let ctx = ScoringContext(species: species, evidence: verifiedEvidence(stream: .landfill),
                                 detectionConfidence: 0.85, regionPriority: 3)
        XCTAssertEqual(ScoringEngine.score(ctx).total, 10)
    }

    func testMissingEvidenceIsHeldForReview() {
        let species = LitterCategory.cup.species
        // Not bagged, no after capture.
        let ctx = ScoringContext(species: species,
                                 evidence: DisposalEvidence(bagged: false, afterCaptured: false),
                                 detectionConfidence: 0.85)
        let r = ScoringEngine.score(ctx)
        XCTAssertTrue(r.heldForReview)
        XCTAssertEqual(r.total, 0)
    }

    func testLowDetectionConfidenceIsHeld() {
        let species = LitterCategory.cup.species
        let ctx = ScoringContext(species: species, evidence: verifiedEvidence(stream: .landfill),
                                 detectionConfidence: 0.4)
        XCTAssertTrue(ScoringEngine.score(ctx).heldForReview)
    }

    func testLowTrustIsHeldEvenWhenVerified() {
        let species = LitterCategory.cup.species
        let ctx = ScoringContext(species: species, evidence: verifiedEvidence(stream: .landfill),
                                 detectionConfidence: 0.9, regionPriority: 3, trustScore: 0.3)
        XCTAssertTrue(ScoringEngine.score(ctx).heldForReview)
    }

    func testComboAndPriorityIncreaseScore() {
        let species = LitterCategory.cup.species // base 10
        let low = ScoringContext(species: species, evidence: verifiedEvidence(stream: .landfill),
                                 detectionConfidence: 0.9, comboStreak: 0, regionPriority: 1)
        let high = ScoringContext(species: species, evidence: verifiedEvidence(stream: .landfill),
                                  detectionConfidence: 0.9, comboStreak: 5, regionPriority: 5)
        XCTAssertGreaterThan(ScoringEngine.score(high).total, ScoringEngine.score(low).total)
    }

    func testScoreNeverExceedsCap() {
        let species = LitterCategory.glassBottle.species // uncommon; use legendary-style max via event
        let ctx = ScoringContext(species: species,
                                 evidence: DisposalEvidence(bagged: true, sortedStream: .glass,
                                                            checkpointScanned: true, dwellSeconds: 30, afterCaptured: true),
                                 detectionConfidence: 1.0, comboStreak: 50, regionPriority: 5,
                                 eventActive: true, trustScore: 1.0)
        XCTAssertLessThanOrEqual(ScoringEngine.score(ctx).total, ScoringEngine.perBanishCap)
    }

    func testWeightDoesNotDominate() {
        // A heavy glass bottle sorted wrong should not beat a light item sorted
        // right + combo: proves weight isn't the scoring driver.
        let heavy = ScoringContext(species: LitterCategory.glassBottle.species, // 200g
                                   evidence: verifiedEvidence(stream: .landfill), // wrong stream
                                   detectionConfidence: 0.9, comboStreak: 0, regionPriority: 1)
        let light = ScoringContext(species: LitterCategory.cigarette.species, // 1g
                                   evidence: verifiedEvidence(stream: .landfill), // correct for Buttgrub
                                   detectionConfidence: 0.9, comboStreak: 8, regionPriority: 5)
        XCTAssertGreaterThan(ScoringEngine.score(light).total, ScoringEngine.score(heavy).total)
    }
}
