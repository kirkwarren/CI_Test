import Foundation
import CoreVideo
import ImageIO

/// The camera-facing detector contract. The app depends only on this; the live
/// implementation is Core ML + Vision, and a scripted mock drives the simulator
/// and previews where there's no camera or bundled model.
public protocol LitterDetecting: AnyObject {
    /// Detect litter in one camera frame. Returns raw, pre-gate detections in
    /// top-left normalized image space.
    func detect(pixelBuffer: CVPixelBuffer, orientation: CGImagePropertyOrientation) async -> [RawDetection]
}

/// Maps the Core ML model's class label strings to `LitterCategory`. Keep this
/// in sync with `ml/labelmap.json` used during training/export.
public enum LitterLabelMap {
    public static let table: [String: LitterCategory] = [
        "plastic_bottle": .plasticBottle,
        "bottle": .plasticBottle,
        "can": .aluminumCan,
        "aluminium_can": .aluminumCan,
        "glass_bottle": .glassBottle,
        "cup": .cup,
        "wrapper": .foodWrapper,
        "snack_wrapper": .foodWrapper,
        "cigarette": .cigarette,
        "paper": .paper,
        "plastic_bag": .plasticBag,
        "bag": .plasticBag,
        "food_container": .foodContainer,
        "carton": .foodContainer,
    ]

    public static func category(for label: String) -> LitterCategory {
        table[label.lowercased()] ?? .other
    }
}

/// A scripted detector for the simulator/previews: emits a small, stable set of
/// gremlins so the AR flow is demoable without a camera or model file.
public final class MockLitterDetector: LitterDetecting {
    private let scripted: [RawDetection]
    private var frame = 0

    public init(scripted: [RawDetection]? = nil) {
        self.scripted = scripted ?? [
            RawDetection(category: .plasticBottle, confidence: 0.86,
                         box: BoundingBox(x: 0.18, y: 0.55, width: 0.16, height: 0.22)),
            RawDetection(category: .aluminumCan, confidence: 0.78,
                         box: BoundingBox(x: 0.58, y: 0.6, width: 0.14, height: 0.18)),
            RawDetection(category: .cigarette, confidence: 0.71,
                         box: BoundingBox(x: 0.4, y: 0.74, width: 0.06, height: 0.06)),
        ]
    }

    public func detect(pixelBuffer: CVPixelBuffer, orientation: CGImagePropertyOrientation) async -> [RawDetection] {
        frame += 1
        // Add light positional jitter so it behaves like a real, slightly noisy
        // stream and the gate's temporal smoothing has something to smooth.
        let jitter = Double(frame % 3) * 0.004
        return scripted.map {
            RawDetection(category: $0.category,
                         confidence: $0.confidence,
                         box: BoundingBox(x: $0.box.x + jitter, y: $0.box.y,
                                          width: $0.box.width, height: $0.box.height))
        }
    }
}
