import Foundation
import CoreLocation
import Combine

/// Wraps CoreLocation for the live map and gremlin spawning. Publishes the
/// current coordinate, heading, and authorization so SwiftUI can react.
@MainActor
public final class LocationService: NSObject, ObservableObject {
    @Published public private(set) var coordinate: CLLocationCoordinate2D?
    @Published public private(set) var heading: CLLocationDirection = 0
    @Published public private(set) var authorization: CLAuthorizationStatus = .notDetermined
    /// Smoothed speed (m/s) used by the movement-plausibility anti-cheat signal.
    @Published public private(set) var speedMetersPerSecond: Double = 0

    private let manager = CLLocationManager()

    public override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.distanceFilter = 5 // meters
        authorization = manager.authorizationStatus
    }

    public func requestAuthorization() {
        manager.requestWhenInUseAuthorization()
    }

    public func start() {
        manager.startUpdatingLocation()
        if CLLocationManager.headingAvailable() {
            manager.startUpdatingHeading()
        }
    }

    public func stop() {
        manager.stopUpdatingLocation()
        manager.stopUpdatingHeading()
    }
}

extension LocationService: CLLocationManagerDelegate {
    public nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        Task { @MainActor in
            self.authorization = status
            if status == .authorizedWhenInUse || status == .authorizedAlways {
                self.start()
            }
        }
    }

    public nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        let coord = loc.coordinate
        let speed = max(0, loc.speed)
        Task { @MainActor in
            self.coordinate = coord
            self.speedMetersPerSecond = speed
        }
    }

    public nonisolated func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        let value = newHeading.trueHeading >= 0 ? newHeading.trueHeading : newHeading.magneticHeading
        Task { @MainActor in
            self.heading = value
        }
    }

    public nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // Non-fatal: keep last known fix. Production would surface a gentle hint.
    }
}
