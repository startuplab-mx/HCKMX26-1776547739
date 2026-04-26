import SwiftUI

struct LevelUpView: View {
    let level: Level
    @Environment(\.dismiss) var dismiss
    @Environment(\.jopiPalette) var pal
    @Environment(JopiUserData.self) var user
    
    @State private var showContent = false
    
    var body: some View {
        ZStack {
            pal.bg.ignoresSafeArea()
            SpaceBackgroundView()
            
            ConfettiView(colors: [pal.primary, .yellow, .white, .cyan])
                .allowsHitTesting(false)
            
            VStack(spacing: 30) {
                Spacer()
                
                // HEADER CELEBRATION
                VStack(spacing: 12) {
                    Text("¡NUEVO RANGO ALCANZADO!")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .foregroundColor(pal.tertiary)
                        .kerning(2)
                    
                    Text(level.name.uppercased())
                        .font(.system(size: 54, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                        .shadow(color: pal.primary.opacity(0.5), radius: 20)
                }
                .scaleEffect(showContent ? 1 : 0.5)
                .opacity(showContent ? 1 : 0)
                
                // AVATAR CELEBRATION
                ZStack {
                    Circle()
                        .fill(pal.primary.opacity(0.2))
                        .frame(width: 260, height: 260)
                        .blur(radius: 30)
                    
                    AvatarView(state: user.avatar, size: 220)
                        .scaleEffect(showContent ? 1.1 : 0.8)
                        .rotationEffect(.degrees(showContent ? 0 : -15))
                    
                    Text(level.emoji)
                        .font(.system(size: 80))
                        .offset(x: 80, y: -80)
                        .scaleEffect(showContent ? 1 : 0)
                }
                
                // REWARDS / STATS
                VStack(spacing: 20) {
                    Text("Has desbloqueado nuevas misiones y objetos en la tienda galáctica.")
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .foregroundColor(pal.text.opacity(0.8))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                    
                    HStack(spacing: 25) {
                        rewardPill(icon: "bolt.fill", value: "+50", label: "Chispas")
                        rewardPill(icon: "star.fill", value: "MAX", label: "Energía")
                    }
                }
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 30)
                
                Spacer()
                
                // ACTION
                Button(action: {
                    HapticManager.shared.play(.medium)
                    dismiss()
                }) {
                    Text("CONTINUAR AVENTURA")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(pal.bg)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 22)
                        .background(pal.primary)
                        .cornerRadius(24)
                        .shadow(color: pal.primary.opacity(0.4), radius: 15)
                }
                .padding(.horizontal, 40)
                .padding(.bottom, 40)
            }
        }
        .onAppear {
            AudioManager.shared.play(.success)
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7, blendDuration: 0)) {
                showContent = true
            }
            
            // Recompensa por subir nivel
            user.chips += 50
        }
    }
    
    private func rewardPill(icon: String, value: String, label: String) -> some View {
        VStack(spacing: 4) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .foregroundColor(.yellow)
                Text(value)
                    .font(.system(size: 20, weight: .black, design: .rounded))
                    .foregroundColor(pal.text)
            }
            Text(label)
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundColor(pal.textMuted)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(pal.text.opacity(0.1))
        .cornerRadius(16)
    }
}
