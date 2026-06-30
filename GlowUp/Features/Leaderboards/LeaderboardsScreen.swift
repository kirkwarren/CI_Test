import SwiftUI

enum ScopeLevel: String, CaseIterable, Identifiable {
    case neighborhood = "Neighborhood"
    case city = "City"
    case state = "State"
    case global = "Global"
    var id: String { rawValue }
}

struct LeaderboardsScreen: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var level: ScopeLevel = .neighborhood
    @State private var entries: [LeaderboardEntry] = []
    @State private var myRank: Int?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    scopePicker
                    regionLabel
                    if entries.isEmpty {
                        emptyState
                    } else {
                        board
                    }
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle("Leaderboards")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task(id: level) { await load() }
        .task(id: env.player.glowPoints) { await load() } // refresh after a banish
    }

    private var scopePicker: some View {
        Picker("Scope", selection: $level) {
            ForEach(ScopeLevel.allCases) { Text($0.rawValue).tag($0) }
        }
        .pickerStyle(.segmented)
    }

    private var regionLabel: some View {
        HStack {
            Image(systemName: icon(for: level)).foregroundStyle(Theme.tint("fuchsia"))
            Text(regionName).font(.subheadline.weight(.semibold)).foregroundStyle(.white)
            Spacer()
            GlowChip(env.season.displayName, tint: Theme.tint("cyan"))
        }
    }

    private var board: some View {
        VStack(spacing: 8) {
            ForEach(entries) { entry in
                LeaderboardRow(entry: entry, isMe: entry.playerID == env.player.id)
            }
            if let myRank, !entries.contains(where: { $0.playerID == env.player.id }) {
                Text("Your rank: #\(myRank)")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else if myRank == nil {
                Text("Banish a gremlin to join this board.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }

    private var emptyState: some View {
        GlowCard {
            VStack(spacing: 8) {
                Image(systemName: "trophy").font(.title).foregroundStyle(Theme.tint("amber"))
                Text("No standings yet for this \(level.rawValue.lowercased()).")
                    .font(.subheadline).foregroundStyle(.white)
                Text("Be the first — hunt some gremlins nearby.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
            }
            .frame(maxWidth: .infinity)
        }
    }

    // MARK: - Data

    private func scope(for level: ScopeLevel) -> LeaderboardScope? {
        let r = env.activeRegion
        switch level {
        case .global: return .global
        case .state: return r.stateCode.map { .state(code: $0) }
        case .city: return r.cityID.map { .city(id: $0) }
        case .neighborhood: return r.neighborhoodID.map { .neighborhood(id: $0) }
        }
    }

    private func load() async {
        guard let scope = scope(for: level) else { entries = []; myRank = nil; return }
        entries = await env.leaderboard.standings(scope: scope, season: env.season, limit: 25)
        myRank = await env.leaderboard.rank(playerID: env.player.id, scope: scope, season: env.season)
    }

    private var regionName: String {
        let r = env.activeRegion
        switch level {
        case .global: return "Everywhere"
        case .state: return r.stateName ?? r.stateCode ?? "Your state"
        case .city: return r.cityName ?? "Your city"
        case .neighborhood: return r.neighborhoodName ?? "Your neighborhood"
        }
    }

    private func icon(for level: ScopeLevel) -> String {
        switch level {
        case .global: return "globe.americas.fill"
        case .state: return "map.fill"
        case .city: return "building.2.fill"
        case .neighborhood: return "house.fill"
        }
    }
}

struct LeaderboardRow: View {
    let entry: LeaderboardEntry
    let isMe: Bool

    var body: some View {
        HStack(spacing: 12) {
            Text(rankText).font(.headline.monospacedDigit())
                .frame(width: 36)
                .foregroundStyle(entry.rank <= 3 ? Theme.tint("amber") : Theme.textSecondary)
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.displayName + (isMe ? " · you" : ""))
                    .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                Text("\(entry.gremlinsCleared) gremlins cleared")
                    .font(.caption2).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            Text("\(entry.points)").font(.subheadline.bold())
                .foregroundStyle(Theme.tint("emerald"))
        }
        .padding(12)
        .background(isMe ? Theme.tint("emerald").opacity(0.12) : Theme.surface,
                    in: RoundedRectangle(cornerRadius: 12))
    }

    private var rankText: String { entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : "\(entry.rank)" }
}

#Preview {
    LeaderboardsScreen().environmentObject(AppEnvironment.preview())
}
