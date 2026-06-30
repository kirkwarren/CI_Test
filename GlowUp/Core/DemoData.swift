import Foundation

/// Seed content so leaderboards, awards, and the map look alive on first launch
/// (before real players exist). Pure data — safe to use anywhere.
public enum DemoData {

    public static let regions = StubRegionResolver.sample

    /// Scripted detections that drive the encounter when there's no camera/model
    /// (simulator or AR-unsupported device), so the hunt is fully demoable.
    public static let scriptedDetections: [RawDetection] = [
        RawDetection(category: .plasticBottle, confidence: 0.88,
                     box: BoundingBox(x: 0.18, y: 0.52, width: 0.16, height: 0.22)),
        RawDetection(category: .aluminumCan, confidence: 0.80,
                     box: BoundingBox(x: 0.60, y: 0.58, width: 0.14, height: 0.18)),
        RawDetection(category: .cigarette, confidence: 0.72,
                     box: BoundingBox(x: 0.42, y: 0.74, width: 0.07, height: 0.07)),
        RawDetection(category: .foodWrapper, confidence: 0.76,
                     box: BoundingBox(x: 0.30, y: 0.30, width: 0.12, height: 0.12)),
    ]

    /// A few rival players spread across Salt Lake City neighborhoods so every
    /// scope (neighborhood → city → state → global) has standings to show.
    public static func seedEvents(season: Season, now: TimeInterval) -> [ScoreEvent] {
        let downtown = regions[0]
        let sugarhouse = regions[1]
        // Another city/state to make the state & global boards non-trivial.
        let boise = ResolvedRegion(neighborhoodID: "id-north-end", neighborhoodName: "North End",
                                   cityID: "id-boise", cityName: "Boise",
                                   stateCode: "ID", stateName: "Idaho",
                                   geohash: Geohash.encode(latitude: 43.6150, longitude: -116.2023, precision: 7))

        let rows: [(String, String, Int, Int, ResolvedRegion)] = [
            ("p-ava", "Ava R.", 4820, 240, downtown),
            ("p-leo", "Leo M.", 4410, 221, downtown),
            ("p-mae", "Mae K.", 3960, 198, sugarhouse),
            ("p-nico", "Nico T.", 3720, 186, sugarhouse),
            ("p-sam", "Sam D.", 5210, 261, downtown),
            ("p-ivy", "Ivy P.", 2980, 149, sugarhouse),
            ("p-omar", "Omar B.", 6120, 306, boise),
            ("p-jun", "Jun L.", 5640, 282, boise),
        ]

        return rows.map { (id, name, points, cleared, region) in
            ScoreEvent(playerID: id, displayName: name, points: points,
                       gremlinsCleared: cleared, gramsRemoved: Double(cleared) * 22,
                       region: region, season: season, timestamp: now)
        }
    }
}
