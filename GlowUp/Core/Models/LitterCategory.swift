import Foundation

/// The recycling/disposal stream a piece of litter belongs to. Sorting a
/// gremlin into the correct stream earns a scoring bonus and supports the
/// city's diversion metrics.
public enum RecyclingStream: String, Codable, CaseIterable {
    case landfill
    case plastic
    case metal
    case glass
    case paper
    case compost
    case special // batteries, e-waste, etc. — handled, never picked up by hand

    public var displayName: String {
        switch self {
        case .landfill: return "Landfill"
        case .plastic: return "Plastic"
        case .metal: return "Metal"
        case .glass: return "Glass"
        case .paper: return "Paper"
        case .compost: return "Compost"
        case .special: return "Special / hazard"
        }
    }
}

public enum GremlinRarity: String, Codable, CaseIterable {
    case common, uncommon, rare, legendary

    /// Base points a gremlin of this rarity is worth before multipliers.
    public var basePoints: Int {
        switch self {
        case .common: return 10
        case .uncommon: return 20
        case .rare: return 40
        case .legendary: return 100
        }
    }
}

/// The categories the on-device litter detector emits. These map 1:1 to the
/// gremlin "species" the player sees in AR — clearing the litter banishes the
/// gremlin.
///
/// Categories are aligned with the labels in the training pipeline (see
/// `ml/labelmap.json`) so the Core ML model's class indices decode directly
/// into these cases.
public enum LitterCategory: String, Codable, CaseIterable {
    case plasticBottle
    case aluminumCan
    case glassBottle
    case cup
    case foodWrapper
    case cigarette
    case paper
    case plasticBag
    case foodContainer
    case other

    /// The gremlin species shown for this litter type.
    public var species: GremlinSpecies {
        switch self {
        case .plasticBottle:
            return GremlinSpecies(id: "bottlebrute", name: "Bottlebrute", category: self,
                                  rarity: .common, stream: .plastic, emoji: "🧴",
                                  tint: "emerald", estimatedGrams: 30,
                                  blurb: "A swollen brute made of crushed plastic bottles.")
        case .aluminumCan:
            return GremlinSpecies(id: "canclank", name: "Canclank", category: self,
                                  rarity: .common, stream: .metal, emoji: "🥫",
                                  tint: "cyan", estimatedGrams: 15,
                                  blurb: "Rattles down the gutter, dented and loud.")
        case .glassBottle:
            return GremlinSpecies(id: "shardimp", name: "Shardimp", category: self,
                                  rarity: .uncommon, stream: .glass, emoji: "🍾",
                                  tint: "sky", estimatedGrams: 200,
                                  blurb: "Sharp and glinting — handle with the grabber, not bare hands.")
        case .cup:
            return GremlinSpecies(id: "cupgoblin", name: "Cupgoblin", category: self,
                                  rarity: .common, stream: .landfill, emoji: "🥤",
                                  tint: "amber", estimatedGrams: 25,
                                  blurb: "A lidded goblin that hops between park benches.")
        case .foodWrapper:
            return GremlinSpecies(id: "wrapwraith", name: "Wrapwraith", category: self,
                                  rarity: .common, stream: .landfill, emoji: "🍬",
                                  tint: "fuchsia", estimatedGrams: 5,
                                  blurb: "A crinkling wraith of foil and film carried on the wind.")
        case .cigarette:
            return GremlinSpecies(id: "buttgrub", name: "Buttgrub", category: self,
                                  rarity: .uncommon, stream: .landfill, emoji: "🚬",
                                  tint: "violet", estimatedGrams: 1,
                                  blurb: "Tiny, toxic, and everywhere. Worth extra for the trouble.")
        case .paper:
            return GremlinSpecies(id: "papermite", name: "Papermite", category: self,
                                  rarity: .common, stream: .paper, emoji: "📄",
                                  tint: "lime", estimatedGrams: 8,
                                  blurb: "A flutter of receipts and flyers.")
        case .plasticBag:
            return GremlinSpecies(id: "baghag", name: "Baghag", category: self,
                                  rarity: .uncommon, stream: .plastic, emoji: "🛍️",
                                  tint: "emerald", estimatedGrams: 10,
                                  blurb: "Billows from tree branches like a tattered ghost.")
        case .foodContainer:
            return GremlinSpecies(id: "cartoncreep", name: "Cartoncreep", category: self,
                                  rarity: .uncommon, stream: .compost, emoji: "🍱",
                                  tint: "cyan", estimatedGrams: 40,
                                  blurb: "Greasy clamshell creature lurking near food trucks.")
        case .other:
            return GremlinSpecies(id: "mucksprite", name: "Mucksprite", category: self,
                                  rarity: .common, stream: .landfill, emoji: "🌫️",
                                  tint: "amber", estimatedGrams: 20,
                                  blurb: "An odd bit of debris that defies easy sorting.")
        }
    }

    public var displayName: String { species.name }
}

/// Static, content-style description of a gremlin type.
public struct GremlinSpecies: Equatable, Codable, Hashable {
    public let id: String
    public let name: String
    public let category: LitterCategory
    public let rarity: GremlinRarity
    public let stream: RecyclingStream
    public let emoji: String
    public let tint: String
    public let estimatedGrams: Double
    public let blurb: String
}
