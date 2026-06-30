import SwiftUI

@main
struct GlowUpApp: App {
    @StateObject private var env = AppEnvironment.live()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(env)
                .preferredColorScheme(.dark)
                .tint(Theme.tint("emerald"))
        }
    }
}
