import Foundation

/// A live gremlin in the world: a confirmed piece of real litter, presented as
/// an AR creature the player can banish by clearing the litter.
public struct Gremlin: Identifiable, Equatable {
    public let id: String
    public let species: GremlinSpecies
    /// Average detector confidence over the frames that confirmed this gremlin.
    public let confidence: Double
    /// Where it was confirmed, in normalized image space, for placing the AR anchor.
    public let anchorBox: BoundingBox
    /// When it was confirmed (session clock seconds).
    public let confirmedAt: TimeInterval
    /// World coordinate where it spawned, if a fix was available.
    public let latitude: Double?
    public let longitude: Double?

    public init(id: String,
                species: GremlinSpecies,
                confidence: Double,
                anchorBox: BoundingBox,
                confirmedAt: TimeInterval,
                latitude: Double? = nil,
                longitude: Double? = nil) {
        self.id = id
        self.species = species
        self.confidence = confidence
        self.anchorBox = anchorBox
        self.confirmedAt = confirmedAt
        self.latitude = latitude
        self.longitude = longitude
    }

    public var category: LitterCategory { species.category }
    public var rarity: GremlinRarity { species.rarity }
}

/// Evidence captured when a player banishes (clears + disposes) a gremlin.
public struct DisposalEvidence: Equatable {
    /// The litter was bagged / picked up.
    public var bagged: Bool
    /// The player sorted it into the matching recycling stream.
    public var sortedStream: RecyclingStream?
    /// A disposal checkpoint (bin QR / station) was scanned.
    public var checkpointScanned: Bool
    /// Seconds the player spent on the encounter (dwell), used for plausibility.
    public var dwellSeconds: Double
    /// An "after" capture confirmed the litter is gone.
    public var afterCaptured: Bool

    public init(bagged: Bool = false,
                sortedStream: RecyclingStream? = nil,
                checkpointScanned: Bool = false,
                dwellSeconds: Double = 0,
                afterCaptured: Bool = false) {
        self.bagged = bagged
        self.sortedStream = sortedStream
        self.checkpointScanned = checkpointScanned
        self.dwellSeconds = dwellSeconds
        self.afterCaptured = afterCaptured
    }

    public func sortedCorrectly(for species: GremlinSpecies) -> Bool {
        guard let sortedStream else { return false }
        return sortedStream == species.stream
    }
}
