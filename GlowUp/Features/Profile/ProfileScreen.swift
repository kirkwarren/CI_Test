import SwiftUI

struct ProfileScreen: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var showReset = false

    private var p: Player { env.player }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    identity
                    trust
                    stats
                    safety
                    settings
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle("You")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var identity: some View {
        GlowCard(tint: Theme.tint("emerald")) {
            HStack(spacing: 14) {
                ZStack {
                    Circle().fill(LinearGradient(colors: [Theme.tint("emerald"), Theme.tint("cyan")],
                                                 startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 56, height: 56)
                    Text("\(p.level)").font(.title2.bold()).foregroundStyle(Color(hex: 0x020617))
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text(p.displayName).font(.title3.bold()).foregroundStyle(.white)
                    Text("\(p.handle) · \(p.glowPoints) Glow Points").font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
            }
        }
    }

    private var trust: some View {
        GlowCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Label("Trust score", systemImage: "shield.lefthalf.filled")
                        .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                    Spacer()
                    Text(trustLabel).font(.caption).foregroundStyle(trustColor)
                }
                ProgressView(value: p.trustScore).tint(trustColor)
                Text("Private and never shown publicly. It rises with reliable cleanups and means faster reward confirmation.")
                    .font(.caption2).foregroundStyle(Theme.textSecondary)
            }
        }
    }

    private var stats: some View {
        let lbs = p.poundsRemoved
        return LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            StatTile(label: "Gremlins banished", value: "\(p.gremlinsCleared)", tint: "fuchsia", icon: "ladybug.fill")
            StatTile(label: "Litter removed", value: String(format: "%.1f lb", lbs), tint: "cyan", icon: "trash.fill")
            StatTile(label: "Hazards reported", value: "\(p.hazardsReported)", tint: "amber", icon: "exclamationmark.triangle.fill")
            StatTile(label: "Day streak", value: "\(p.streakDays)", tint: "emerald", icon: "flame.fill")
        }
    }

    private var safety: some View {
        GlowCard(tint: Theme.tint("amber")) {
            VStack(alignment: .leading, spacing: 8) {
                Label("Safety center", systemImage: "cross.case.fill")
                    .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                Text("Never handle hazardous waste — report it instead. Reports route to the right city department and earn points.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                HStack {
                    ForEach(["Needles", "Chemicals", "Sharps"], id: \.self) { kind in
                        Button(kind) { env.reportHazard(kind: kind.lowercased()) }
                            .font(.caption.weight(.medium))
                            .padding(.horizontal, 12).padding(.vertical, 8)
                            .background(Theme.surface, in: Capsule())
                            .foregroundStyle(.white)
                    }
                }
            }
        }
    }

    private var settings: some View {
        GlowCard {
            VStack(spacing: 12) {
                Button(role: .destructive) {
                    if showReset { env.resetProgress() }
                    showReset.toggle()
                } label: {
                    Label(showReset ? "Tap again to confirm reset" : "Reset demo progress",
                          systemImage: "arrow.counterclockwise")
                        .frame(maxWidth: .infinity)
                }
                Text("Precise location is hidden publicly by default; live location sharing is never required. Youth/family mode keeps hunts daylight-only.")
                    .font(.caption2).foregroundStyle(Theme.textSecondary)
            }
        }
    }

    private var trustLabel: String {
        p.trustScore >= 0.8 ? "Trusted" : p.trustScore >= 0.5 ? "Building" : "New"
    }
    private var trustColor: Color {
        p.trustScore >= 0.8 ? Theme.tint("emerald") : p.trustScore >= 0.5 ? Theme.tint("cyan") : Theme.tint("amber")
    }
}

struct StatTile: View {
    let label: String
    let value: String
    let tint: String
    let icon: String
    var body: some View {
        GlowCard {
            VStack(alignment: .leading, spacing: 6) {
                Label(label, systemImage: icon)
                    .font(.caption2).foregroundStyle(Theme.textSecondary)
                    .labelStyle(.titleAndIcon)
                Text(value).font(.title3.bold()).foregroundStyle(Theme.tint(tint))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

#Preview {
    ProfileScreen().environmentObject(AppEnvironment.preview())
}
