import SwiftUI

extension Color {
    struct Jopi {
        // Fondos de Galaxia Suave
        static let spaceBlack = Color(hex: "1A1635") // Deep Purple Night
        static let deepNavy = Color(hex: "25204E") // Softer Indigo
        
        // Acentos Pastel
        static let nebulaBlue = Color(hex: "8B88FF") // Periwinkle
        static let solarOrange = Color(hex: "FF9F7A") // Peach
        static let starWhite = Color(hex: "FDFDFF")
        
        static var primary: Color { nebulaBlue }
        static var secondary: Color { solarOrange }
        
        static var background: Color { spaceBlack }
        static var card: Color { deepNavy }
    }
}
