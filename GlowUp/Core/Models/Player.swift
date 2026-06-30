import Foundation

/// The local player's persistent profile and lifetime stats.
public struct Player: Equatable, Codable {
    public var id: String
    public var displayName: String
    public var handle: String
    public var xp: Int
    public var glowPoints: Int          // spendable points
    public var trustScore: Double       // private 0...1 anti-fraud reputation
    public var streakDays: Int
    public var gremlinsCleared: Int
    public var gramsRemoved: Double
    public var hazardsReported: Int

    public init(id: String = UUID().uuidString,
                displayName: String = "You",
                handle: String = "@you",
                xp: Int = 0,
                glowPoints: Int = 0,
                trustScore: Double = 0.7,
                streakDays: Int = 1,
                gremlinsCleared: Int = 0,
                gramsRemoved: Double = 0,
                hazardsReported: Int = 0) {
        self.id = id
        self.displayName = displayName
        self.handle = handle
        self.xp = xp
        self.glowPoints = glowPoints
        self.trustScore = trustScore
        self.streakDays = streakDays
        self.gremlinsCleared = gremlinsCleared
        self.gramsRemoved = gramsRemoved
        self.hazardsReported = hazardsReported
    }

    /// Level curve: each level needs progressively more XP.
    public var level: Int { max(1, Int((Double(xp) / 250.0).squareRoot()) + 1) }

    public var poundsRemoved: Double { (gramsRemoved / 453.592 * 10).rounded() / 10 }
}
