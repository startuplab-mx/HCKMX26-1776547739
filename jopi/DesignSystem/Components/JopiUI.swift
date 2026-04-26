import SwiftUI

// MARK: - Rocket Shape
struct RocketShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.width
        let height = rect.height
        
        path.move(to: CGPoint(x: width * 0.5, y: 0))
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: height * 0.8),
            control1: CGPoint(x: width * 0.9, y: height * 0.2),
            control2: CGPoint(x: width * 0.9, y: height * 0.6)
        )
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: 0),
            control1: CGPoint(x: width * 0.1, y: height * 0.6),
            control2: CGPoint(x: width * 0.1, y: height * 0.2)
        )
        
        path.move(to: CGPoint(x: width * 0.35, y: height * 0.6))
        path.addLine(to: CGPoint(x: width * 0.1, y: height * 0.85))
        path.addLine(to: CGPoint(x: width * 0.35, y: height * 0.8))
        
        path.move(to: CGPoint(x: width * 0.65, y: height * 0.6))
        path.addLine(to: CGPoint(x: width * 0.9, y: height * 0.85))
        path.addLine(to: CGPoint(x: width * 0.65, y: height * 0.8))
        
        return path
    }
}

// MARK: - Pattern Decorativo
struct SpacePattern: View {
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        Canvas { context, size in
            let step: CGFloat = 30
            for x in stride(from: 0, to: size.width, by: step) {
                for y in stride(from: 0, to: size.height, by: step) {
                    context.stroke(
                        Path(CGRect(x: x, y: y, width: 2, height: 2)),
                        with: .color(pal.primary.opacity(0.1)),
                        lineWidth: 1
                    )
                }
            }
            
            var path = Path()
            path.move(to: CGPoint(x: 0, y: size.height * 0.7))
            path.addLine(to: CGPoint(x: size.width * 0.2, y: size.height * 0.7))
            path.addLine(to: CGPoint(x: size.width * 0.3, y: size.height * 0.9))
            
            context.stroke(path, with: .color(pal.primary.opacity(0.15)), lineWidth: 1)
        }
        .allowsHitTesting(false)
    }
}

// MARK: - Refined JopiCard
struct JopiCard<Content: View>: View {
    @Environment(\.jopiPalette) var pal
    let content: Content
    var padding: CGFloat = 20
    
    init(padding: CGFloat = 20, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 32)
                .fill(pal.card.opacity(0.8))
                .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
            
            content
                .padding(padding)
        }
        .clipped()
        .cornerRadius(32)
        .overlay(
            RoundedRectangle(cornerRadius: 32)
                .stroke(pal.border.opacity(0.2), lineWidth: 1.5)
        )
    }
}

// MARK: - Squishy Button Style
struct SquishyButtonStyle: ButtonStyle {
    let baseColor: Color
    let depth: CGFloat
    let cornerRadius: CGFloat
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(
                ZStack {
                    // Shadow depth
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(baseColor.opacity(0.3))
                        .offset(y: configuration.isPressed ? 0 : depth)
                    
                    // Main button surface
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(baseColor)
                        .offset(y: configuration.isPressed ? depth : 0)
                }
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { oldValue, newValue in
                if newValue {
                    HapticManager.shared.pop()
                    AudioManager.shared.play(.pop)
                }
            }    }
}

// MARK: - Space Launch Button
struct SpaceLaunchButton: View {
    let title: String
    var isEnabled: Bool = true
    let action: () -> Void
    
    @Environment(\.jopiPalette) var pal
    @State private var isAnimating = false
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 15) {
                Text(title)
                    .font(.system(size: 20, weight: .black, design: .rounded))
                
                RocketShape()
                    .fill(pal.bg)
                    .frame(width: 20, height: 25)
                    .offset(y: isAnimating ? -3 : 3)
            }
            .foregroundColor(pal.bg)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .opacity(isEnabled ? 1.0 : 0.4)
        }
        .buttonStyle(SquishyButtonStyle(
            baseColor: isEnabled ? pal.primary : Color.gray,
            depth: 6,
            cornerRadius: 24
        ))
        .disabled(!isEnabled)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
        }
    }
}

// MARK: - Standard Jopi Button
struct JopiButton: View {
    let title: String
    var icon: String? = nil
    var style: JopiButtonStyle = .primary
    var size: JopiButtonSize = .large
    let action: () -> Void
    
    @Environment(\.jopiPalette) var pal
    
    enum JopiButtonStyle { case primary, secondary, outline, danger }
    enum JopiButtonSize {
        case small, large
        var padding: CGFloat { self == .small ? 14 : 20 }
        var fontSize: CGFloat { self == .small ? 15 : 18 }
    }
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                if let icon = icon { Image(systemName: icon).font(.system(size: size.fontSize, weight: .bold)) }
                Text(title).font(.system(size: size.fontSize, weight: .black, design: .rounded))
            }
            .frame(maxWidth: size == .large ? .infinity : nil)
            .padding(.vertical, size.padding)
            .padding(.horizontal, size == .small ? 24 : 0)
            .foregroundColor(pal.bg)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(style == .outline ? pal.primary.opacity(0.3) : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(SquishyButtonStyle(
            baseColor: buttonColor,
            depth: 4,
            cornerRadius: 20
        ))
    }
    
    private var buttonColor: Color {
        switch style {
        case .primary: return pal.primary
        case .secondary: return pal.secondary
        case .danger: return Color.red
        case .outline: return Color.clear
        }
    }
}

struct JopiProgressBar: View {
    var progress: Double; var color: Color; var showLabel: Bool = false
    var body: some View {
        VStack(alignment: .trailing, spacing: 6) {
            if showLabel { Text("\(Int(progress * 100))%").font(.system(size: 12, weight: .black, design: .monospaced)).foregroundColor(color) }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(color.opacity(0.1))
                    Capsule().fill(LinearGradient(colors: [color, color.opacity(0.8)], startPoint: .leading, endPoint: .trailing)).frame(width: geo.size.width * CGFloat(progress))
                }
            }.frame(height: 10)
        }
    }
}

struct JStack<Content: View>: View {
    @Environment(\.jopiPalette) var pal
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        content
            .padding(24)
            .background(pal.card.opacity(0.8))
            .clipped()
            .cornerRadius(24)
            .overlay(RoundedRectangle(cornerRadius: 24).stroke(pal.border, lineWidth: 1))
    }
}
