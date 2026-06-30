import Foundation

/// A single raw detection emitted by the litter detector for one camera frame.
public struct RawDetection: Equatable {
    public let category: LitterCategory
    public let confidence: Double
    public let box: BoundingBox

    public init(category: LitterCategory, confidence: Double, box: BoundingBox) {
        self.category = category
        self.confidence = confidence
        self.box = box
    }
}

/// A detection paired with the camera/world context the decision logic needs to
/// decide whether it should become a scorable gremlin.
public struct FrameDetection: Equatable {
    public let detection: RawDetection
    /// Seconds since an arbitrary reference (the ARSession clock in production,
    /// or a synthetic clock in tests).
    public let timestamp: TimeInterval
    /// Whether ARKit raycast a real surface (ground/table plane) behind the box.
    public let isOnDetectedPlane: Bool
    /// Approximate metric distance to the surface, if known (meters).
    public let distanceMeters: Double?

    public init(detection: RawDetection,
                timestamp: TimeInterval,
                isOnDetectedPlane: Bool = true,
                distanceMeters: Double? = nil) {
        self.detection = detection
        self.timestamp = timestamp
        self.isOnDetectedPlane = isOnDetectedPlane
        self.distanceMeters = distanceMeters
    }
}
