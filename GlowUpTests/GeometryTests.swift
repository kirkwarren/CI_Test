import XCTest
@testable import GlowUp

final class GeometryTests: XCTestCase {
    func testIoUIdenticalBoxesIsOne() {
        let b = BoundingBox(x: 0.1, y: 0.1, width: 0.2, height: 0.2)
        XCTAssertEqual(b.iou(b), 1.0, accuracy: 1e-9)
    }

    func testIoUDisjointBoxesIsZero() {
        let a = BoundingBox(x: 0, y: 0, width: 0.2, height: 0.2)
        let b = BoundingBox(x: 0.5, y: 0.5, width: 0.2, height: 0.2)
        XCTAssertEqual(a.iou(b), 0.0, accuracy: 1e-9)
    }

    func testIoUHalfOverlap() {
        // Two unit-ish boxes overlapping on exactly half their area.
        let a = BoundingBox(x: 0, y: 0, width: 0.2, height: 0.2)
        let b = BoundingBox(x: 0.1, y: 0, width: 0.2, height: 0.2)
        // intersection = 0.1 * 0.2 = 0.02; union = 0.04 + 0.04 - 0.02 = 0.06
        XCTAssertEqual(a.iou(b), 0.02 / 0.06, accuracy: 1e-9)
    }

    func testCenterComputation() {
        let b = BoundingBox(x: 0.2, y: 0.4, width: 0.4, height: 0.2)
        XCTAssertEqual(b.centerX, 0.4, accuracy: 1e-9)
        XCTAssertEqual(b.centerY, 0.5, accuracy: 1e-9)
    }
}
