import XCTest
@testable import GlowUp

final class LeaderboardServiceTests: XCTestCase {
    private let season = Season(id: "2026-Q2", displayName: "Q2 2026")

    private func region(neighborhood: String, city: String, state: String) -> ResolvedRegion {
        ResolvedRegion(neighborhoodID: neighborhood, neighborhoodName: neighborhood,
                       cityID: city, cityName: city,
                       stateCode: state, stateName: state,
                       geohash: "9xj000")
    }

    private func event(_ player: String, points: Int, region: ResolvedRegion, cleared: Int = 1) -> ScoreEvent {
        ScoreEvent(playerID: player, displayName: player.capitalized, points: points,
                   gremlinsCleared: cleared, region: region, season: season, timestamp: 0)
    }

    func testRecordFansOutToAllScopes() async {
        let svc = InMemoryLeaderboardService()
        let r = region(neighborhood: "downtown", city: "slc", state: "UT")
        await svc.record(event("ava", points: 100, region: r))

        let hood = await svc.standings(scope: .neighborhood(id: "downtown"), season: season, limit: 10)
        let city = await svc.standings(scope: .city(id: "slc"), season: season, limit: 10)
        let state = await svc.standings(scope: .state(code: "UT"), season: season, limit: 10)
        let global = await svc.standings(scope: .global, season: season, limit: 10)

        XCTAssertEqual(hood.first?.points, 100)
        XCTAssertEqual(city.first?.points, 100)
        XCTAssertEqual(state.first?.points, 100)
        XCTAssertEqual(global.first?.points, 100)
    }

    func testStandingsAreRankedByPoints() async {
        let svc = InMemoryLeaderboardService()
        let r = region(neighborhood: "downtown", city: "slc", state: "UT")
        await svc.record(event("ava", points: 100, region: r))
        await svc.record(event("leo", points: 300, region: r))
        await svc.record(event("mae", points: 200, region: r))

        let board = await svc.standings(scope: .neighborhood(id: "downtown"), season: season, limit: 10)
        XCTAssertEqual(board.map(\.playerID), ["leo", "mae", "ava"])
        XCTAssertEqual(board.map(\.rank), [1, 2, 3])
    }

    func testPointsAccumulateAcrossEvents() async {
        let svc = InMemoryLeaderboardService()
        let r = region(neighborhood: "downtown", city: "slc", state: "UT")
        await svc.record(event("ava", points: 100, region: r))
        await svc.record(event("ava", points: 50, region: r))
        let board = await svc.standings(scope: .city(id: "slc"), season: season, limit: 10)
        XCTAssertEqual(board.first?.points, 150)
        XCTAssertEqual(board.first?.gremlinsCleared, 2)
    }

    func testSeparateNeighborhoodsButSharedStateBoard() async {
        let svc = InMemoryLeaderboardService()
        let downtown = region(neighborhood: "downtown", city: "slc", state: "UT")
        let sugarhouse = region(neighborhood: "sugarhouse", city: "slc", state: "UT")
        await svc.record(event("ava", points: 100, region: downtown))
        await svc.record(event("leo", points: 200, region: sugarhouse))

        let dt = await svc.standings(scope: .neighborhood(id: "downtown"), season: season, limit: 10)
        let sh = await svc.standings(scope: .neighborhood(id: "sugarhouse"), season: season, limit: 10)
        let state = await svc.standings(scope: .state(code: "UT"), season: season, limit: 10)

        XCTAssertEqual(dt.count, 1)
        XCTAssertEqual(sh.count, 1)
        XCTAssertEqual(state.count, 2, "Both players share the state board")
    }

    func testRankAndTotalCleared() async {
        let svc = InMemoryLeaderboardService()
        let r = region(neighborhood: "downtown", city: "slc", state: "UT")
        await svc.record(event("ava", points: 100, region: r, cleared: 3))
        await svc.record(event("leo", points: 300, region: r, cleared: 5))

        let rank = await svc.rank(playerID: "ava", scope: .neighborhood(id: "downtown"), season: season)
        XCTAssertEqual(rank, 2)
        let total = await svc.totalCleared(scope: .neighborhood(id: "downtown"), season: season)
        XCTAssertEqual(total, 8)
    }

    func testSeasonsAreIsolated() async {
        let svc = InMemoryLeaderboardService()
        let r = region(neighborhood: "downtown", city: "slc", state: "UT")
        let other = Season(id: "2026-Q1", displayName: "Q1 2026")
        await svc.record(ScoreEvent(playerID: "ava", displayName: "Ava", points: 100,
                                    region: r, season: other, timestamp: 0))
        let thisSeason = await svc.standings(scope: .neighborhood(id: "downtown"), season: season, limit: 10)
        XCTAssertTrue(thisSeason.isEmpty)
    }
}
