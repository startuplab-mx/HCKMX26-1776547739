import SwiftUI

struct ProfileView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        NavigationStack {
            ZStack {
                SpaceBackgroundView()
                OrbitDecoration()
                
                VStack(spacing: 0) {
                    // HEADER ORGÁNICO
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Centro de Comando")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(pal.tertiary)
                        
                        Text("Tu Base")
                            .font(.system(size: 36, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 24)
                    .padding(.top, 20)
                    .padding(.bottom, 20)
                    
                    ScrollView(showsIndicators: false) {
                        VStack(spacing: 32) {
                            
                            // AVATAR & RANGO PRINCIPAL
                            VStack(spacing: 24) {
                                NavigationLink(destination: AvatarEditorView()) {
                                    ZStack {
                                        Circle()
                                            .fill(pal.card.opacity(0.8))
                                            .frame(width: 170, height: 160)
                                            .blur(radius: 20)
                                        
                                        AvatarView(state: user.avatar, size: 140)
                                            .scaleEffect(1.1)
                                        
                                        Image(systemName: "tshirt.fill")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.white)
                                            .padding(10)
                                            .background(pal.primary)
                                            .clipShape(Circle())
                                            .offset(x: 50, y: 50)
                                            .shadow(color: pal.primary.opacity(0.5), radius: 10)
                                    }
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                VStack(spacing: 12) {
                                    Text("@\(user.username)")
                                        .font(.system(size: 28, weight: .black, design: .rounded))
                                        .foregroundColor(pal.text)
                                    
                                    HStack(spacing: 12) {
                                        Text(user.currentLevel.emoji)
                                            .font(.system(size: 20))
                                        Text(user.currentLevel.name)
                                            .font(.system(size: 14, weight: .black, design: .rounded))
                                            .foregroundColor(.white)
                                    }
                                    .padding(.horizontal, 24)
                                    .padding(.vertical, 10)
                                    .background(
                                        LinearGradient(colors: [pal.primary, pal.primary.opacity(0.8)], startPoint: .leading, endPoint: .trailing)
                                    )
                                    .cornerRadius(24)
                                    .shadow(color: pal.primary.opacity(0.3), radius: 10)
                                }
                            }
                            
                            // STATS DINÁMICAS
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                                profileStat(title: "Racha", value: "\(user.streak)", unit: "Días", icon: "flame.fill", color: .orange)
                                profileStat(title: "Rango", value: "\(user.levelIdx + 1)", unit: "Nivel", icon: "trophy.fill", color: .yellow)
                                profileStat(title: "Energía", value: "\(user.xp)", unit: "XP", icon: "bolt.fill", color: .cyan)
                            }
                            
                            // SECCIÓN: TUS MEDALLAS
                            VStack(alignment: .leading, spacing: 16) {
                                HStack {
                                    Text("Tus Medallas")
                                        .font(.system(size: 16, weight: .bold, design: .rounded))
                                        .foregroundColor(pal.primary)
                                    Spacer()
                                    Text("\(user.earnedBadgeIds.count)/\(Badge.allBadges.count)")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(pal.tertiary)
                                }
                                .padding(.horizontal, 4)
                                
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 16) {
                                        ForEach(Badge.allBadges) { badge in
                                            let isEarned = user.earnedBadgeIds.contains(badge.id)
                                            VStack(spacing: 10) {
                                                ZStack {
                                                    Circle()
                                                        .fill(isEarned ? badge.color.opacity(0.2) : Color.gray.opacity(0.1))
                                                        .frame(width: 64, height: 64)
                                                    
                                                    Image(systemName: badge.icon)
                                                        .font(.system(size: 24))
                                                        .foregroundColor(isEarned ? badge.color : .gray.opacity(0.4))
                                                }
                                                .background(
                                                    Circle()
                                                        .stroke(isEarned ? badge.color : Color.clear, lineWidth: 2)
                                                )
                                                
                                                Text(badge.title)
                                                    .font(.system(size: 11, weight: .bold, design: .rounded))
                                                    .foregroundColor(isEarned ? pal.text : pal.textMuted.opacity(0.5))
                                                    .lineLimit(1)
                                            }
                                            .frame(width: 80)
                                            .opacity(isEarned ? 1 : 0.6)
                                        }
                                    }
                                }
                            }

                            // SECCIONES DE CONFIGURACIÓN
                            VStack(alignment: .leading, spacing: 20) {
                                Text("Equipo de Vuelo")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.primary)
                                    .padding(.leading, 4)
                                
                                VStack(spacing: 0) {
                                    NavigationLink(destination: AvatarEditorView()) {
                                        profileRow(title: "Vestidor Espacial", icon: "tshirt.fill", color: .purple)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                    
                                    NavigationLink(destination: WalletView()) {
                                        profileRow(title: "Tus Chispas ✨", icon: "bolt.circle.fill", color: .orange)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                                .background(pal.card.opacity(0.8))
                                .cornerRadius(32)
                                .overlay(RoundedRectangle(cornerRadius: 32).stroke(pal.border.opacity(0.2), lineWidth: 1.5))
                            }
                            
                            VStack(alignment: .leading, spacing: 20) {
                                Text("Ajustes de Nave")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.primary)
                                    .padding(.leading, 4)
                                
                                VStack(spacing: 0) {
                                    HStack(spacing: 16) {
                                        Image(systemName: user.currentTheme == .dark ? "moon.stars.fill" : "sun.max.fill")
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(pal.secondary)
                                            .frame(width: 44, height: 44)
                                            .background(pal.secondary.opacity(0.15))
                                            .cornerRadius(12)
                                        
                                        Text("Modo: \(user.currentTheme == .dark ? "Espacio" : "Día")")
                                            .font(.system(size: 17, weight: .bold, design: .rounded))
                                            .foregroundColor(pal.text)
                                        
                                        Spacer()
                                        
                                        Toggle("", isOn: Binding(
                                            get: { user.currentTheme == .light },
                                            set: { newValue in
                                                HapticManager.shared.play(.medium)
                                                withAnimation(.spring()) {
                                                    user.currentTheme = newValue ? .light : .dark
                                                }
                                            }
                                        ))
                                        .labelsHidden()
                                        .tint(pal.primary)
                                    }
                                    .padding(20)
                                    
                                    Divider().padding(.leading, 70).background(pal.border.opacity(0.2))

                                    // Music Toggle Row
                                    HStack(spacing: 16) {
                                        Image(systemName: user.isMusicEnabled ? "speaker.wave.3.fill" : "speaker.slash.fill")
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(.cyan)
                                            .frame(width: 44, height: 44)
                                            .background(Color.cyan.opacity(0.15))
                                            .cornerRadius(12)
                                        
                                        Text("Música de Ambiente")
                                            .font(.system(size: 17, weight: .bold, design: .rounded))
                                            .foregroundColor(pal.text)
                                        
                                        Spacer()
                                        
                                        Toggle("", isOn: Bindable(user).isMusicEnabled)
                                            .labelsHidden()
                                            .tint(pal.primary)
                                    }
                                    .padding(20)
                                    
                                    Divider().padding(.leading, 70).background(pal.border.opacity(0.2))
                                    
                                    profileRow(title: "Notificaciones", icon: "bell.fill", color: .red)
                                    profileRow(title: "Soporte Técnico", icon: "terminal.fill", color: .green)
                                    
                                    Button { 
                                        HapticManager.shared.notification(.warning)
                                        withAnimation {
                                            user.logout()
                                        }
                                    } label: {
                                        HStack {
                                            Text("Cerrar Sesión")
                                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                            Spacer()
                                            Image(systemName: "xmark.octagon.fill")
                                                .font(.system(size: 18))
                                        }
                                        .foregroundColor(.red.opacity(0.8))
                                        .padding(20)
                                    }
                                }
                                .background(pal.card.opacity(0.8))
                                .cornerRadius(32)
                                .overlay(RoundedRectangle(cornerRadius: 32).stroke(pal.border.opacity(0.2), lineWidth: 1.5))
                            }
                            
                            Spacer(minLength: 120)
                        }
                        .padding(.horizontal, 24)
                    }
                }
            }
        }
    }
    
    private func profileStat(title: String, value: String, unit: String, icon: String, color: Color) -> some View {
        JopiCard(padding: 16) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(color)
                Text(value)
                    .font(.system(size: 22, weight: .black, design: .rounded))
                    .foregroundColor(pal.text)
                Text(unit)
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .foregroundColor(pal.textMuted)
            }
            .frame(maxWidth: .infinity)
        }
    }
    
    private func profileRow(title: String, icon: String, color: Color) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(color)
                    .frame(width: 44, height: 44)
                    .background(color.opacity(0.15))
                    .cornerRadius(12)
                
                Text(title)
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .foregroundColor(pal.text)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(pal.textMuted)
            }
            .padding(20)
            
            Divider().padding(.leading, 70).background(pal.border.opacity(0.2))
        }
    }
}
