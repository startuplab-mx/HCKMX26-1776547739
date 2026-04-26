import SwiftUI

struct PlanetConquestView: View {
    let planet: Planet
    var onContinue: () -> Void
    
    @Environment(\.jopiPalette) var pal
    @State private var showPlanet = false
    @State private var showTitle = false
    @State private var showButton = false
    @State private var rotation: Double = 0
    
    var body: some View {
        ZStack {
            // Fondo de celebración
            pal.bg.ignoresSafeArea()
            
            SpaceBackgroundView()
                .opacity(0.6)
            
            VStack(spacing: 40) {
                if showTitle {
                    VStack(spacing: 12) {
                        Text("¡PLANETA CONQUISTADO!")
                            .font(.system(size: 16, weight: .black, design: .rounded))
                            .foregroundColor(pal.tertiary)
                            .kerning(2)
                        
                        Text(planet.name)
                            .font(.system(size: 44, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                            .multilineTextAlignment(.center)
                    }
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
                
                ZStack {
                    // Brillo del planeta
                    Circle()
                        .fill(planet.color.opacity(0.3))
                        .frame(width: 250, height: 250)
                        .blur(radius: 40)
                        .scaleEffect(showPlanet ? 1.2 : 0.5)
                    
                    if showPlanet {
                        ZStack {
                            // El Planeta
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [planet.color, planet.color.opacity(0.5)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 200, height: 200)
                                .shadow(color: planet.color.opacity(0.5), radius: 30)
                            
                            // Textura / Icono
                            Image(systemName: planet.icon)
                                .font(.system(size: 80))
                                .foregroundColor(pal.text.opacity(0.3))
                                .rotationEffect(.degrees(rotation))
                            
                            // Anillo (opcional para algunos planetas)
                            Ellipse()
                                .stroke(pal.text.opacity(0.2), lineWidth: 4)
                                .frame(width: 300, height: 80)
                                .rotationEffect(.degrees(20))
                        }
                        .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.vertical, 40)
                
                if showButton {
                    VStack(spacing: 20) {
                        Text("Has expandido tu imperio Jopi.")
                            .font(.system(size: 18, weight: .medium, design: .rounded))
                            .foregroundColor(pal.text.opacity(0.8))
                        
                        SpaceLaunchButton(title: "¡Hacia el infinito!") {
                            onContinue()
                        }
                        .padding(.horizontal, 40)
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
        .onAppear {
            AudioManager.shared.play(.fanfare)
            HapticManager.shared.play(.heavy)
            
            withAnimation(.spring(response: 0.8, dampingFraction: 0.7).delay(0.3)) {
                showTitle = true
            }
            
            withAnimation(.spring(response: 1.0, dampingFraction: 0.6).delay(0.8)) {
                showPlanet = true
            }
            
            withAnimation(.linear(duration: 20).repeatForever(autoreverses: false)) {
                rotation = 360
            }
            
            withAnimation(.spring().delay(1.5)) {
                showButton = true
            }
        }
    }
}

#Preview {
    PlanetConquestView(planet: Planet(name: "Astra Prime", color: .purple, icon: "sparkles")) {
        print("Continuar")
    }
    .environment(\.jopiPalette, .cosmicDark)
}
