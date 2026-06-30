import SwiftUI

/// Bottom sheet to banish a gremlin: confirm pickup, sort into the right stream,
/// and capture the "after". This is where verification evidence is gathered.
struct BanishSheet: View {
    let gremlin: Gremlin
    let onCancel: () -> Void
    let onConfirm: (DisposalEvidence, Int) -> Void

    @State private var bagged = false
    @State private var afterCaptured = false
    @State private var checkpoint = false
    @State private var stream: RecyclingStream?
    @State private var startedAt = Date()

    private var species: GremlinSpecies { gremlin.species }
    private let streamChoices: [RecyclingStream] = [.landfill, .plastic, .metal, .glass, .paper, .compost]

    var body: some View {
        VStack {
            Spacer()
            VStack(alignment: .leading, spacing: 16) {
                header

                EvidenceToggle(title: "Picked it up & bagged",
                               subtitle: "≈ \(Int(species.estimatedGrams)) g removed",
                               systemImage: "bag.fill",
                               isOn: $bagged)

                VStack(alignment: .leading, spacing: 8) {
                    Text("Sort it").font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                    Text("Correct stream: \(species.stream.displayName)")
                        .font(.caption).foregroundStyle(Theme.textSecondary)
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 92), spacing: 8)], spacing: 8) {
                        ForEach(streamChoices, id: \.self) { s in
                            Button { stream = s } label: {
                                Text(s.displayName).font(.caption.weight(.medium))
                                    .frame(maxWidth: .infinity).padding(.vertical, 8)
                            }
                            .background((stream == s ? Theme.tint("emerald").opacity(0.25) : Theme.surface),
                                        in: RoundedRectangle(cornerRadius: 10))
                            .overlay(RoundedRectangle(cornerRadius: 10)
                                .stroke(stream == s ? Theme.tint("emerald") : Theme.stroke, lineWidth: 1))
                            .foregroundStyle(.white)
                        }
                    }
                }

                EvidenceToggle(title: "Captured the 'after'",
                               subtitle: "Confirms the litter is gone",
                               systemImage: "camera.fill",
                               isOn: $afterCaptured)

                EvidenceToggle(title: "Scanned a disposal checkpoint",
                               subtitle: "Optional — boosts verification tier",
                               systemImage: "qrcode.viewfinder",
                               isOn: $checkpoint)

                HStack(spacing: 12) {
                    Button("Cancel", action: onCancel)
                        .frame(maxWidth: .infinity).padding(.vertical, 14)
                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(.white)
                    Button {
                        let evidence = DisposalEvidence(
                            bagged: bagged,
                            sortedStream: stream,
                            checkpointScanned: checkpoint,
                            dwellSeconds: Date().timeIntervalSince(startedAt),
                            afterCaptured: afterCaptured)
                        onConfirm(evidence, 3)
                    } label: {
                        Label("Banish", systemImage: "sparkles")
                    }
                    .buttonStyle(PrimaryButtonStyle(tint: Theme.tint(species.tint)))
                    .frame(maxWidth: .infinity)
                    .disabled(!(bagged && afterCaptured))
                    .opacity(bagged && afterCaptured ? 1 : 0.5)
                }
            }
            .padding(20)
            .background(Color(hex: 0x0B1220), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 24).stroke(Theme.stroke, lineWidth: 1))
            .padding(12)
        }
        .background(Color.black.opacity(0.4).ignoresSafeArea().onTapGesture(perform: onCancel))
    }

    private var header: some View {
        HStack(spacing: 12) {
            Text(species.emoji).font(.system(size: 40))
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(species.name).font(.title3.bold()).foregroundStyle(.white)
                    GlowChip(gremlin.rarity.rawValue.capitalized, tint: Theme.tint(for: gremlin.rarity))
                }
                Text(species.blurb).font(.caption).foregroundStyle(Theme.textSecondary)
            }
        }
    }
}

struct EvidenceToggle: View {
    let title: String
    let subtitle: String
    let systemImage: String
    @Binding var isOn: Bool

    var body: some View {
        Button { isOn.toggle() } label: {
            HStack(spacing: 12) {
                Image(systemName: systemImage)
                    .foregroundStyle(isOn ? Theme.tint("emerald") : Theme.textSecondary)
                    .frame(width: 24)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.subheadline.weight(.medium)).foregroundStyle(.white)
                    Text(subtitle).font(.caption2).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Image(systemName: isOn ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(isOn ? Theme.tint("emerald") : Theme.stroke)
            }
            .padding(12)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 12))
        }
    }
}

/// Result of a banish: points + breakdown, or a quiet "held for review".
struct ResultToast: View {
    let result: ScoreBreakdown
    let comboStreak: Int
    let onDismiss: () -> Void

    var body: some View {
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea().onTapGesture(perform: onDismiss)
            VStack(spacing: 14) {
                if result.heldForReview {
                    Image(systemName: "clock.badge.questionmark").font(.largeTitle)
                        .foregroundStyle(Theme.tint("amber"))
                    Text("Held for review").font(.title3.bold()).foregroundStyle(.white)
                    Text("Some evidence looked thin, so points are held pending a quick, private review. Reliable cleanups restore your trust fast.")
                        .font(.caption).foregroundStyle(Theme.textSecondary)
                        .multilineTextAlignment(.center)
                } else {
                    Text("+\(result.total)").font(.system(size: 48, weight: .heavy))
                        .foregroundStyle(Theme.tint("emerald"))
                    Text("Glow Points").font(.caption).foregroundStyle(Theme.textSecondary)
                    HStack(spacing: 8) {
                        chip("×\(fmt(result.comboMultiplier)) combo", "amber", show: result.comboMultiplier > 1)
                        chip("×\(fmt(result.priorityMultiplier)) area", "fuchsia", show: true)
                        chip("×\(fmt(result.sortingBonus)) sorted", "cyan", show: result.sortingBonus > 1)
                        chip("×\(fmt(result.eventMultiplier)) event", "violet", show: result.eventMultiplier > 1)
                    }
                    Text("≈ \(Int(result.gramsRemoved)) g removed")
                        .font(.caption2).foregroundStyle(Theme.textSecondary)
                }
                Button("Continue", action: onDismiss)
                    .buttonStyle(PrimaryButtonStyle())
            }
            .padding(24)
            .frame(maxWidth: 320)
            .background(Color(hex: 0x0B1220), in: RoundedRectangle(cornerRadius: 24))
            .overlay(RoundedRectangle(cornerRadius: 24).stroke(Theme.stroke, lineWidth: 1))
            .padding(24)
        }
    }

    @ViewBuilder private func chip(_ text: String, _ tint: String, show: Bool) -> some View {
        if show { GlowChip(text, tint: Theme.tint(tint)) }
    }
    private func fmt(_ d: Double) -> String { String(format: "%.2f", d) }
}
