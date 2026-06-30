import XCTest
@testable import GlowUp

final class NonMaxSuppressionTests: XCTestCase {
    func testSuppressesOverlappingSameCategory() {
        let a = RawDetection(category: .plasticBottle, confidence: 0.9,
                             box: BoundingBox(x: 0.1, y: 0.1, width: 0.2, height: 0.2))
        let b = RawDetection(category: .plasticBottle, confidence: 0.6,
                             box: BoundingBox(x: 0.11, y: 0.11, width: 0.2, height: 0.2))
        let kept = NonMaxSuppression.reduce([a, b], iouThreshold: 0.45)
        XCTAssertEqual(kept.count, 1)
        XCTAssertEqual(kept.first?.confidence, 0.9, "Keeps the higher-confidence box")
    }

    func testKeepsOverlappingDifferentCategories() {
        let a = RawDetection(category: .plasticBottle, confidence: 0.9,
                             box: BoundingBox(x: 0.1, y: 0.1, width: 0.2, height: 0.2))
        let b = RawDetection(category: .aluminumCan, confidence: 0.8,
                             box: BoundingBox(x: 0.1, y: 0.1, width: 0.2, height: 0.2))
        XCTAssertEqual(NonMaxSuppression.reduce([a, b]).count, 2)
    }

    func testKeepsDistinctSameCategory() {
        let a = RawDetection(category: .cup, confidence: 0.9,
                             box: BoundingBox(x: 0.0, y: 0.0, width: 0.1, height: 0.1))
        let b = RawDetection(category: .cup, confidence: 0.8,
                             box: BoundingBox(x: 0.7, y: 0.7, width: 0.1, height: 0.1))
        XCTAssertEqual(NonMaxSuppression.reduce([a, b]).count, 2)
    }
}

final class DetectionGateTests: XCTestCase {
    private func frame(_ category: LitterCategory, conf: Double, t: TimeInterval,
                       onPlane: Bool = true, distance: Double? = 2.0,
                       box: BoundingBox = BoundingBox(x: 0.4, y: 0.5, width: 0.1, height: 0.1)) -> [FrameDetection] {
        [FrameDetection(detection: RawDetection(category: category, confidence: conf, box: box),
                        timestamp: t, isOnDetectedPlane: onPlane, distanceMeters: distance)]
    }

    func testConfirmsAfterMinHits() {
        let gate = DetectionGate(config: .default) // minHits 4
        for i in 0..<3 {
            let t = Double(i) * 0.1
            XCTAssertTrue(gate.ingest(frame(.plasticBottle, conf: 0.85, t: t), at: t).isEmpty)
        }
        let confirmations = gate.ingest(frame(.plasticBottle, conf: 0.85, t: 0.3), at: 0.3)
        XCTAssertEqual(confirmations.count, 1)
        XCTAssertEqual(confirmations.first?.category, .plasticBottle)
        XCTAssertGreaterThanOrEqual(confirmations.first?.smoothedConfidence ?? 0, 0.6)
    }

    func testConfirmsOnlyOncePerTrack() {
        let gate = DetectionGate(config: .default)
        for i in 0..<4 { let t = Double(i) * 0.1; _ = gate.ingest(frame(.cup, conf: 0.8, t: t), at: t) }
        let again = gate.ingest(frame(.cup, conf: 0.8, t: 0.4), at: 0.4)
        XCTAssertTrue(again.isEmpty, "A confirmed track must not re-confirm")
    }

    func testLowConfidenceNeverConfirms() {
        let gate = DetectionGate(config: .default) // minConfidence 0.6
        var any = false
        for i in 0..<8 { let t = Double(i) * 0.1; any = any || !gate.ingest(frame(.cigarette, conf: 0.4, t: t), at: t).isEmpty }
        XCTAssertFalse(any)
    }

    func testRejectsOffPlaneDetections() {
        let gate = DetectionGate(config: .default) // requirePlane true
        var any = false
        for i in 0..<8 { let t = Double(i) * 0.1; any = any || !gate.ingest(frame(.cup, conf: 0.9, t: t, onPlane: false), at: t).isEmpty }
        XCTAssertFalse(any)
        XCTAssertEqual(gate.activeTrackCount, 0)
    }

    func testRejectsTooFarDetections() {
        let gate = DetectionGate(config: .default) // maxDistance 8m
        var any = false
        for i in 0..<8 { let t = Double(i) * 0.1; any = any || !gate.ingest(frame(.cup, conf: 0.9, t: t, distance: 20), at: t).isEmpty }
        XCTAssertFalse(any)
    }

    func testDetectionFreeFramesExpireStaleTracks() {
        let gate = DetectionGate(config: .default) // TTL 1.0
        // Build a cup track up to 3 hits (one short of confirming).
        for i in 0..<3 { let t = Double(i) * 0.1; _ = gate.ingest(frame(.cup, conf: 0.8, t: t), at: t) }
        XCTAssertEqual(gate.activeTrackCount, 1)
        // A long detection-free gap must still advance the clock and expire it.
        let confirmed = gate.ingest([], at: 5.0)
        XCTAssertTrue(confirmed.isEmpty)
        XCTAssertEqual(gate.activeTrackCount, 0, "Stale track should expire on an empty frame")
    }
}

final class GremlinSpawnerTests: XCTestCase {
    private func frame(_ category: LitterCategory, t: TimeInterval) -> [FrameDetection] {
        [FrameDetection(detection: RawDetection(category: category, confidence: 0.85,
                                                box: BoundingBox(x: 0.4, y: 0.5, width: 0.1, height: 0.1)),
                        timestamp: t, isOnDetectedPlane: true, distanceMeters: 2.0)]
    }

    func testSpawnsOneGremlinPerConfirmedTrack() {
        let spawner = GremlinSpawner()
        var spawned: [Gremlin] = []
        for i in 0..<4 {
            let t = Double(i) * 0.1
            spawned += spawner.ingest(frame(.plasticBottle, t: t), at: t,
                                      latitude: 40.76, longitude: -111.89)
        }
        XCTAssertEqual(spawned.count, 1)
        XCTAssertEqual(spawned.first?.species.name, "Bottlebrute")
        XCTAssertEqual(spawned.first?.latitude ?? 0, 40.76, accuracy: 1e-9)
        XCTAssertEqual(spawned.first?.category, .plasticBottle)
    }

    func testNoDuplicateSpawnAfterConfirmation() {
        let spawner = GremlinSpawner()
        for i in 0..<4 { let t = Double(i) * 0.1; _ = spawner.ingest(frame(.cup, t: t), at: t) }
        let more = spawner.ingest(frame(.cup, t: 0.5), at: 0.5)
        XCTAssertTrue(more.isEmpty)
    }
}
