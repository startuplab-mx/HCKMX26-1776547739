import SwiftUI

// MARK: - Satélite de Comunicaciones (SVG Procedural)
struct SatelliteView: View {
    var size: CGFloat
    var color: Color?
    @State private var rotateAntenna = false
    @Environment(\.jopiPalette) var pal
    
    init(size: CGFloat = 60, color: Color? = nil) {
        self.size = size
        self.color = color
    }
    
    var body: some View {
        Canvas { context, sz in
            let center = CGPoint(x: sz.width / 2, y: sz.height / 2)
            
            // Paneles Solares
            let panelWidth: CGFloat = sz.width * 0.3
            let panelHeight: CGFloat = sz.height * 0.2
            
            let panelColor = color ?? pal.tertiary
            
            context.fill(Path(CGRect(x: center.x - sz.width * 0.45, y: center.y - panelHeight / 2, width: panelWidth, height: panelHeight)), with: .color(panelColor.opacity(0.6)))
            context.fill(Path(CGRect(x: center.x + sz.width * 0.15, y: center.y - panelHeight / 2, width: panelWidth, height: panelHeight)), with: .color(panelColor.opacity(0.6)))
            
            // Cuerpo Central
            context.fill(Path(CGRect(x: center.x - sz.width * 0.15, y: center.y - sz.width * 0.25, width: sz.width * 0.3, height: sz.width * 0.5)), with: .color(.gray))
            
            // Antena
            var antenna = Path()
            antenna.move(to: CGPoint(x: center.x, y: center.y - sz.width * 0.25))
            antenna.addLine(to: CGPoint(x: center.x, y: center.y - sz.width * 0.4))
            context.stroke(antenna, with: .color(.white), lineWidth: 2)
        }
        .frame(width: size, height: size)
        .rotationEffect(.degrees(rotateAntenna ? 10 : -10))
        .onAppear {
            withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                rotateAntenna = true
            }
        }
    }
}

// MARK: - Planeta Detallado (SVG Procedural)
struct PlanetArtView: View {
    var size: CGFloat
    let color: Color
    var hasRings: Bool
    @State private var float = false
    
    init(size: CGFloat = 50, color: Color, hasRings: Bool = false) {
        self.size = size
        self.color = color
        self.hasRings = hasRings
    }
    
    var body: some View {
        ZStack {
            if hasRings {
                Ellipse()
                    .stroke(color.opacity(0.3), lineWidth: size * 0.08)
                    .frame(width: size * 2, height: size * 0.6)
                    .rotationEffect(.degrees(-20))
            }
            
            Circle()
                .fill(
                    RadialGradient(colors: [color.opacity(0.8), color], center: .topLeading, startRadius: size * 0.1, endRadius: size)
                )
                .frame(width: size, height: size)
                .overlay(
                    // Sombras de cráteres
                    Circle()
                        .stroke(Color.black.opacity(0.1), lineWidth: size * 0.2)
                        .blur(radius: size * 0.1)
                        .offset(x: size * 0.1, y: size * 0.1)
                        .clipShape(Circle())
                )
        }
        .offset(y: float ? -5 : 5)
        .onAppear {
            withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                float = true
            }
        }
    }
}

// MARK: - Agujero Negro (Efecto Visual AAA)
struct BlackHoleView: View {
    var size: CGFloat
    @State private var rotation: Double = 0
    @Environment(\.jopiPalette) var pal
    
    init(size: CGFloat = 150) {
        self.size = size
    }
    
    var body: some View {
        ZStack {
            // Disco de acreción
            ForEach(0..<3) { i in
                accretionDiskLayer(index: i)
            }
            
            // Horizonte de eventos
            Circle()
                .fill(.black)
                .frame(width: size * 0.53, height: size * 0.53)
                .shadow(color: pal.tertiary.opacity(0.8), radius: size * 0.13)
        }
        .onAppear {
            withAnimation(.linear(duration: 10).repeatForever(autoreverses: false)) {
                rotation = 360
            }
        }
    }
    
    @ViewBuilder
    private func accretionDiskLayer(index: Int) -> some View {
        let offset = CGFloat(index) * (size * 0.13)
        let layerSize = size + offset
        let layerRotation = rotation + Double(index * 45)
        let blurRadius = size * 0.06
        
        Circle()
            .fill(
                AngularGradient(
                    colors: [pal.primary.opacity(0), pal.tertiary.opacity(0.5), pal.primary.opacity(0)],
                    center: .center
                )
            )
            .frame(width: layerSize, height: layerSize)
            .rotationEffect(.degrees(layerRotation))
            .blur(radius: blurRadius)
    }
}
