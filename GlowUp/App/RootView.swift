import SwiftUI

struct RootView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var tab = 0

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            TabView(selection: $tab) {
                MapScreen()
                    .tabItem { Label("Map", systemImage: "map.fill") }
                    .tag(0)

                LeaderboardsScreen()
                    .tabItem { Label("Ranks", systemImage: "trophy.fill") }
                    .tag(1)

                AwardsScreen()
                    .tabItem { Label("Awards", systemImage: "gift.fill") }
                    .tag(2)

                ProfileScreen()
                    .tabItem { Label("You", systemImage: "person.fill") }
                    .tag(3)
            }
            .onAppear {
                env.location.requestAuthorization()
                Task { await env.refreshRegion() }
            }
        }
    }
}

#Preview {
    RootView().environmentObject(AppEnvironment.preview())
}
