import Foundation
import CoreVideo
import ImageIO
import CoreGraphics

#if canImport(Vision) && canImport(CoreML)
import Vision
import CoreML

/// Live, on-device litter detector: a YOLO-style object detector exported to
/// Core ML and run through Vision. Produces `RawDetection`s for the gate.
///
/// The compiled model (`LitterDetector.mlmodelc`) is produced by the pipeline in
/// `ml/` and bundled into the app. If it's missing (e.g. a clean checkout before
/// training), detection is disabled gracefully rather than crashing.
public final class CoreMLLitterDetector: LitterDetecting {
    private let vnModel: VNCoreMLModel?
    private let minConfidence: Float

    public init(modelName: String = "LitterDetector", minConfidence: Float = 0.4) {
        self.minConfidence = minConfidence
        self.vnModel = Self.loadModel(named: modelName)
    }

    public var isModelLoaded: Bool { vnModel != nil }

    private static func loadModel(named name: String) -> VNCoreMLModel? {
        let config = MLModelConfiguration()
        config.computeUnits = .all // CPU + GPU + Neural Engine
        guard let url = Bundle.main.url(forResource: name, withExtension: "mlmodelc")
            ?? Bundle.main.url(forResource: name, withExtension: "mlmodel") else {
            return nil
        }
        guard let model = try? MLModel(contentsOf: url, configuration: config),
              let vn = try? VNCoreMLModel(for: model) else {
            return nil
        }
        return vn
    }

    public func detect(pixelBuffer: CVPixelBuffer, orientation: CGImagePropertyOrientation) async -> [RawDetection] {
        guard let vnModel else { return [] }

        return await withCheckedContinuation { continuation in
            let request = VNCoreMLRequest(model: vnModel) { request, _ in
                let observations = (request.results as? [VNRecognizedObjectObservation]) ?? []
                let detections: [RawDetection] = observations.compactMap { obs in
                    guard let top = obs.labels.first, top.confidence >= self.minConfidence else { return nil }
                    let category = LitterLabelMap.category(for: top.identifier)
                    return RawDetection(category: category,
                                        confidence: Double(top.confidence),
                                        box: Self.convert(obs.boundingBox))
                }
                continuation.resume(returning: detections)
            }
            // Letterbox-free scale keeps small ground litter from being squashed.
            request.imageCropAndScaleOption = .scaleFit

            let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: orientation, options: [:])
            do {
                try handler.perform([request])
            } catch {
                continuation.resume(returning: [])
            }
        }
    }

    /// Vision boxes are normalized with a bottom-left origin; convert to our
    /// top-left convention.
    private static func convert(_ b: CGRect) -> BoundingBox {
        BoundingBox(x: Double(b.origin.x),
                    y: Double(1.0 - b.origin.y - b.size.height),
                    width: Double(b.size.width),
                    height: Double(b.size.height))
    }
}
#endif
