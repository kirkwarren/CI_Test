import XCTest
@testable import GlowUp

final class GeohashTests: XCTestCase {
    /// Canonical reference vector for the geohash algorithm.
    func testKnownReferenceVector() {
        let hash = Geohash.encode(latitude: 57.64911, longitude: 10.40744, precision: 11)
        XCTAssertEqual(hash, "u4pruydqqvj")
    }

    func testPrecisionControlsLength() {
        XCTAssertEqual(Geohash.encode(latitude: 40.7608, longitude: -111.8910, precision: 7).count, 7)
        XCTAssertEqual(Geohash.encode(latitude: 40.7608, longitude: -111.8910, precision: 9).count, 9)
    }

    func testNearbyPointsSharePrefix() {
        let a = Geohash.encode(latitude: 40.7608, longitude: -111.8910, precision: 7)
        let b = Geohash.encode(latitude: 40.7609, longitude: -111.8911, precision: 7)
        XCTAssertEqual(String(a.prefix(4)), String(b.prefix(4)),
                       "Points ~15m apart should fall in the same coarse cell")
    }

    func testDistantPointsDifferentPrefix() {
        let slc = Geohash.encode(latitude: 40.7608, longitude: -111.8910, precision: 5)
        let nyc = Geohash.encode(latitude: 40.7128, longitude: -74.0060, precision: 5)
        XCTAssertNotEqual(slc.prefix(2), nyc.prefix(2))
    }
}
