import Foundation
import CoreLocation

/// A gremlin sighting placed on the live map near the player (Pokémon Go-style).
/// In production these come from the shared world (other players' confirmed,
/// not-yet-cleared detections); here we scatter a believable set around the
/// player so the map feels alive before the camera hunt.
public struct GremlinSighting: Identifiable, Equatable {
    public let id: String
    public let species: GremlinSpecies
    public let coordinate: CLLocationCoordinate2D

    public init(id: String, species: GremlinSpecies, coordinate: CLLocationCoordinate2D) {
        self.id = id
        self.species = species
        self.coordinate = coordinate
    }

    public static func == (lhs: GremlinSighting, rhs: GremlinSighting) -> Bool {
        lhs.id == rhs.id
            && lhs.coordinate.latitude == rhs.coordinate.latitude
            && lhs.coordinate.longitude == rhs.coordinate.longitude
    }

    /// Deterministic scatter of sightings around a center coordinate.
    public static func scatter(around center: CLLocationCoordinate2D, count: Int = 8) -> [GremlinSighting] {
        let species: [LitterCategory] = [
            .plasticBottle, .aluminumCan, .cigarette, .cup, .foodWrapper, .plasticBag, .glassBottle, .foodContainer,
        ]
        // Fixed pseudo-random offsets (no Date()/random for stable previews/tests).
        let offsets: [(Double, Double)] = [
            (0.0009, 0.0007), (-0.0008, 0.0011), (0.0012, -0.0006), (-0.0011, -0.0009),
            (0.0004, 0.0014), (-0.0014, 0.0003), (0.0007, -0.0013), (-0.0005, 0.0009),
            (0.0015, 0.0010), (-0.0010, 0.0015),
        ]
        return (0..<min(count, offsets.count)).map { i in
            let cat = species[i % species.count]
            let (dLat, dLon) = offsets[i]
            return GremlinSighting(
                id: "sighting-\(i)",
                species: cat.species,
                coordinate: CLLocationCoordinate2D(latitude: center.latitude + dLat,
                                                   longitude: center.longitude + dLon))
        }
    }
}
