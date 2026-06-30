import Foundation
import CoreLocation

/// Resolves a coordinate into its administrative regions for the leaderboard
/// hierarchy. Abstracted so tests use a deterministic resolver and production
/// uses reverse geocoding.
public protocol RegionResolving {
    func resolve(latitude: Double, longitude: Double) async -> ResolvedRegion
}

/// Production resolver backed by CLGeocoder reverse geocoding, with a geohash
/// fallback for any field the geocoder can't supply.
public final class GeocoderRegionResolver: RegionResolving {
    private let geocoder = CLGeocoder()

    public init() {}

    public func resolve(latitude: Double, longitude: Double) async -> ResolvedRegion {
        let geohash = Geohash.encode(latitude: latitude, longitude: longitude, precision: 7)
        let location = CLLocation(latitude: latitude, longitude: longitude)
        do {
            let placemarks = try await geocoder.reverseGeocodeLocation(location)
            guard let p = placemarks.first else {
                return ResolvedRegion(geohash: geohash)
            }
            // Neighborhood: prefer subLocality; fall back to a coarse geohash cell.
            let hoodName = p.subLocality ?? p.name
            let hoodID = p.subLocality.map { slug($0, in: p.locality) } ?? "geo:\(String(geohash.prefix(6)))"
            let cityName = p.locality
            let cityID = p.locality.map { slug($0, in: p.administrativeArea) }
            return ResolvedRegion(
                neighborhoodID: hoodID,
                neighborhoodName: hoodName,
                cityID: cityID,
                cityName: cityName,
                stateCode: stateCode(from: p),
                stateName: p.administrativeArea,
                countryCode: p.isoCountryCode ?? "US",
                geohash: geohash)
        } catch {
            // Offline / rate-limited: still rank by geohash cell so play continues.
            return ResolvedRegion(
                neighborhoodID: "geo:\(String(geohash.prefix(6)))",
                cityID: "geo:\(String(geohash.prefix(4)))",
                geohash: geohash)
        }
    }

    private func stateCode(from p: CLPlacemark) -> String? {
        // CLPlacemark gives the full state name in administrativeArea; many US
        // placemarks also carry a short code in `subAdministrativeArea` metadata.
        // Keep the full name as the code when no abbreviation is available — the
        // value only needs to be stable, not pretty.
        p.administrativeArea
    }

    private func slug(_ s: String, in parent: String?) -> String {
        let base = (parent.map { "\($0)-" } ?? "") + s
        return base.lowercased()
            .replacingOccurrences(of: " ", with: "-")
            .filter { $0.isLetter || $0.isNumber || $0 == "-" }
    }
}

/// Deterministic resolver for tests and previews: maps coordinates to fixed
/// regions via a lookup table, with a geohash-derived fallback.
public final class StubRegionResolver: RegionResolving {
    private let table: [ResolvedRegion]

    public init(table: [ResolvedRegion] = StubRegionResolver.sample) {
        self.table = table
    }

    public func resolve(latitude: Double, longitude: Double) async -> ResolvedRegion {
        let geohash = Geohash.encode(latitude: latitude, longitude: longitude, precision: 7)
        // Match by geohash prefix if a seed shares the cell; else synthesize.
        if let hit = table.first(where: { geohash.hasPrefix(String($0.geohash.prefix(4))) }) {
            var r = hit
            r.geohash = geohash
            return r
        }
        return ResolvedRegion(
            neighborhoodID: "geo:\(String(geohash.prefix(6)))",
            neighborhoodName: "Cell \(String(geohash.prefix(6)))",
            cityID: "geo:\(String(geohash.prefix(4)))",
            cityName: "Cell \(String(geohash.prefix(4)))",
            stateCode: "US-\(String(geohash.prefix(1)))",
            stateName: "Region \(String(geohash.prefix(1)))",
            geohash: geohash)
    }

    public static let sample: [ResolvedRegion] = [
        ResolvedRegion(neighborhoodID: "slc-downtown", neighborhoodName: "Downtown",
                       cityID: "ut-salt-lake-city", cityName: "Salt Lake City",
                       stateCode: "UT", stateName: "Utah",
                       geohash: Geohash.encode(latitude: 40.7608, longitude: -111.8910, precision: 7)),
        ResolvedRegion(neighborhoodID: "slc-sugarhouse", neighborhoodName: "Sugar House",
                       cityID: "ut-salt-lake-city", cityName: "Salt Lake City",
                       stateCode: "UT", stateName: "Utah",
                       geohash: Geohash.encode(latitude: 40.7236, longitude: -111.8553, precision: 7)),
    ]
}
