import Foundation

/// Tuning for turning noisy per-frame detections into confirmed, scorable
/// gremlins. Conservative defaults trade a little latency for far fewer false
/// gremlins — the single biggest driver of perceived accuracy in the field.
public struct DetectionGateConfig: Equatable {
    /// Per-frame NMS overlap threshold.
    public var nmsIoU: Double
    /// Boxes across frames within this IoU are treated as the same object.
    public var trackMatchIoU: Double
    /// Minimum smoothed confidence before a track can confirm.
    public var minConfidence: Double
    /// A track must be seen in at least this many frames to confirm.
    public var minHits: Int
    /// Tracks not seen for this long (seconds) are dropped.
    public var trackTTL: TimeInterval
    /// Require ARKit to have found a real surface behind the box.
    public var requirePlane: Bool
    /// Reject detections farther than this (meters); litter you can't reach
    /// shouldn't spawn a gremlin. Nil disables the check.
    public var maxDistanceMeters: Double?

    public init(nmsIoU: Double = 0.45,
                trackMatchIoU: Double = 0.3,
                minConfidence: Double = 0.6,
                minHits: Int = 4,
                trackTTL: TimeInterval = 1.0,
                requirePlane: Bool = true,
                maxDistanceMeters: Double? = 8.0) {
        self.nmsIoU = nmsIoU
        self.trackMatchIoU = trackMatchIoU
        self.minConfidence = minConfidence
        self.minHits = minHits
        self.trackTTL = trackTTL
        self.requirePlane = requirePlane
        self.maxDistanceMeters = maxDistanceMeters
    }

    public static let `default` = DetectionGateConfig()
}

/// A confirmed object ready to be promoted to a gremlin.
public struct ConfirmedDetection: Equatable {
    public let trackID: String
    public let category: LitterCategory
    public let smoothedConfidence: Double
    public let box: BoundingBox
    public let confirmedAt: TimeInterval
}

/// Temporal tracker + confirmation gate. Pure and deterministic: feed it frames
/// with an explicit clock and it tells you which objects have become stable
/// enough to spawn. Each track confirms exactly once.
public final class DetectionGate {
    public private(set) var config: DetectionGateConfig

    private struct Track {
        let id: String
        let category: LitterCategory
        var box: BoundingBox
        var smoothedConfidence: Double
        var hits: Int
        var lastSeen: TimeInterval
        var confirmed: Bool
    }

    private var tracks: [Track] = []
    private var nextID = 0
    // Exponential smoothing factor for confidence (higher = snappier).
    private let alpha = 0.5

    public init(config: DetectionGateConfig = .default) {
        self.config = config
    }

    public func reset() {
        tracks.removeAll()
        nextID = 0
    }

    /// Ingest one frame's detections at an explicit clock time. Passing the
    /// timestamp separately (rather than reading it off a detection) means
    /// detection-free frames still advance the clock so stale tracks expire.
    /// Returns the tracks that *just* confirmed.
    @discardableResult
    public func ingest(_ frame: [FrameDetection], at now: TimeInterval) -> [ConfirmedDetection] {
        // 1. Drop detections that fail hard gates (plane / distance), then NMS.
        let eligible = frame.filter { fd in
            if config.requirePlane && !fd.isOnDetectedPlane { return false }
            if let maxD = config.maxDistanceMeters, let d = fd.distanceMeters, d > maxD { return false }
            return true
        }
        let raw = eligible.map { $0.detection }
        let suppressed = NonMaxSuppression.reduce(raw, iouThreshold: config.nmsIoU)

        // 2. Match each surviving detection to an existing track or open one.
        var matchedTrackIDs = Set<String>()
        for det in suppressed {
            if let idx = bestMatchIndex(for: det, excluding: matchedTrackIDs) {
                tracks[idx].box = det.box
                tracks[idx].smoothedConfidence =
                    alpha * det.confidence + (1 - alpha) * tracks[idx].smoothedConfidence
                tracks[idx].hits += 1
                tracks[idx].lastSeen = now
                matchedTrackIDs.insert(tracks[idx].id)
            } else {
                let id = "trk-\(nextID)"
                nextID += 1
                tracks.append(Track(id: id, category: det.category, box: det.box,
                                    smoothedConfidence: det.confidence, hits: 1,
                                    lastSeen: now, confirmed: false))
                matchedTrackIDs.insert(id)
            }
        }

        // 3. Promote tracks that have cleared the confidence + hits bar.
        var newlyConfirmed: [ConfirmedDetection] = []
        for i in tracks.indices {
            guard !tracks[i].confirmed else { continue }
            if tracks[i].hits >= config.minHits && tracks[i].smoothedConfidence >= config.minConfidence {
                tracks[i].confirmed = true
                newlyConfirmed.append(ConfirmedDetection(
                    trackID: tracks[i].id,
                    category: tracks[i].category,
                    smoothedConfidence: tracks[i].smoothedConfidence,
                    box: tracks[i].box,
                    confirmedAt: now))
            }
        }

        expire(now: now)
        return newlyConfirmed
    }

    private func bestMatchIndex(for det: RawDetection, excluding used: Set<String>) -> Int? {
        var bestIdx: Int?
        var bestIoU = config.trackMatchIoU
        for (i, t) in tracks.enumerated() where t.category == det.category && !used.contains(t.id) {
            let iou = t.box.iou(det.box)
            if iou >= bestIoU {
                bestIoU = iou
                bestIdx = i
            }
        }
        return bestIdx
    }

    private func expire(now: TimeInterval) {
        tracks.removeAll { now - $0.lastSeen > config.trackTTL }
    }

    /// Visible for tests / debugging.
    public var activeTrackCount: Int { tracks.count }
}
