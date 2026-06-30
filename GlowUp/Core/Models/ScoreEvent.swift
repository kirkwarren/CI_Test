import Foundation

/// One verified gremlin banish, recorded to the leaderboards. The region it
/// carries fans the score out to global/state/city/neighborhood boards.
public struct ScoreEvent: Equatable, Identifiable {
    public let id: String
    public let playerID: String
    public let displayName: String
    public let points: Int
    public let gremlinsCleared: Int
    public let gramsRemoved: Double
    public let region: ResolvedRegion
    public let season: Season
    public let timestamp: TimeInterval

    public init(id: String = UUID().uuidString,
                playerID: String,
                displayName: String,
                points: Int,
                gremlinsCleared: Int = 1,
                gramsRemoved: Double = 0,
                region: ResolvedRegion,
                season: Season,
                timestamp: TimeInterval) {
        self.id = id
        self.playerID = playerID
        self.displayName = displayName
        self.points = points
        self.gremlinsCleared = gremlinsCleared
        self.gramsRemoved = gramsRemoved
        self.region = region
        self.season = season
        self.timestamp = timestamp
    }
}

/// A row in a leaderboard.
public struct LeaderboardEntry: Equatable, Identifiable {
    public var id: String { playerID }
    public let playerID: String
    public let displayName: String
    public let points: Int
    public let gremlinsCleared: Int
    public var rank: Int

    public init(playerID: String, displayName: String, points: Int, gremlinsCleared: Int, rank: Int) {
        self.playerID = playerID
        self.displayName = displayName
        self.points = points
        self.gremlinsCleared = gremlinsCleared
        self.rank = rank
    }
}
