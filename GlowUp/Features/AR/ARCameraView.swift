import SwiftUI
import ImageIO
import simd
#if canImport(RealityKit) && canImport(ARKit)
import RealityKit
import ARKit

/// Live AR camera that runs the litter detector on each frame and reports
/// gate-ready `FrameDetection`s (with ground-plane + distance gating via raycast).
struct ARCameraView: UIViewRepresentable {
    let detector: LitterDetecting
    let onDetections: ([FrameDetection], TimeInterval) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(detector: detector, onDetections: onDetections)
    }

    func makeUIView(context: Context) -> ARView {
        let view = ARView(frame: .zero, cameraMode: .ar, automaticallyConfigureSession: false)
        context.coordinator.arView = view
        view.session.delegate = context.coordinator

        if ARWorldTrackingConfiguration.isSupported {
            let config = ARWorldTrackingConfiguration()
            config.planeDetection = [.horizontal]
            config.environmentTexturing = .none
            view.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        }
        return view
    }

    func updateUIView(_ uiView: ARView, context: Context) {}

    static func dismantleUIView(_ uiView: ARView, coordinator: Coordinator) {
        uiView.session.pause()
    }

    final class Coordinator: NSObject, ARSessionDelegate {
        weak var arView: ARView?
        private let detector: LitterDetecting
        private let onDetections: ([FrameDetection], TimeInterval) -> Void
        private var processing = false
        private var lastProcessed: TimeInterval = 0
        // Throttle inference to ~6 Hz; plenty for stable spawning, easy on battery.
        private let minInterval: TimeInterval = 0.16

        init(detector: LitterDetecting, onDetections: @escaping ([FrameDetection], TimeInterval) -> Void) {
            self.detector = detector
            self.onDetections = onDetections
        }

        func session(_ session: ARSession, didUpdate frame: ARFrame) {
            guard !processing, frame.timestamp - lastProcessed > minInterval else { return }
            processing = true
            lastProcessed = frame.timestamp

            let pixelBuffer = frame.capturedImage
            let timestamp = frame.timestamp
            let orientation = CGImagePropertyOrientation.right // portrait, back camera

            Task { [weak self] in
                guard let self else { return }
                let raw = await self.detector.detect(pixelBuffer: pixelBuffer, orientation: orientation)
                let dets = await self.buildFrameDetections(raw, timestamp: timestamp)
                await MainActor.run {
                    self.onDetections(dets, timestamp)
                    self.processing = false
                }
            }
        }

        /// Raycast each detection's center to the world to gate on a real surface
        /// and estimate reachable distance.
        @MainActor
        private func buildFrameDetections(_ raw: [RawDetection], timestamp: TimeInterval) -> [FrameDetection] {
            guard let arView, arView.bounds.width > 0 else {
                return raw.map { FrameDetection(detection: $0, timestamp: timestamp) }
            }
            let bounds = arView.bounds
            let camPos = arView.cameraTransform.translation

            return raw.map { det in
                let point = CGPoint(x: CGFloat(det.box.centerX) * bounds.width,
                                    y: CGFloat(det.box.centerY) * bounds.height)
                var onPlane = false
                var distance: Double?
                let hits = arView.raycast(from: point, allowing: .estimatedPlane, alignment: .horizontal)
                if let hit = hits.first {
                    onPlane = true
                    let c = hit.worldTransform.columns.3
                    distance = Double(simd_distance(camPos, SIMD3<Float>(c.x, c.y, c.z)))
                }
                return FrameDetection(detection: det, timestamp: timestamp,
                                      isOnDetectedPlane: onPlane, distanceMeters: distance)
            }
        }
    }
}
#endif
