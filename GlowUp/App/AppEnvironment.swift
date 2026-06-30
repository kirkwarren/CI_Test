import Foundation
import Combine

/// Central app state + dependency container. Owns the player, services, season,
/// and the core game action: banishing a gremlin (score → record → persist).
@MainActor
public final class AppEnvironment: ObservableObject {
    // Player & progression
    @Published public private(set) var player: Player
    @Published public private(set) var comboStreak: Int = 0
    @Published public private(set) var lastBanish: ScoreBreakdown?
    @Published public private(set) var awards: [CommunityAward] = []

    // Location → region
    @Published public private(set) var currentRegion: ResolvedRegion?

    public let season: Season
    public let location: LocationService
    public let detector: LitterDetecting
    public let leaderboard: LeaderboardService
    public let regionResolver: RegionResolving
    public let awardService: AwardService

    private let store: PlayerStore
    private let now: () -> TimeInterval

    /// Fallback region so the simulator (no location) still ranks the player.
    private let fallbackRegion = DemoData.regions[0]

    public init(player: Player? = nil,
                season: Season,
                location: LocationService,
                detector: LitterDetecting,
                leaderboard: LeaderboardService,
                regionResolver: RegionResolving,
                awardService: AwardService = AwardService(),
                store: PlayerStore,
                now: @escaping () -> TimeInterval = { Date().timeIntervalSince1970 }) {
        self.season = season
        self.location = location
        self.detector = detector
        self.leaderboard = leaderboard
        self.regionResolver = regionResolver
        self.awardService = awardService
        self.store = store
        self.now = now
        self.player = player ?? store.load() ?? Player()

        // Seed rivals so boards/awards are populated on first run, then refresh.
        Task { [self] in
            if let mem = leaderboard as? InMemoryLeaderboardService {
                await mem.seed(DemoData.seedEvents(season: season, now: now()))
            }
            await refreshAwards()
        }
    }

    // MARK: - Region

    public func refreshRegion() async {
        guard let coord = location.coordinate else {
            currentRegion = currentRegion ?? fallbackRegion
            return
        }
        currentRegion = await regionResolver.resolve(latitude: coord.latitude, longitude: coord.longitude)
    }

    public var activeRegion: ResolvedRegion { currentRegion ?? fallbackRegion }

    // MARK: - Core action: banish a gremlin

    @discardableResult
    public func banish(_ gremlin: Gremlin,
                       evidence: DisposalEvidence,
                       regionPriority: Int = 3,
                       eventActive: Bool = false) async -> ScoreBreakdown {
        let ctx = ScoringContext(
            species: gremlin.species,
            evidence: evidence,
            detectionConfidence: gremlin.confidence,
            comboStreak: comboStreak,
            regionPriority: regionPriority,
            eventActive: eventActive,
            trustScore: player.trustScore)
        let breakdown = ScoringEngine.score(ctx)
        lastBanish = breakdown

        var p = player
        p.gremlinsCleared += 1
        p.gramsRemoved += breakdown.gramsRemoved

        if breakdown.heldForReview {
            comboStreak = 0
            p.trustScore = max(0.2, (p.trustScore - 0.05))
        } else {
            comboStreak += 1
            p.xp += breakdown.total
            p.glowPoints += breakdown.total
            p.trustScore = min(1.0, p.trustScore + 0.01)

            let region = activeRegion
            let event = ScoreEvent(
                playerID: p.id, displayName: p.displayName,
                points: breakdown.total, gremlinsCleared: 1,
                gramsRemoved: breakdown.gramsRemoved,
                region: region, season: season, timestamp: now())
            await leaderboard.record(event)
            await refreshAwards()
        }

        player = p
        store.save(p)
        return breakdown
    }

    public func reportHazard(kind: String) {
        var p = player
        p.hazardsReported += 1
        p.glowPoints += 75
        p.xp += 75
        p.trustScore = min(1.0, p.trustScore + 0.005)
        player = p
        store.save(p)
    }

    // MARK: - Awards

    public func refreshAwards() async {
        var result: [CommunityAward] = []
        let region = activeRegion

        if let hood = region.neighborhoodID, let hoodName = region.neighborhoodName {
            let scope = LeaderboardScope.neighborhood(id: hood)
            let top = await leaderboard.standings(scope: scope, season: season, limit: 1).first
            if let a = awardService.seasonTopAward(scope: scope, regionName: hoodName, season: season, winner: top) {
                result.append(a)
            }
            let cleared = await leaderboard.totalCleared(scope: scope, season: season)
            result += awardService.milestoneAwards(scope: scope, regionName: hoodName, season: season, totalCleared: cleared)
        }
        if let city = region.cityID, let cityName = region.cityName {
            let scope = LeaderboardScope.city(id: city)
            let top = await leaderboard.standings(scope: scope, season: season, limit: 1).first
            if let a = awardService.seasonTopAward(scope: scope, regionName: cityName, season: season, winner: top) {
                result.append(a)
            }
            let cleared = await leaderboard.totalCleared(scope: scope, season: season)
            result += awardService.milestoneAwards(scope: scope, regionName: cityName, season: season, totalCleared: cleared)
        }
        awards = result
    }

    public func vote(on award: CommunityAward, projectID: String) {
        guard let idx = awards.firstIndex(where: { $0.id == award.id }) else { return }
        awards[idx] = awardService.fund(award, projectID: projectID)
    }

    public func resetProgress() {
        store.clear()
        player = Player()
        comboStreak = 0
        lastBanish = nil
    }

    // MARK: - Factories

    public static func live() -> AppEnvironment {
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.year, .month], from: Date())
        let season = Season.quarter(year: comps.year ?? 2026, month: comps.month ?? 1)

        #if targetEnvironment(simulator)
        let detector: LitterDetecting = MockLitterDetector()
        #else
        let core = CoreMLLitterDetector()
        let detector: LitterDetecting = core.isModelLoaded ? core : MockLitterDetector()
        #endif

        return AppEnvironment(
            season: season,
            location: LocationService(),
            detector: detector,
            leaderboard: InMemoryLeaderboardService(),
            regionResolver: GeocoderRegionResolver(),
            store: UserDefaultsPlayerStore())
    }

    public static func preview() -> AppEnvironment {
        AppEnvironment(
            player: Player(displayName: "You", xp: 1280, glowPoints: 1280, gremlinsCleared: 64, gramsRemoved: 1400),
            season: Season.quarter(year: 2026, month: 6),
            location: LocationService(),
            detector: MockLitterDetector(),
            leaderboard: InMemoryLeaderboardService(),
            regionResolver: StubRegionResolver(),
            store: InMemoryPlayerStore(),
            now: { 1_750_000_000 })
    }
}
