import Foundation

/// A real-world community-improvement project a winning region can fund with an
/// award grant. Residents vote among the options.
public struct CommunityProject: Equatable, Identifiable, Codable {
    public let id: String
    public let title: String
    public let detail: String

    public init(id: String, title: String, detail: String) {
        self.id = id
        self.title = title
        self.detail = detail
    }
}

public enum AwardStatus: String, Equatable, Codable {
    case pendingVote   // award allocated, residents choosing the project
    case funded        // project selected and funded
    case completed     // improvement delivered
}

public enum AwardReason: String, Equatable, Codable {
    case seasonTopRegion   // finished #1 on a regional board this season
    case milestone         // region crossed a cumulative-cleanup milestone
}

/// An award that funds community improvement — never cash to an individual.
/// Leaderboard performance routes grants to parks, schools, murals, trees, etc.
public struct CommunityAward: Equatable, Identifiable, Codable {
    public let id: String
    public let scope: AwardScope
    public let regionName: String
    public let season: Season
    public let reason: AwardReason
    public let title: String
    public let grantUSD: Int
    public var status: AwardStatus
    public var projectOptions: [CommunityProject]
    public var fundedProjectID: String?

    public init(id: String,
                scope: AwardScope,
                regionName: String,
                season: Season,
                reason: AwardReason,
                title: String,
                grantUSD: Int,
                status: AwardStatus = .pendingVote,
                projectOptions: [CommunityProject] = [],
                fundedProjectID: String? = nil) {
        self.id = id
        self.scope = scope
        self.regionName = regionName
        self.season = season
        self.reason = reason
        self.title = title
        self.grantUSD = grantUSD
        self.status = status
        self.projectOptions = projectOptions
        self.fundedProjectID = fundedProjectID
    }
}

/// A `LeaderboardScope` flattened to a Codable shape for awards/persistence.
public struct AwardScope: Equatable, Codable, Hashable {
    public let level: String   // "neighborhood" | "city" | "state" | "global"
    public let regionID: String

    public init(level: String, regionID: String) {
        self.level = level
        self.regionID = regionID
    }

    public init(_ scope: LeaderboardScope) {
        switch scope {
        case .global: self = AwardScope(level: "global", regionID: "global")
        case .state(let code): self = AwardScope(level: "state", regionID: code)
        case .city(let id): self = AwardScope(level: "city", regionID: id)
        case .neighborhood(let id): self = AwardScope(level: "neighborhood", regionID: id)
        }
    }
}
