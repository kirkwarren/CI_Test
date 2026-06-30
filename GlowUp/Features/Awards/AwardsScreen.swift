import SwiftUI

/// Community-improvement awards: leaderboard performance routes sponsor grants to
/// civic projects (parks, trees, murals, gardens) — never cash to a player.
struct AwardsScreen: View {
    @EnvironmentObject private var env: AppEnvironment

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    intro
                    if env.awards.isEmpty {
                        empty
                    } else {
                        ForEach(env.awards) { award in
                            AwardCard(award: award) { projectID in
                                env.vote(on: award, projectID: projectID)
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(Theme.background)
            .navigationTitle("Community Awards")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task { await env.refreshAwards() }
    }

    private var intro: some View {
        GlowCard(tint: Theme.tint("fuchsia")) {
            VStack(alignment: .leading, spacing: 8) {
                Label("Winning improves the real world", systemImage: "gift.fill")
                    .font(.headline).foregroundStyle(.white)
                Text("Top neighborhoods and cities, and regions that hit cleanup milestones, unlock grants. Residents vote on which local project the grant funds.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
            }
        }
    }

    private var empty: some View {
        GlowCard {
            VStack(spacing: 8) {
                Image(systemName: "sparkles").font(.title).foregroundStyle(Theme.tint("amber"))
                Text("No awards unlocked yet").font(.subheadline).foregroundStyle(.white)
                Text("Climb your neighborhood board and clear gremlins to unlock the first community grant.")
                    .font(.caption).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

struct AwardCard: View {
    let award: CommunityAward
    let onVote: (String) -> Void

    var body: some View {
        GlowCard(tint: Theme.tint(award.reason == .milestone ? "cyan" : "amber")) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    GlowChip(award.scope.level.capitalized, tint: Theme.tint("fuchsia"))
                    GlowChip(award.reason == .milestone ? "Milestone" : "Season #1",
                             tint: Theme.tint(award.reason == .milestone ? "cyan" : "amber"))
                    Spacer()
                    Text("$\(award.grantUSD.formatted())")
                        .font(.title3.bold()).foregroundStyle(Theme.tint("emerald"))
                }
                Text(award.title).font(.subheadline.weight(.semibold)).foregroundStyle(.white)

                switch award.status {
                case .pendingVote:
                    Text("Residents: vote on the project to fund").font(.caption).foregroundStyle(Theme.textSecondary)
                    VStack(spacing: 8) {
                        ForEach(award.projectOptions) { project in
                            Button { onVote(project.id) } label: {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(project.title).font(.caption.weight(.semibold)).foregroundStyle(.white)
                                        Text(project.detail).font(.caption2).foregroundStyle(Theme.textSecondary)
                                            .multilineTextAlignment(.leading)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right").foregroundStyle(Theme.textSecondary)
                                }
                                .padding(10)
                                .background(Theme.surface, in: RoundedRectangle(cornerRadius: 10))
                            }
                        }
                    }
                case .funded, .completed:
                    if let funded = award.projectOptions.first(where: { $0.id == award.fundedProjectID }) {
                        Label("Funded: \(funded.title)", systemImage: "checkmark.seal.fill")
                            .font(.caption.weight(.semibold)).foregroundStyle(Theme.tint("emerald"))
                    }
                }
            }
        }
    }
}

#Preview {
    AwardsScreen().environmentObject(AppEnvironment.preview())
}
