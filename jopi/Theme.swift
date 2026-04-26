import SwiftUI

struct JopiPalette {
    let bg: Color
    let surface: Color
    let card: Color
    let text: Color
    let textMuted: Color
    let primary: Color
    let secondary: Color
    let tertiary: Color
    let border: Color
}

extension JopiPalette {
    static let cosmicDark = JopiPalette(
        bg: Color(hex: "1A1635"), // Deep Purple Night
        surface: Color(hex: "25204E"), // Softer Indigo
        card: Color(hex: "25204E").opacity(0.6), // Glass effect
        text: Color(hex: "FDFDFF"),
        textMuted: Color(hex: "B2B0D9"),
        primary: Color(hex: "8B88FF"), // Soft Periwinkle
        secondary: Color(hex: "FF9F7A"), // Soft Peach
        tertiary: Color(hex: "7AFFE0"), // Mint Green
        border: Color.white.opacity(0.08)
    )
    
    static let cosmicLight = JopiPalette(
        bg: Color(hex: "F8F9FF"),
        surface: Color(hex: "E0E4FF"),
        card: Color.white.opacity(0.8),
        text: Color(hex: "25204E"),
        textMuted: Color(hex: "6A6799"),
        primary: Color(hex: "5A57D6"),
        secondary: Color(hex: "FF7D4D"),
        tertiary: Color(hex: "00C9A7"),
        border: Color(hex: "C6CCEE").opacity(0.5)
    )
}

enum JopiTheme: String, Codable {
    case light
    case dark
    
    var palette: JopiPalette {
        switch self {
        case .light: return .cosmicLight
        case .dark: return .cosmicDark
        }
    }
}

struct JopiPaletteKey: EnvironmentKey {
    static let defaultValue: JopiPalette = .cosmicDark
}

extension EnvironmentValues {
    var jopiPalette: JopiPalette {
        get { self[JopiPaletteKey.self] }
        set { self[JopiPaletteKey.self] = newValue }
    }
}
