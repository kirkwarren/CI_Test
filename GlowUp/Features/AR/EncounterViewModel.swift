import Foundation
import Combine

/// Drives one AR cleanup session: ingests detections into the spawner, holds the
/// live gremlins, and runs the banish/score flow through `AppEnvironment`.
@MainActor
final class EncounterViewModel: ObservableObject {
    @Published var gremlins: [Gremlin] = []
    @Published var active: Gremlin?               // gremlin being banished
    @Published var lastResult: ScoreBreakdown?
    @Published var usingSimulation = false

    let env: AppEnvironment
    private let spawner = GremlinSpawner()
    private var simTimer: Timer?
    private var simClock: TimeInterval = 0

    init(env: AppEnvironment) {
        self.env = env
    }

    /// Real path: forward gate-ready detections from the AR camera.
    func ingest(_ frame: [FrameDetection], at now: TimeInterval) {
        let coord = env.location.coordinate
        let spawned = spawner.ingest(frame, at: now, latitude: coord?.latitude, longitude: coord?.longitude)
        for g in spawned where !gremlins.contains(where: { $0.id == g.id }) {
            gremlins.append(g)
        }
    }

    /// Fallback path: synthesize a detection stream so the flow is demoable
    /// without a camera or bundled model.
    func startSimulationIfNeeded() {
        guard ARSupport.isAvailable == false else { return }
        usingSimulation = true
        simTimer?.invalidate()
        simTimer = Timer.scheduledTimer(withTimeInterval: 0.2, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.tickSimulation() }
        }
    }

    private func tickSimulation() {
        simClock += 0.2
        let frame = DemoData.scriptedDetections.map {
            FrameDetection(detection: $0, timestamp: simClock, isOnDetectedPlane: true, distanceMeters: 2.0)
        }
        ingest(frame, at: simClock)
        if gremlins.count >= DemoData.scriptedDetections.count {
            simTimer?.invalidate()
            simTimer = nil
        }
    }

    func beginBanish(_ gremlin: Gremlin) {
        active = gremlin
    }

    func cancelBanish() {
        active = nil
    }

    func confirmBanish(evidence: DisposalEvidence, regionPriority: Int) async {
        guard let gremlin = active else { return }
        let result = await env.banish(gremlin, evidence: evidence, regionPriority: regionPriority)
        lastResult = result
        gremlins.removeAll { $0.id == gremlin.id }
        active = nil
    }

    func dismissResult() {
        lastResult = nil
    }

    func stop() {
        simTimer?.invalidate()
        simTimer = nil
    }
}

/// Tiny helper so view models don't import ARKit directly.
enum ARSupport {
    static var isAvailable: Bool {
        #if targetEnvironment(simulator)
        return false
        #elseif canImport(ARKit)
        return ARWorldTrackingSupport.isSupported
        #else
        return false
        #endif
    }
}

#if canImport(ARKit) && !targetEnvironment(simulator)
import ARKit
enum ARWorldTrackingSupport {
    static var isSupported: Bool { ARWorldTrackingConfiguration.isSupported }
}
#endif
