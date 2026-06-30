import Foundation

/// The administrative regions a location resolves into. Drives the
/// neighborhood / city / state / global leaderboard hierarchy.
public struct ResolvedRegion: Equatable, Codable, Hashable {
    public var neighborhoodID: String?
    public var neighborhoodName: String?
    public var cityID: String?
    public var cityName: String?
    public var stateCode: String?     // e.g. "UT"
    public var stateName: String?     // e.g. "Utah"
    public var countryCode: String    // e.g. "US"
    public var geohash: String        // spatial bucket / fallback id

    public init(neighborhoodID: String? = nil,
                neighborhoodName: String? = nil,
                cityID: String? = nil,
                cityName: String? = nil,
                stateCode: String? = nil,
                stateName: String? = nil,
                countryCode: String = "US",
                geohash: String) {
        self.neighborhoodID = neighborhoodID
        self.neighborhoodName = neighborhoodName
        self.cityID = cityID
        self.cityName = cityName
        self.stateCode = stateCode
        self.stateName = stateName
        self.countryCode = countryCode
        self.geohash = geohash
    }
}

/// Which leaderboard a query targets. `regionID` resolution comes from a
/// `ResolvedRegion`; a nil id (e.g. a player with no neighborhood resolved yet)
/// simply means they don't appear on that scope.
public enum LeaderboardScope: Equatable, Hashable {
    case global
    case state(code: String)
    case city(id: String)
    case neighborhood(id: String)

    /// Stable storage key for this exact board.
    public var key: String {
        switch self {
        case .global: return "global"
        case .state(let code): return "state:\(code)"
        case .city(let id): return "city:\(id)"
        case .neighborhood(let id): return "neighborhood:\(id)"
        }
    }

    public var levelName: String {
        switch self {
        case .global: return "Global"
        case .state: return "State"
        case .city: return "City"
        case .neighborhood: return "Neighborhood"
        }
    }

    /// The scopes a score event in `region` should contribute to.
    public static func scopes(for region: ResolvedRegion) -> [LeaderboardScope] {
        var result: [LeaderboardScope] = [.global]
        if let code = region.stateCode { result.append(.state(code: code)) }
        if let city = region.cityID { result.append(.city(id: city)) }
        if let hood = region.neighborhoodID { result.append(.neighborhood(id: hood)) }
        return result
    }
}

/// A competition season (leaderboards and awards reset each season).
public struct Season: Equatable, Hashable, Codable {
    public let id: String // e.g. "2026-Q2"
    public let displayName: String

    public init(id: String, displayName: String) {
        self.id = id
        self.displayName = displayName
    }

    /// Quarter-based season for a given month/year (kept pure for testing —
    /// no implicit `Date()` so results are deterministic).
    public static func quarter(year: Int, month: Int) -> Season {
        let q = ((max(1, min(12, month)) - 1) / 3) + 1
        return Season(id: "\(year)-Q\(q)", displayName: "Q\(q) \(year)")
    }
}
