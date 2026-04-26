import SwiftUI

// MARK: - Orbit Background Elements
struct OrbitDecoration: View {
    var body: some View {
        GeometryReader { _ in
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.05), lineWidth: 1)
                    .frame(width: 600, height: 600)
                    .offset(x: 100, y: -100)
                
                Circle()
                    .stroke(Color.white.opacity(0.05), lineWidth: 1)
                    .frame(width: 400, height: 400)
                    .offset(x: -100, y: 100)
            }
        }
        .allowsHitTesting(false)
        .clipped() 
    }
}

// MARK: - Navigation Header (Organic Lumina Style)
struct TopMissionBar: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                // Perfil Orgánico
                HStack(spacing: 12) {
                    ZStack {
                        Circle()
                            .fill(pal.surface)
                            .frame(width: 44, height: 44)
                        
                        AvatarView(state: AvatarState(), size: 40)
                            .clipShape(Circle())
                    }
                    .overlay(Circle().stroke(pal.primary.opacity(0.3), lineWidth: 1.5))
                    
                    VStack(alignment: .leading, spacing: 0) {
                        Text("JOPI")
                            .font(.system(size: 18, weight: .black, design: .rounded))
                            .kerning(1)
                            .foregroundColor(pal.text)
                        Text("Tu Base Espacial")
                            .font(.system(size: 10, weight: .bold, design: .rounded))
                            .foregroundColor(pal.primary)
                    }
                }
                
                Spacer()
                
                // Píldora de Estado Orgánica
                HStack(spacing: 8) {
                    Circle()
                        .fill(pal.tertiary)
                        .frame(width: 8, height: 8)
                        .shadow(color: pal.tertiary, radius: 4)
                    
                    Text("¡Conectado!")
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundColor(pal.text)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(.ultraThinMaterial)
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white.opacity(0.1), lineWidth: 1))
            }
            .padding(.horizontal, 24)
            .padding(.top, 12)
            .padding(.bottom, 20)
            
            // Línea de separación orgánica (difuminada)
            Rectangle()
                .fill(
                    LinearGradient(colors: [.clear, pal.border, .clear], startPoint: .leading, endPoint: .trailing)
                )
                .frame(height: 1.5)
        }
        .background(pal.bg.opacity(0.6))
        .background(.ultraThinMaterial)
    }
}

// MARK: - Bento Circle Progress HUD
struct BentoOrbitProgress: View {
    var progress: Double
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        JopiCard(padding: 20) {
            VStack(spacing: 12) {
                Text("Tu Energía")
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .foregroundColor(pal.tertiary)
                
                ZStack {
                    Circle()
                        .stroke(Color.white.opacity(0.08), lineWidth: 4)
                        .frame(width: 100, height: 100)
                    
                    Circle()
                        .trim(from: 0, to: CGFloat(progress))
                        .stroke(
                            pal.tertiary,
                            style: StrokeStyle(lineWidth: 8, lineCap: .round)
                        )
                        .frame(width: 100, height: 100)
                        .rotationEffect(.degrees(-90))
                        .shadow(color: pal.tertiary.opacity(0.3), radius: 5)
                    
                    VStack {
                        Text("\(Int(progress * 100))%")
                            .font(.system(size: 22, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                        Text("GASOLINA")
                            .font(.system(size: 8, weight: .black))
                            .opacity(0.6)
                            .kerning(1)
                    }
                }
            }
            .frame(maxWidth: .infinity)
        }
    }
}
