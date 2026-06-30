import Foundation

/// Abstraction over the leaderboard backend. The app talks only to this; the
/// in-memory implementation makes everything testable today, and a CloudKit or
/// REST implementation can drop in later without touching the UI.
public protocol LeaderboardService: AnyObject {
    /// Record a verified banish. The event fans out to every scope its region
    /// belongs to (global → state → city → neighborhood).
    func record(_ event: ScoreEvent) async

    /// Ranked standings for one board in one season.
    func standings(scope: LeaderboardScope, season: Season, limit: Int) async -> [LeaderboardEntry]

    /// The player's rank on a board, if they appear on it.
    func rank(playerID: String, scope: LeaderboardScope, season: Season) async -> Int?

    /// Total gremlins cleared in a region this season (drives award milestones).
    func totalCleared(scope: LeaderboardScope, season: Season) async -> Int
}

/// In-memory, hierarchical leaderboard. Thread-safe via actor isolation.
public actor InMemoryLeaderboardService: LeaderboardService {
    private struct Tally {
        var displayName: String
        var points: Int
        var gremlinsCleared: Int
    }

    // boardKey ("season|scope") → playerID → tally
    private var boards: [String: [String: Tally]] = [:]

    public init() {}

    private func boardKey(_ season: Season, _ scope: LeaderboardScope) -> String {
        "\(season.id)|\(scope.key)"
    }

    public func record(_ event: ScoreEvent) async {
        for scope in LeaderboardScope.scopes(for: event.region) {
            let key = boardKey(event.season, scope)
            var board = boards[key] ?? [:]
            var tally = board[event.playerID] ?? Tally(displayName: event.displayName, points: 0, gremlinsCleared: 0)
            tally.displayName = event.displayName
            tally.points += event.points
            tally.gremlinsCleared += event.gremlinsCleared
            board[event.playerID] = tally
            boards[key] = board
        }
    }

    private func ranked(_ season: Season, _ scope: LeaderboardScope) -> [LeaderboardEntry] {
        let board = boards[boardKey(season, scope)] ?? [:]
        let sorted = board
            .map { (playerID, t) in (playerID, t) }
            // Deterministic ordering: points desc, then cleared desc, then id asc.
            .sorted { a, b in
                if a.1.points != b.1.points { return a.1.points > b.1.points }
                if a.1.gremlinsCleared != b.1.gremlinsCleared { return a.1.gremlinsCleared > b.1.gremlinsCleared }
                return a.0 < b.0
            }
        return sorted.enumerated().map { idx, pair in
            LeaderboardEntry(playerID: pair.0,
                             displayName: pair.1.displayName,
                             points: pair.1.points,
                             gremlinsCleared: pair.1.gremlinsCleared,
                             rank: idx + 1)
        }
    }

    public func standings(scope: LeaderboardScope, season: Season, limit: Int) async -> [LeaderboardEntry] {
        Array(ranked(season, scope).prefix(limit))
    }

    public func rank(playerID: String, scope: LeaderboardScope, season: Season) async -> Int? {
        ranked(season, scope).first { $0.playerID == playerID }?.rank
    }

    public func totalCleared(scope: LeaderboardScope, season: Season) async -> Int {
        let board = boards[boardKey(season, scope)] ?? [:]
        return board.values.reduce(0) { $0 + $1.gremlinsCleared }
    }

    /// Test/seed helper: bulk-load events.
    public func seed(_ events: [ScoreEvent]) async {
        for e in events { await record(e) }
    }
}
