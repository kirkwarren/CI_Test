import Foundation

/// Turns confirmed detections into live gremlins, mapping the litter category to
/// a species and stamping the spawn location. One gremlin per confirmed track.
public final class GremlinSpawner {
    private let gate: DetectionGate
    private var spawnedTrackIDs = Set<String>()

    public init(gate: DetectionGate = DetectionGate()) {
        self.gate = gate
    }

    public func reset() {
        gate.reset()
        spawnedTrackIDs.removeAll()
    }

    /// Feed one camera frame's detections (at clock time `now`) plus the
    /// player's current fix. Returns gremlins that were newly spawned this frame.
    public func ingest(_ frame: [FrameDetection],
                       at now: TimeInterval,
                       latitude: Double? = nil,
                       longitude: Double? = nil) -> [Gremlin] {
        let confirmed = gate.ingest(frame, at: now)
        var spawned: [Gremlin] = []
        for c in confirmed where !spawnedTrackIDs.contains(c.trackID) {
            spawnedTrackIDs.insert(c.trackID)
            let species = c.category.species
            spawned.append(Gremlin(
                id: "grem-\(c.trackID)",
                species: species,
                confidence: c.smoothedConfidence,
                anchorBox: c.box,
                confirmedAt: c.confirmedAt,
                latitude: latitude,
                longitude: longitude))
        }
        return spawned
    }
}
