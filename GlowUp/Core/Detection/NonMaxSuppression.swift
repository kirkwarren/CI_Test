import Foundation

/// Greedy non-max suppression: within a single frame, collapse overlapping
/// detections of the *same* category, keeping the highest-confidence box.
///
/// Object detectors routinely emit several boxes for one object; without NMS a
/// single bottle would spawn a cluster of gremlins.
public enum NonMaxSuppression {
    public static func reduce(_ detections: [RawDetection], iouThreshold: Double = 0.45) -> [RawDetection] {
        // Sort by confidence, highest first.
        let sorted = detections.sorted { $0.confidence > $1.confidence }
        var kept: [RawDetection] = []

        for candidate in sorted {
            let overlapsKept = kept.contains { k in
                k.category == candidate.category && k.box.iou(candidate.box) > iouThreshold
            }
            if !overlapsKept {
                kept.append(candidate)
            }
        }
        return kept
    }
}
