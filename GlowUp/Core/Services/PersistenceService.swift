import Foundation

/// Minimal Codable persistence for local player state. A real build would back
/// this with CloudKit/Core Data; the protocol keeps that swap painless.
public protocol PlayerStore {
    func load() -> Player?
    func save(_ player: Player)
    func clear()
}

public final class UserDefaultsPlayerStore: PlayerStore {
    private let key = "glowup.player.v1"
    private let defaults: UserDefaults

    public init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    public func load() -> Player? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(Player.self, from: data)
    }

    public func save(_ player: Player) {
        guard let data = try? JSONEncoder().encode(player) else { return }
        defaults.set(data, forKey: key)
    }

    public func clear() {
        defaults.removeObject(forKey: key)
    }
}

/// In-memory store for tests/previews.
public final class InMemoryPlayerStore: PlayerStore {
    private var player: Player?
    public init(player: Player? = nil) { self.player = player }
    public func load() -> Player? { player }
    public func save(_ player: Player) { self.player = player }
    public func clear() { player = nil }
}
