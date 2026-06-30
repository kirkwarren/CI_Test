import SwiftUI

/// The AR hunt: live camera, gremlins overlaid on real litter, and the
/// banish/score flow.
struct EncounterView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var model: EncounterViewModel?

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            if let model {
                EncounterStage(vm: model)
            }
        }
        .onAppear {
            if model == nil {
                let m = EncounterViewModel(env: env)
                m.startSimulationIfNeeded()
                model = m
            }
        }
        .onDisappear { model?.stop() }
    }
}

private struct EncounterStage: View {
    @ObservedObject var vm: EncounterViewModel
    @EnvironmentObject private var env: AppEnvironment
    @Environment(\.dismiss) private var dismiss
    @State private var showHazard = false

    var body: some View {
        ZStack {
            cameraLayer.ignoresSafeArea()

            gremlinOverlay

            VStack {
                topBar
                Spacer()
                hint
            }
            .padding()

            if let active = vm.active {
                BanishSheet(gremlin: active,
                            onCancel: { vm.cancelBanish() },
                            onConfirm: { evidence, priority in
                                Task { await vm.confirmBanish(evidence: evidence, regionPriority: priority) }
                            })
                .transition(.move(edge: .bottom))
            }

            if let result = vm.lastResult {
                ResultToast(result: result, comboStreak: env.comboStreak) { vm.dismissResult() }
            }
        }
        .animation(.spring(duration: 0.3), value: vm.active != nil)
        .animation(.easeOut, value: vm.lastResult != nil)
        .alert("Report a hazard", isPresented: $showHazard) {
            Button("Needles / sharps") { env.reportHazard(kind: "needles") }
            Button("Chemicals") { env.reportHazard(kind: "chemicals") }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Don't touch hazardous waste. Report it and we'll route it to the right city department. You earn points for keeping the area safe.")
        }
    }

    @ViewBuilder private var cameraLayer: some View {
        #if canImport(ARKit) && canImport(RealityKit)
        if ARSupport.isAvailable {
            ARCameraView(detector: env.detector, onDetections: { dets, now in vm.ingest(dets, at: now) })
        } else {
            SimulatedBackdrop()
        }
        #else
        SimulatedBackdrop()
        #endif
    }

    private var gremlinOverlay: some View {
        GeometryReader { geo in
            ForEach(vm.gremlins) { g in
                GremlinMarker(species: g.species)
                    .position(x: g.anchorBox.centerX * geo.size.width,
                              y: g.anchorBox.centerY * geo.size.height)
                    .onTapGesture { vm.beginBanish(g) }
            }
        }
        .allowsHitTesting(vm.active == nil)
    }

    private var topBar: some View {
        HStack {
            Button { dismiss() } label: {
                Image(systemName: "xmark").font(.headline).padding(10)
                    .background(.ultraThinMaterial, in: Circle())
            }
            Spacer()
            if env.comboStreak > 1 {
                GlowChip("Combo ×\(env.comboStreak)", tint: Theme.tint("amber"))
            }
            Spacer()
            Button { showHazard = true } label: {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.headline).padding(10)
                    .background(.ultraThinMaterial, in: Circle())
                    .foregroundStyle(Theme.tint("amber"))
            }
        }
        .foregroundStyle(.white)
    }

    private var hint: some View {
        Text(vm.gremlins.isEmpty
             ? "Scan the ground — point at litter to reveal gremlins."
             : "Tap a gremlin to banish it. Pick up the litter and sort it correctly for bonus points.")
            .font(.footnote)
            .foregroundStyle(.white)
            .padding(.horizontal, 14).padding(.vertical, 10)
            .background(.ultraThinMaterial, in: Capsule())
    }
}

/// A pulsing AR gremlin marker.
struct GremlinMarker: View {
    let species: GremlinSpecies
    @State private var pulse = false
    var body: some View {
        let tint = Theme.tint(species.tint)
        return Text(species.emoji)
            .font(.system(size: 44))
            .padding(10)
            .background(tint.opacity(0.25), in: Circle())
            .overlay(Circle().stroke(tint, lineWidth: 2))
            .shadow(color: tint.opacity(0.8), radius: 12)
            .scaleEffect(pulse ? 1.08 : 0.94)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true)) { pulse = true }
            }
    }
}

/// Non-AR backdrop for simulator / unsupported devices.
struct SimulatedBackdrop: View {
    var body: some View {
        LinearGradient(colors: [Color(hex: 0x0B1220), Color(hex: 0x0A0F1A)],
                       startPoint: .top, endPoint: .bottom)
            .overlay(
                Text("Simulated camera — run on an AR-capable iPhone for live detection")
                    .font(.caption2).foregroundStyle(.white.opacity(0.5))
                    .padding(.bottom, 80),
                alignment: .bottom)
    }
}

#Preview {
    EncounterView().environmentObject(AppEnvironment.preview())
}
