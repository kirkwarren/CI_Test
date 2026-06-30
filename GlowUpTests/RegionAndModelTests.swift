import XCTest
@testable import GlowUp

final class RegionAndModelTests: XCTestCase {
    func testScopesForFullRegion() {
        let r = ResolvedRegion(neighborhoodID: "n", cityID: "c", stateCode: "UT", geohash: "9xj")
        let scopes = LeaderboardScope.scopes(for: r)
        XCTAssertEqual(scopes, [.global, .state(code: "UT"), .city(id: "c"), .neighborhood(id: "n")])
    }

    func testScopesForPartialRegion() {
        let r = ResolvedRegion(cityID: "c", stateCode: "UT", geohash: "9xj") // no neighborhood
        let scopes = LeaderboardScope.scopes(for: r)
        XCTAssertEqual(scopes, [.global, .state(code: "UT"), .city(id: "c")])
    }

    func testScopeKeysAreStable() {
        XCTAssertEqual(LeaderboardScope.global.key, "global")
        XCTAssertEqual(LeaderboardScope.state(code: "UT").key, "state:UT")
        XCTAssertEqual(LeaderboardScope.city(id: "slc").key, "city:slc")
        XCTAssertEqual(LeaderboardScope.neighborhood(id: "dt").key, "neighborhood:dt")
    }

    func testQuarterSeason() {
        XCTAssertEqual(Season.quarter(year: 2026, month: 1).id, "2026-Q1")
        XCTAssertEqual(Season.quarter(year: 2026, month: 6).id, "2026-Q2")
        XCTAssertEqual(Season.quarter(year: 2026, month: 9).id, "2026-Q3")
        XCTAssertEqual(Season.quarter(year: 2026, month: 12).id, "2026-Q4")
    }

    func testStubRegionResolverMatchesSeed() async {
        let resolver = StubRegionResolver()
        let r = await resolver.resolve(latitude: 40.7608, longitude: -111.8910)
        XCTAssertEqual(r.cityName, "Salt Lake City")
        XCTAssertEqual(r.stateCode, "UT")
        XCTAssertEqual(r.geohash.count, 7)
    }

    func testPlayerLevelCurve() {
        XCTAssertEqual(Player(xp: 0).level, 1)
        XCTAssertEqual(Player(xp: 250).level, 2)
        XCTAssertEqual(Player(xp: 1000).level, 3)
    }

    func testPoundsConversion() {
        let p = Player(gramsRemoved: 453.592)
        XCTAssertEqual(p.poundsRemoved, 1.0, accuracy: 0.05)
    }

    func testCategoryMapsToExpectedSpecies() {
        XCTAssertEqual(LitterCategory.plasticBottle.species.name, "Bottlebrute")
        XCTAssertEqual(LitterCategory.aluminumCan.species.stream, .metal)
        XCTAssertEqual(LitterCategory.glassBottle.species.rarity, .uncommon)
        XCTAssertEqual(LitterLabelMap.category(for: "plastic_bottle"), .plasticBottle)
        XCTAssertEqual(LitterLabelMap.category(for: "unknown_thing"), .other)
    }
}

final class AppEnvironmentTests: XCTestCase {
    @MainActor
    func testBanishAwardsPointsAndRanksPlayer() async {
        let env = AppEnvironment.preview()
        let species = LitterCategory.plasticBottle.species
        let gremlin = Gremlin(id: "g1", species: species, confidence: 0.9,
                              anchorBox: BoundingBox(x: 0.4, y: 0.5, width: 0.1, height: 0.1),
                              confirmedAt: 0)
        let evidence = DisposalEvidence(bagged: true, sortedStream: .plastic,
                                        checkpointScanned: false, dwellSeconds: 5, afterCaptured: true)

        let before = env.player.glowPoints
        let result = await env.banish(gremlin, evidence: evidence, regionPriority: 3)

        XCTAssertFalse(result.heldForReview)
        XCTAssertGreaterThan(env.player.glowPoints, before)
        XCTAssertEqual(env.comboStreak, 1)

        // Fallback region is Downtown SLC; player should now appear there.
        let rank = await env.leaderboard.rank(playerID: env.player.id,
                                              scope: .neighborhood(id: "slc-downtown"),
                                              season: env.season)
        XCTAssertNotNil(rank)
    }

    @MainActor
    func testHeldBanishDoesNotAwardPoints() async {
        let env = AppEnvironment.preview()
        let gremlin = Gremlin(id: "g2", species: LitterCategory.cup.species, confidence: 0.9,
                              anchorBox: BoundingBox(x: 0.4, y: 0.5, width: 0.1, height: 0.1),
                              confirmedAt: 0)
        // Missing bag + after capture → held for review.
        let evidence = DisposalEvidence(bagged: false, afterCaptured: false)
        let before = env.player.glowPoints
        let result = await env.banish(gremlin, evidence: evidence)
        XCTAssertTrue(result.heldForReview)
        XCTAssertEqual(env.player.glowPoints, before)
        XCTAssertEqual(env.comboStreak, 0)
    }
}
