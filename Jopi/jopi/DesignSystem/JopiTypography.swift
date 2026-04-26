import SwiftUI

struct JopiTypography {
    @Environment(\.jopiPalette) var pal
    
    // Títulos y Números
    static func h1(_ text: String, color: Color? = nil) -> some View {
        Text(text)
            .font(.system(size: 36, weight: .black, design: .rounded))
            .foregroundColor(color ?? Color(UIColor.label))
            .kerning(-0.5)
    }
    
    static func h2(_ text: String, color: Color? = nil) -> some View {
        Text(text)
            .font(.system(size: 26, weight: .bold, design: .rounded))
            .foregroundColor(color ?? Color(UIColor.label))
    }
    
    static func fichaBalance(_ amount: Int, pal: JopiPalette) -> some View {
        Text("\(amount)")
            .font(.system(size: 44, weight: .black, design: .rounded))
            .foregroundColor(pal.secondary)
    }
    
    // Cuerpo de texto
    static func body(_ text: String, color: Color? = nil) -> some View {
        Text(text)
            .font(.system(size: 17, weight: .medium, design: .rounded))
            .foregroundColor(color ?? Color(UIColor.label))
            .lineSpacing(4)
    }
    
    static func subheadline(_ text: String, color: Color? = nil) -> some View {
        Text(text)
            .font(.system(size: 15, weight: .bold, design: .rounded))
            .foregroundColor(color ?? Color(UIColor.secondaryLabel))
    }
    
    static func caption(_ text: String, color: Color? = nil) -> some View {
        Text(text)
            .font(.system(size: 14, weight: .bold, design: .rounded))
            .foregroundColor(color ?? Color(UIColor.secondaryLabel))
            .kerning(0.5)
    }
}
