import SwiftUI
import MapKit

/// The live map: real-time location on an actual mapping surface, with nearby
/// gremlin sightings. The hunt itself happens in AR via the camera.
struct MapScreen: View {
    @EnvironmentObject private var env: AppEnvironment

    // Salt Lake City default until a fix arrives.
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 40.7608, longitude: -111.8910),
        span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01))
    @State private var sightings: [GremlinSighting] = []
    @State private var showEncounter = false

    private var center: CLLocationCoordinate2D {
        env.location.coordinate ?? region.center
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Map(coordinateRegion: $region,
                showsUserLocation: true,
                annotationItems: sightings) { sighting in
                MapAnnotation(coordinate: sighting.coordinate) {
                    GremlinPin(species: sighting.species)
                }
            }
            .ignoresSafeArea()
            .overlay(alignment: .top) { header }

            huntPanel
        }
        .onAppear(perform: refresh)
        .onReceive(env.location.$coordinate.compactMap { $0 }) { coord in
            withAnimation { region.center = coord }
            sightings = GremlinSighting.scatter(around: coord)
            Task { await env.refreshRegion() }
        }
        .fullScreenCover(isPresented: $showEncounter) {
            EncounterView().environmentObject(env)
        }
    }

    private func refresh() {
        sightings = GremlinSighting.scatter(around: center)
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(env.currentRegion?.neighborhoodName ?? "Locating…")
                    .font(.headline).foregroundStyle(.white)
                Text([env.currentRegion?.cityName, env.currentRegion?.stateCode].compactMap { $0 }.joined(separator: ", "))
                    .font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            GlowChip(env.season.displayName, tint: Theme.tint("fuchsia"))
        }
        .padding(.horizontal, 16).padding(.vertical, 10)
        .background(.ultraThinMaterial, in: Capsule())
        .padding(.horizontal, 16).padding(.top, 8)
    }

    private var huntPanel: some View {
        GlowCard(tint: Theme.tint("emerald")) {
            VStack(spacing: 12) {
                HStack {
                    Image(systemName: "ladybug.fill").foregroundStyle(Theme.tint("emerald"))
                    Text("\(sightings.count) gremlins nearby")
                        .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                    Spacer()
                    Text("Lv \(env.player.level)").font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Text("Point your camera at litter on the ground to reveal and banish gremlins for points.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                Button {
                    showEncounter = true
                } label: {
                    Label("Hunt gremlins (AR)", systemImage: "camera.viewfinder")
                }
                .buttonStyle(PrimaryButtonStyle())
            }
        }
        .padding(16)
    }
}

/// A glowing map pin for a gremlin sighting.
struct GremlinPin: View {
    let species: GremlinSpecies
    var body: some View {
        let tint = Theme.tint(species.tint)
        return Text(species.emoji)
            .font(.title2)
            .padding(8)
            .background(tint.opacity(0.25), in: Circle())
            .overlay(Circle().stroke(tint, lineWidth: 2))
            .shadow(color: tint.opacity(0.7), radius: 8)
    }
}

#Preview {
    MapScreen().environmentObject(AppEnvironment.preview())
}
