import XCTest
@testable import GlowUp

final class AwardServiceTests: XCTestCase {
    private let season = Season(id: "2026-Q2", displayName: "Q2 2026")
    private let svc = AwardService()

    private func entry(_ id: String, rank: Int) -> LeaderboardEntry {
        LeaderboardEntry(playerID: id, displayName: id, points: 100, gremlinsCleared: 10, rank: rank)
    }

    func testNeighborhoodWinnerGetsGrant() {
        let award = svc.seasonTopAward(scope: .neighborhood(id: "downtown"),
                                       regionName: "Downtown", season: season,
                                       winner: entry("ava", rank: 1))
        XCTAssertNotNil(award)
        XCTAssertEqual(award?.grantUSD, AwardConfig().neighborhoodTopGrantUSD)
        XCTAssertEqual(award?.reason, .seasonTopRegion)
        XCTAssertFalse(award?.projectOptions.isEmpty ?? true)
    }

    func testNonWinnerGetsNoAward() {
        let award = svc.seasonTopAward(scope: .neighborhood(id: "downtown"),
                                       regionName: "Downtown", season: season,
                                       winner: entry("ava", rank: 2))
        XCTAssertNil(award)
    }

    func testGlobalAndStateHaveNoTopRegionAward() {
        XCTAssertNil(svc.seasonTopAward(scope: .global, regionName: "Everywhere",
                                        season: season, winner: entry("ava", rank: 1)))
        XCTAssertNil(svc.seasonTopAward(scope: .state(code: "UT"), regionName: "Utah",
                                        season: season, winner: entry("ava", rank: 1)))
    }

    func testCityWinnerGetsLargerGrant() {
        let award = svc.seasonTopAward(scope: .city(id: "slc"), regionName: "Salt Lake City",
                                       season: season, winner: entry("ava", rank: 1))
        XCTAssertEqual(award?.grantUSD, AwardConfig().cityTopGrantUSD)
        XCTAssertGreaterThan(AwardConfig().cityTopGrantUSD, AwardConfig().neighborhoodTopGrantUSD)
    }

    func testMilestonesUnlockByThreshold() {
        let none = svc.milestoneAwards(scope: .city(id: "slc"), regionName: "SLC",
                                       season: season, totalCleared: 100)
        XCTAssertTrue(none.isEmpty)

        let two = svc.milestoneAwards(scope: .city(id: "slc"), regionName: "SLC",
                                      season: season, totalCleared: 6000)
        XCTAssertEqual(two.count, 2, "1,000 and 5,000 milestones unlocked at 6,000")
        XCTAssertTrue(two.allSatisfy { $0.reason == .milestone })

        let all = svc.milestoneAwards(scope: .city(id: "slc"), regionName: "SLC",
                                      season: season, totalCleared: 30000)
        XCTAssertEqual(all.count, 3)
    }

    func testVotingFundsProject() {
        var award = svc.seasonTopAward(scope: .neighborhood(id: "downtown"),
                                       regionName: "Downtown", season: season,
                                       winner: entry("ava", rank: 1))!
        XCTAssertEqual(award.status, .pendingVote)
        award = svc.fund(award, projectID: "trees")
        XCTAssertEqual(award.status, .funded)
        XCTAssertEqual(award.fundedProjectID, "trees")
    }

    func testVotingUnknownProjectIsIgnored() {
        let award = svc.seasonTopAward(scope: .neighborhood(id: "downtown"),
                                       regionName: "Downtown", season: season,
                                       winner: entry("ava", rank: 1))!
        let result = svc.fund(award, projectID: "does-not-exist")
        XCTAssertEqual(result.status, .pendingVote)
        XCTAssertNil(result.fundedProjectID)
    }
}
