import SwiftUI

struct CommunityView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    
    @State private var selectedUser: UserRank? = nil
    @State private var selection = 0
    @State private var searchText = ""
    
    @State private var leaderboard: [UserRank] = []
    @State private var isLoading = true
    
    let availableMissions = [
        TeamMission(title: "🛰️ Mensaje Espacial", description: "Ayuda a conectar las estaciones de radio para ganar XP extra.", rewardXP: 500, currentMembers: 3, maxMembers: 5, icon: "antenna.radiowaves.left.and.right"),
        TeamMission(title: "🏗️ Base de Diversión", description: "Construye un nuevo módulo de recreación con tu equipo.", rewardXP: 800, currentMembers: 8, maxMembers: 10, icon: "house.fill"),
        TeamMission(title: "☄️ Lluvia de Ideas", description: "Analiza fragmentos de meteoritos en grupo.", rewardXP: 1200, currentMembers: 1, maxMembers: 3, icon: "sparkles")
    ]
    
    var filteredLeaderboard: [UserRank] {
        if searchText.isEmpty { return leaderboard }
        return leaderboard.filter { $0.name.lowercased().contains(searchText.lowercased()) }
    }
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            OrbitDecoration()
            
            VStack(spacing: 0) {
                // HEADER ORGÁNICO
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("¡Hola a todos!")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(pal.tertiary)
                        
                        Text("Mundo Jopi")
                            .font(.system(size: 36, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                    }
                    
                    // BUSCADOR
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(pal.textMuted)
                        TextField("Buscar exploradores...", text: $searchText)
                            .font(.system(size: 16, weight: .medium, design: .rounded))
                            .foregroundColor(pal.text)
                    }
                    .padding(14)
                    .background(pal.card.opacity(0.6))
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(pal.border.opacity(0.3), lineWidth: 1))
                    
                    // TABS
                    HStack(spacing: 8) {
                        tabBtn(title: "Ranking", isSelected: selection == 0) { selection = 0 }
                        tabBtn(title: "Misiones Juntos", isSelected: selection == 1) { selection = 1 }
                    }
                    .padding(6)
                    .background(pal.card.opacity(0.8))
                    .cornerRadius(24)
                }
                .padding(24)
                
                if isLoading && selection == 0 {
                    Spacer()
                    ProgressView().tint(pal.primary)
                    Spacer()
                } else {
                    ScrollView(showsIndicators: false) {
                        if selection == 0 {
                            leaderboardSection
                        } else {
                            challengesSection
                        }
                        
                        Spacer(minLength: 120)
                    }
                }
            }
        }
        .task {
            await fetchLeaderboard()
        }
        .sheet(item: $selectedUser) { userRank in
            SocialProfileView(
                username: userRank.name,
                rank: userRank.rank == 1 ? "Súper Explorador" : (userRank.rank < 4 ? "Capitán Jopi" : "Aprendiz"),
                xp: userRank.xp,
                streak: 45,
                avatarState: userRank.avatar
            )
            .environment(user)
            .environment(\.jopiPalette, pal)
        }
    }
    
    private func fetchLeaderboard() async {
        do {
            let fetched: [UserRank] = try await APIService.shared.fetch(endpoint: "/leaderboard")
            await MainActor.run {
                self.leaderboard = fetched
                self.isLoading = false
            }
        } catch {
            print("Error ranking: \(error)")
            // Fallback con Avatares inicializados correctamente
            await MainActor.run {
                self.leaderboard = [
                    UserRank(name: "astro_cat", xp: 12450, rank: 1, avatar: AvatarState()),
                    UserRank(name: "space_explorer", xp: 11200, rank: 2, avatar: AvatarState())
                ]
                self.isLoading = false
            }
        }
    }
    
    private var leaderboardSection: some View {
        VStack(spacing: 16) {
            ForEach(filteredLeaderboard) { userRank in
                Button {
                    selectedUser = userRank
                } label: {
                    leaderboardRow(userRank: userRank)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(.horizontal, 24)
    }
    
    private func leaderboardRow(userRank: UserRank) -> some View {
        HStack(spacing: 16) {
            ZStack {
                if userRank.rank <= 3 {
                    Text(userRank.rank == 1 ? "🥇" : (userRank.rank == 2 ? "🥈" : "🥉"))
                        .font(.system(size: 20))
                } else {
                    Text("\(userRank.rank)")
                        .font(.system(size: 16, weight: .black, design: .rounded))
                        .foregroundColor(pal.textMuted)
                }
            }
            .frame(width: 32)
            
            AvatarView(state: userRank.avatar, size: 50)
                .background(Circle().fill(pal.surface))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 2) {
                Text("@\(userRank.name)")
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .foregroundColor(pal.text)
                Text(userRank.rank == 1 ? "Súper Explorador" : (userRank.rank < 4 ? "Capitán Jopi" : "Aprendiz"))
                    .font(.system(size: 12, weight: .bold, design: .rounded))
                    .foregroundColor(pal.primary)
            }
            
            Spacer()
            
            HStack(spacing: 4) {
                Text("\(userRank.xp)")
                    .font(.system(size: 18, weight: .black, design: .rounded))
                Text("✨")
                    .font(.system(size: 14))
            }
            .foregroundColor(pal.secondary)
        }
        .padding(16)
        .background(pal.card.opacity(0.7))
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(userRank.rank == 1 ? pal.secondary.opacity(0.5) : pal.border.opacity(0.2), lineWidth: 1.5)
        )
    }
    
    private var challengesSection: some View {
        VStack(spacing: 24) {
            ForEach(availableMissions) { mission in
                let isJoined = user.joinedMissionIds.contains(mission.id)
                
                JopiCard(padding: 24) {
                    VStack(alignment: .leading, spacing: 20) {
                        HStack {
                            Text(mission.title)
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)
                            Spacer()
                            Text("+\(mission.rewardXP) ✨")
                                .font(.system(size: 14, weight: .black, design: .rounded))
                                .foregroundColor(pal.tertiary)
                        }
                        
                        Text(mission.description)
                            .font(.system(size: 16, weight: .medium, design: .rounded))
                            .foregroundColor(pal.text.opacity(0.9))
                        
                        HStack {
                            HStack(spacing: -15) {
                                ForEach(0..<mission.currentMembers + (isJoined ? 1 : 0), id: \.self) { _ in
                                    AvatarView(state: AvatarState(), size: 36)
                                        .background(Circle().fill(pal.surface))
                                        .clipShape(Circle())
                                        .overlay(Circle().stroke(pal.card, lineWidth: 2))
                                }
                            }
                            
                            Text("Equipo: \(mission.currentMembers + (isJoined ? 1 : 0))/\(mission.maxMembers)")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundColor(isJoined ? pal.primary : pal.textMuted)
                                .padding(.leading, 8)
                            
                            Spacer()
                            
                            Button(action: {
                                if !isJoined {
                                    withAnimation(.spring()) {
                                        user.joinMission(mission)
                                    }
                                }
                            }) {
                                Text(isJoined ? "Dentro" : "¡Unirse!")
                                    .font(.system(size: 14, weight: .black, design: .rounded))
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 10)
                                    .background(isJoined ? pal.primary.opacity(0.2) : pal.primary)
                                    .foregroundColor(isJoined ? pal.primary : .black)
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
            }
        }
        .padding(.horizontal, 24)
    }
    
    private func tabBtn(title: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            action()
        }) {
            Text(title)
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(isSelected ? pal.primary : Color.clear)
                .foregroundColor(isSelected ? .white : pal.textMuted)
                .cornerRadius(20)
        }
    }
}

struct UserRank: Identifiable, Codable {
    var id = UUID()
    let name: String
    let xp: Int
    let rank: Int
    let avatar: AvatarState
    
    enum CodingKeys: String, CodingKey {
        case name, xp, rank, avatar
    }
    
    init(name: String, xp: Int, rank: Int, avatar: AvatarState) {
        self.name = name
        self.xp = xp
        self.rank = rank
        self.avatar = avatar
    }
}
