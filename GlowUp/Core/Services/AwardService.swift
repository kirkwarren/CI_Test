import Foundation

/// Configuration for how leaderboard performance converts into community grants.
public struct AwardConfig: Equatable {
    /// Grant for finishing #1 on a neighborhood board this season.
    public var neighborhoodTopGrantUSD: Int
    /// Grant for finishing #1 on a city board this season.
    public var cityTopGrantUSD: Int
    /// Cumulative-cleanup milestones (gremlins cleared) and the grant each unlocks.
    public var milestones: [(cleared: Int, grantUSD: Int)]

    public init(neighborhoodTopGrantUSD: Int = 2500,
                cityTopGrantUSD: Int = 10000,
                milestones: [(cleared: Int, grantUSD: Int)] = [
                    (1000, 500), (5000, 1500), (25000, 5000)
                ]) {
        self.neighborhoodTopGrantUSD = neighborhoodTopGrantUSD
        self.cityTopGrantUSD = cityTopGrantUSD
        self.milestones = milestones
    }

    public static func == (lhs: AwardConfig, rhs: AwardConfig) -> Bool {
        lhs.neighborhoodTopGrantUSD == rhs.neighborhoodTopGrantUSD
            && lhs.cityTopGrantUSD == rhs.cityTopGrantUSD
            && lhs.milestones.map(\.cleared) == rhs.milestones.map(\.cleared)
            && lhs.milestones.map(\.grantUSD) == rhs.milestones.map(\.grantUSD)
    }
}

/// Computes community-improvement awards from leaderboard outcomes. All awards
/// fund civic projects (parks, murals, trees, school gardens) — never cash to a
/// player. Pure functions so award logic is fully unit-testable.
public struct AwardService {
    public let config: AwardConfig

    public init(config: AwardConfig = AwardConfig()) {
        self.config = config
    }

    /// Default civic project menu residents vote among for a grant.
    public static func defaultProjects(regionName: String) -> [CommunityProject] {
        [
            CommunityProject(id: "trees", title: "Street trees & shade",
                             detail: "Plant native trees along \(regionName)'s busiest walking routes."),
            CommunityProject(id: "park", title: "Park benches & bins",
                             detail: "New benches and clearly-marked recycling stations in \(regionName)."),
            CommunityProject(id: "mural", title: "Community mural",
                             detail: "A local-artist mural celebrating \(regionName)'s cleanup crews."),
            CommunityProject(id: "garden", title: "School / community garden",
                             detail: "Tools, soil, and seeds for a shared garden in \(regionName)."),
        ]
    }

    /// Season-end award for the #1 region on a board.
    public func seasonTopAward(scope: LeaderboardScope,
                               regionName: String,
                               season: Season,
                               winner: LeaderboardEntry?) -> CommunityAward? {
        guard let winner, winner.rank == 1 else { return nil }
        let grant: Int
        switch scope {
        case .neighborhood: grant = config.neighborhoodTopGrantUSD
        case .city: grant = config.cityTopGrantUSD
        case .state, .global: return nil // top-region awards are local by design
        }
        return CommunityAward(
            id: "season-\(season.id)-\(scope.key)",
            scope: AwardScope(scope),
            regionName: regionName,
            season: season,
            reason: .seasonTopRegion,
            title: "\(regionName) — #1 \(scope.levelName) this season",
            grantUSD: grant,
            projectOptions: AwardService.defaultProjects(regionName: regionName))
    }

    /// All milestone awards a region has unlocked given its cumulative clears.
    public func milestoneAwards(scope: LeaderboardScope,
                                regionName: String,
                                season: Season,
                                totalCleared: Int) -> [CommunityAward] {
        config.milestones
            .filter { totalCleared >= $0.cleared }
            .map { m in
                CommunityAward(
                    id: "milestone-\(season.id)-\(scope.key)-\(m.cleared)",
                    scope: AwardScope(scope),
                    regionName: regionName,
                    season: season,
                    reason: .milestone,
                    title: "\(regionName) cleared \(m.cleared.formatted()) gremlins",
                    grantUSD: m.grantUSD,
                    projectOptions: AwardService.defaultProjects(regionName: regionName))
            }
    }

    /// Apply a resident vote: select the funded project.
    public func fund(_ award: CommunityAward, projectID: String) -> CommunityAward {
        var updated = award
        if award.projectOptions.contains(where: { $0.id == projectID }) {
            updated.fundedProjectID = projectID
            updated.status = .funded
        }
        return updated
    }
}
