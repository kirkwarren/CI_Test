import Foundation

/// Standard geohash encoder (base-32, Niemeyer). Used to bucket locations into
/// stable spatial cells for neighborhood fallback IDs and spatial queries.
///
/// Reference vector (precision 11): (57.64911, 10.40744) → "u4pruydqqvj".
public enum Geohash {
    private static let base32 = Array("0123456789bcdefghjkmnpqrstuvwxyz")

    public static func encode(latitude: Double, longitude: Double, precision: Int = 9) -> String {
        precondition(precision > 0, "precision must be positive")
        var latInterval = (-90.0, 90.0)
        var lonInterval = (-180.0, 180.0)
        var hash = ""
        var isEven = true
        var bit = 0
        var ch = 0

        while hash.count < precision {
            if isEven {
                let mid = (lonInterval.0 + lonInterval.1) / 2
                if longitude >= mid {
                    ch |= (1 << (4 - bit))
                    lonInterval.0 = mid
                } else {
                    lonInterval.1 = mid
                }
            } else {
                let mid = (latInterval.0 + latInterval.1) / 2
                if latitude >= mid {
                    ch |= (1 << (4 - bit))
                    latInterval.0 = mid
                } else {
                    latInterval.1 = mid
                }
            }

            isEven.toggle()
            if bit < 4 {
                bit += 1
            } else {
                hash.append(base32[ch])
                bit = 0
                ch = 0
            }
        }
        return hash
    }
}
