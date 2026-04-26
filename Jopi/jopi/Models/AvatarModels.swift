import SwiftUI
import Observation

enum JopiBelt: String, CaseIterable, Codable {
    case blanca = "Blanca"
    case amarilla = "Amarilla"
    case naranja = "Naranja"
    case verde = "Verde"
    case azul = "Azul"
    case roja = "Roja"
    case negra = "Negra"
    
    var color: Color {
        switch self {
        case .blanca: return .white
        case .amarilla: return .yellow
        case .naranja: return .orange
        case .verde: return .green
        case .azul: return .blue
        case .roja: return .red
        case .negra: return .black
        }
    }
}

@Observable
class AvatarState: Codable {
    var helmetColorHex: String {
        didSet { UserDefaults.standard.set(helmetColorHex, forKey: "avatar_helmetColor") }
    }
    var visorColorHex: String {
        didSet { UserDefaults.standard.set(visorColorHex, forKey: "avatar_visorColor") }
    }
    var currentBelt: JopiBelt {
        didSet { UserDefaults.standard.set(currentBelt.rawValue, forKey: "avatar_belt") }
    }
    
    var equippedAccessoryId: String? {
        didSet { UserDefaults.standard.set(equippedAccessoryId, forKey: "avatar_equippedAccessoryId") }
    }
    
    var equippedSkinId: String? {
        didSet { UserDefaults.standard.set(equippedSkinId, forKey: "avatar_equippedSkinId") }
    }
    
    var helmetColor: Color {
        get { Color(hex: helmetColorHex) }
        set { helmetColorHex = newValue.toHex() ?? "FFFFFF" }
    }
    
    var visorColor: Color {
        get { Color(hex: visorColorHex) }
        set { visorColorHex = newValue.toHex() ?? "FF4B4B" }
    }
    
    let helmetOptions: [Color] = [
        .white, 
        Color(hex: "E0E0E0"),
        Color(hex: "333333"),
        Color(hex: "00C9A7"),
        Color(hex: "8B88FF"),
        Color(hex: "FF9F7A")
    ]
    
    let visorOptions: [Color] = [
        Color(hex: "FF4B4B"),
        Color(hex: "00FFFF"),
        Color(hex: "FFD700"),
        Color(hex: "A29BFE"),
        Color(hex: "FF00FF")
    ]
    
    init() {
        self.helmetColorHex = UserDefaults.standard.string(forKey: "avatar_helmetColor") ?? "FFFFFF"
        self.visorColorHex = UserDefaults.standard.string(forKey: "avatar_visorColor") ?? "FF4B4B"
        self.equippedSkinId = UserDefaults.standard.string(forKey: "avatar_equippedSkinId")
        self.equippedAccessoryId = UserDefaults.standard.string(forKey: "avatar_equippedAccessoryId")
        
        if let beltRaw = UserDefaults.standard.string(forKey: "avatar_belt"), let belt = JopiBelt(rawValue: beltRaw) {
            self.currentBelt = belt
        } else {
            self.currentBelt = .blanca
        }
    }
    
    // MARK: - Codable Implementation
    
    enum CodingKeys: String, CodingKey {
        case helmetColorHex = "helmet_color_hex"
        case visorColorHex = "visor_color_hex"
        case currentBelt = "current_belt"
        case equippedAccessoryId = "equipped_accessory_id"
        case equippedSkinId = "equipped_skin_id"
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.helmetColorHex = try container.decode(String.self, forKey: .helmetColorHex)
        self.visorColorHex = try container.decode(String.self, forKey: .visorColorHex)
        self.currentBelt = try container.decode(JopiBelt.self, forKey: .currentBelt)
        self.equippedAccessoryId = try container.decodeIfPresent(String.self, forKey: .equippedAccessoryId)
        self.equippedSkinId = try container.decodeIfPresent(String.self, forKey: .equippedSkinId)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(helmetColorHex, forKey: .helmetColorHex)
        try container.encode(visorColorHex, forKey: .visorColorHex)
        try container.encode(currentBelt, forKey: .currentBelt)
        try container.encodeIfPresent(equippedAccessoryId, forKey: .equippedAccessoryId)
        try container.encodeIfPresent(equippedSkinId, forKey: .equippedSkinId)
    }
}
