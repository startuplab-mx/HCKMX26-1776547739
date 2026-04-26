import SwiftUI

struct SocialProfileView: View {
    let username: String
    let rank: String
    let xp: Int
    let streak: Int
    let avatarState: AvatarState
    
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(pal.textMuted.opacity(0.5))
                    }
                    Spacer()
                }
                .padding(24)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        // Avatar Section
                        VStack(spacing: 20) {
                            ZStack {
                                Circle()
                                    .fill(pal.card.opacity(0.8))
                                    .frame(width: 160, height: 160)
                                    .shadow(color: pal.primary.opacity(0.2), radius: 20)
                                
                                AvatarView(state: avatarState, size: 140)
                                    .clipShape(Circle())
                            }
                            
                            VStack(spacing: 8) {
                                Text("@\(username)")
                                    .font(.system(size: 28, weight: .black, design: .rounded))
                                    .foregroundColor(pal.text)
                                
                                Text(rank)
                                    .font(.system(size: 14, weight: .black, design: .rounded))
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 6)
                                    .background(pal.primary.opacity(0.2))
                                    .foregroundColor(pal.primary)
                                    .cornerRadius(12)
                            }
                        }
                        
                        // Stats Grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 20) {
                            statBox(title: "Racha", value: "\(streak)d", icon: "wind", color: .cyan)
                            statBox(title: "Energía", value: "\(xp)", icon: "bolt.fill", color: .yellow)
                        }
                        
                        // Conquered Planets Section
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Planetas Conquistados")
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)
                            
                            HStack(spacing: 16) {
                                planetBadge(name: "Tierra", color: .blue)
                                planetBadge(name: "Lumina", color: .purple)
                                Spacer()
                            }
                        }
                        
                        // Friend Action
                        JStack {
                            VStack(spacing: 16) {
                                Text("¿Quieres ser su aliado?")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.text)
                                
                                SpaceLaunchButton(title: "Enviar Reto") { }
                            }
                        }
                        
                        Spacer(minLength: 100)
                    }
                    .padding(24)
                }
            }
        }
    }
    
    private func statBox(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
            Text(value)
                .font(.system(size: 24, weight: .black, design: .rounded))
                .foregroundColor(pal.text)
            Text(title)
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundColor(pal.textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(20)
        .background(pal.card)
        .cornerRadius(24)
        .overlay(RoundedRectangle(cornerRadius: 24).stroke(pal.border, lineWidth: 1))
    }
    
    private func planetBadge(name: String, color: Color) -> some View {
        VStack(spacing: 8) {
            PlanetArtView(size: 50, color: color)
            Text(name)
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundColor(pal.text)
        }
    }
}
