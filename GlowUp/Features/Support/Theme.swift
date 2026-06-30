import SwiftUI

/// GlowUp visual language: a dark "night map" with neon glow accents. The tint
/// tokens here mirror the `tint` strings carried on `GremlinSpecies`.
public enum Theme {
    public static let background = Color(hex: 0x020617)   // slate-950
    public static let surface = Color.white.opacity(0.05)
    public static let stroke = Color.white.opacity(0.10)
    public static let textPrimary = Color.white
    public static let textSecondary = Color(hex: 0x94A3B8) // slate-400

    public static func tint(_ token: String) -> Color {
        switch token {
        case "emerald": return Color(hex: 0x34D399)
        case "cyan": return Color(hex: 0x22D3EE)
        case "sky": return Color(hex: 0x38BDF8)
        case "amber": return Color(hex: 0xFBBF24)
        case "fuchsia": return Color(hex: 0xE879F9)
        case "violet": return Color(hex: 0xA78BFA)
        case "lime": return Color(hex: 0xA3E635)
        default: return Color(hex: 0x34D399)
        }
    }

    public static func tint(for rarity: GremlinRarity) -> Color {
        switch rarity {
        case .common: return tint("emerald")
        case .uncommon: return tint("cyan")
        case .rare: return tint("fuchsia")
        case .legendary: return tint("amber")
        }
    }
}

public extension Color {
    init(hex: UInt32, alpha: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}

/// A frosted card container used across screens.
public struct GlowCard<Content: View>: View {
    private let tint: Color?
    private let content: Content

    public init(tint: Color? = nil, @ViewBuilder content: () -> Content) {
        self.tint = tint
        self.content = content()
    }

    public var body: some View {
        content
            .padding(16)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(tint?.opacity(0.4) ?? Theme.stroke, lineWidth: 1)
            )
    }
}

/// A small pill/badge.
public struct GlowChip: View {
    let text: String
    let tint: Color
    public init(_ text: String, tint: Color) {
        self.text = text
        self.tint = tint
    }
    public var body: some View {
        Text(text)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(tint.opacity(0.15), in: Capsule())
            .overlay(Capsule().stroke(tint.opacity(0.4), lineWidth: 1))
            .foregroundStyle(tint)
    }
}

public struct PrimaryButtonStyle: ButtonStyle {
    let tint: Color
    public init(tint: Color = Theme.tint("emerald")) { self.tint = tint }
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(
                LinearGradient(colors: [tint, tint.opacity(0.7)], startPoint: .leading, endPoint: .trailing),
                in: RoundedRectangle(cornerRadius: 14, style: .continuous)
            )
            .foregroundStyle(Color(hex: 0x020617))
            .opacity(configuration.isPressed ? 0.85 : 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .shadow(color: tint.opacity(0.5), radius: 12, y: 4)
    }
}
