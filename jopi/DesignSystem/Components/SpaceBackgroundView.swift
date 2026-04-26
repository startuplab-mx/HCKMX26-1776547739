import SwiftUI

struct SpaceBackgroundView: View {
    @State private var startAnimating = false
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Fondo Base
                pal.bg.ignoresSafeArea()
                
                // Nebulosas Procedurales Suaves
                ZStack {
                    Circle()
                        .fill(pal.primary.opacity(0.12))
                        .frame(width: 500, height: 500)
                        .blur(radius: 100)
                        .offset(x: -180, y: -250)

                    Circle()
                        .fill(pal.secondary.opacity(0.1))
                        .frame(width: 400, height: 400)
                        .blur(radius: 80)
                        .offset(x: 180, y: 300)
                }
                .allowsHitTesting(false)
                .scaleEffect(startAnimating ? 1.05 : 0.95)
                .opacity(startAnimating ? 0.6 : 0.3)

                // Capas de Estrellas con diferentes profundidades
                ZStack {
                    // Capa 1: Estrellas lejanas y pequeñas (estáticas/lentas)
                    ForEach(0..<40, id: \.self) { _ in
                        StarLayer(screenSize: geo.size, baseSize: 1, baseOpacity: 0.2, pulseDuration: 5...8)
                    }
                    
                    // Capa 2: Estrellas medianas (twinkle moderado)
                    ForEach(0..<20, id: \.self) { _ in
                        StarLayer(screenSize: geo.size, baseSize: 1.5, baseOpacity: 0.3, pulseDuration: 3...6)
                    }
                    
                    // Capa 3: Estrellas brillantes (twinkle activo)
                    ForEach(0..<8, id: \.self) { _ in
                        StarLayer(screenSize: geo.size, baseSize: 2.2, baseOpacity: 0.4, pulseDuration: 2...4)
                    }
                }
                .allowsHitTesting(false)
                
                // Planetas lejanos (más sutiles)
                ZStack {
                    DistantPlanetView(color: .purple, size: 80, x: -140, y: 280)
                    DistantPlanetView(color: .orange, size: 50, x: 160, y: -320)
                }
                .allowsHitTesting(false)
                .opacity(0.6)
            }
        }
        .clipped()
        .onAppear {
            withAnimation(.easeInOut(duration: 12).repeatForever(autoreverses: true)) {
                startAnimating = true
            }
        }
    }
}

struct StarLayer: View {
    let screenSize: CGSize
    let baseSize: CGFloat
    let baseOpacity: Double
    let pulseDuration: ClosedRange<Double>
    
    @State private var currentOpacity: Double
    @State private var position: CGPoint = .zero
    @State private var scale: CGFloat = 1.0
    
    init(screenSize: CGSize, baseSize: CGFloat, baseOpacity: Double, pulseDuration: ClosedRange<Double>) {
        self.screenSize = screenSize
        self.baseSize = baseSize
        self.baseOpacity = baseOpacity
        self.pulseDuration = pulseDuration
        self._currentOpacity = State(initialValue: baseOpacity)
    }
    
    var body: some View {
        Circle()
            .fill(.white)
            .frame(width: baseSize, height: baseSize)
            .position(position)
            .opacity(currentOpacity)
            .scaleEffect(scale)
            .onAppear {
                position = CGPoint(
                    x: CGFloat.random(in: 0...screenSize.width),
                    y: CGFloat.random(in: 0...screenSize.height)
                )
                
                // Twinkle sutil e irregular
                withAnimation(.easeInOut(duration: Double.random(in: pulseDuration)).repeatForever(autoreverses: true)) {
                    currentOpacity = baseOpacity * Double.random(in: 0.3...1.8)
                    scale = CGFloat.random(in: 0.8...1.2)
                }
            }
    }
}

struct DistantPlanetView: View {
    let color: Color
    let size: CGFloat
    let x: CGFloat
    let y: CGFloat
    @State private var rotation: Double = 0
    
    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [color.opacity(0.6), color.opacity(0.2)], startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(width: size, height: size)
            
            Ellipse()
                .stroke(color.opacity(0.2), lineWidth: 1)
                .frame(width: size * 2.0, height: size * 0.3)
                .rotationEffect(.degrees(25))
        }
        .blur(radius: 0.5)
        .offset(x: x, y: y)
        .rotationEffect(.degrees(rotation))
        .onAppear {
            withAnimation(.linear(duration: 100).repeatForever(autoreverses: false)) {
                rotation = 360
            }
        }
    }
}
