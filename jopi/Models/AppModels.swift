import SwiftUI
import Observation

struct DailyQuest: Identifiable, Codable {
    let id: String
    let title: String
    let goal: Int
    var current: Int
    let rewardXP: Int
    let icon: String
    
    var isCompleted: Bool { current >= goal }
    var progress: Double { Double(current) / Double(goal) }
}

@Observable
class JopiUserData {
    // --- AUTHENTICATION ---
    var isAuthenticated: Bool = false
    var userId: String? {
        didSet { UserDefaults.standard.set(userId, forKey: "userId") }
    }
    
    var username: String = "explorador_jopi"
    var chips: Int = 100
    var xp: Int = 0
    var levelIdx: Int = 0
    var streak: Int = 1
    var lastLoginDate: Date = Date()
    var hasCompletedOnboarding: Bool = false
    var currentTheme: JopiTheme = .dark

    var isMusicEnabled: Bool {
        didSet {
            UserDefaults.standard.set(isMusicEnabled, forKey: "isMusicEnabled")
            if isMusicEnabled { AudioManager.shared.startBackgroundMusic() }
            else { AudioManager.shared.stopBackgroundMusic() }
        }
    }

    var dailyXP: Int = 0
    var dailyGoal: Int = 70
    var hearts: Int = 3
    
    var avatar = AvatarState()
    
    var dailyQuests: [DailyQuest] = [
        DailyQuest(id: "q1", title: "Aprende algo nuevo", goal: 1, current: 0, rewardXP: 50, icon: "play.fill"),
        DailyQuest(id: "q2", title: "Gana 100 de Energía", goal: 100, current: 0, rewardXP: 30, icon: "bolt.fill"),
        DailyQuest(id: "q3", title: "Explora la comunidad", goal: 1, current: 0, rewardXP: 20, icon: "person.2.fill")
    ]
    
    var earnedBadgeIds: Set<String> = [] {
        didSet {
            let array = Array(earnedBadgeIds)
            UserDefaults.standard.set(array, forKey: "earnedBadgeIds")
        }
    }
    
    var pendingLevelUp: Level? = nil
    var newlyEarnedBadge: Badge? = nil
    
    var purchasedItemIds: Set<String> = [] {
        didSet {
            let array = Array(purchasedItemIds)
            UserDefaults.standard.set(array, forKey: "purchasedItemIds")
        }
    }
    
    var alliedUserIds: Set<UUID> = []
    var joinedMissionIds: Set<UUID> = []
    
    var activeCourses: [Course] = []
    
    var conqueredPlanets: [Planet] = []
    
    let levels = [
        Level(name: "Recluta", minXP: 0, emoji: "🐣"),
        Level(name: "Aprendiz", minXP: 500, emoji: "🌱"),
        Level(name: "Explorador", minXP: 1000, emoji: "🛠️"),
        Level(name: "Especialista", minXP: 2500, emoji: "🚀"),
        Level(name: "Oficial", minXP: 5000, emoji: "🫡"),
        Level(name: "Comandante", minXP: 10000, emoji: "👑"),
        Level(name: "Leyenda", minXP: 25000, emoji: "🔥")
    ]
    
    var currentLevel: Level {
        levels[min(levelIdx, levels.count - 1)]
    }
    
    init() {
        self.isMusicEnabled = UserDefaults.standard.object(forKey: "isMusicEnabled") as? Bool ?? true
        self.hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")
        
        if let savedUid = UserDefaults.standard.string(forKey: "userId") {
            self.userId = savedUid
            self.isAuthenticated = true
            // Intentar cargar datos reales del servidor
            Task { await fetchRemoteProfile() }
        }
        
        // Carga local de emergencia
        self.username = UserDefaults.standard.string(forKey: "username") ?? "explorador_jopi"
        self.chips = UserDefaults.standard.integer(forKey: "chips") == 0 ? 100 : UserDefaults.standard.integer(forKey: "chips")
        
        let savedBadges = UserDefaults.standard.stringArray(forKey: "earnedBadgeIds") ?? []
        self.earnedBadgeIds = Set(savedBadges)
        
        checkStreak()
        if isMusicEnabled { AudioManager.shared.startBackgroundMusic() }
    }
    
    func fetchRemoteProfile() async {
        guard let uid = userId else { return }
        do {
            let profile: RemoteProfile = try await APIService.shared.fetch(endpoint: "/user/\(uid)")
            await MainActor.run {
                self.username = profile.username
                self.xp = profile.xp
                self.chips = profile.chips
                self.streak = profile.streak
                self.levelIdx = profile.levelIdx
                // Sincronizar medallas
                let badges = profile.userBadges?.compactMap { $0.badgeId } ?? []
                self.earnedBadgeIds = Set(badges)
                print("✅ Perfil sincronizado con la nube para @\(username)")
            }
        } catch {
            print("❌ Error cargando perfil remoto: \(error)")
        }
    }
    
    private func checkStreak() {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let lastLogin = calendar.startOfDay(for: lastLoginDate)
        let diff = calendar.dateComponents([.day], from: lastLogin, to: today).day ?? 0
        if diff >= 1 { dailyXP = 0 }
        if diff > 1 { streak = 0 }
        lastLoginDate = Date()
    }
    
    func addXP(_ amount: Int) {
        withAnimation {
            xp += amount
            dailyXP += amount
            if xp >= 1000 { earnBadge(id: "xp_1000") }
            if levelIdx < levels.count - 1 {
                let nextLevel = levels[levelIdx + 1]
                if xp >= nextLevel.minXP {
                    levelIdx += 1
                    pendingLevelUp = levels[levelIdx]
                    HapticManager.shared.notification(.success)
                }
            }
            syncStats()
        }
    }
    
    func earnBadge(id: String) {
        if !earnedBadgeIds.contains(id) {
            earnedBadgeIds.insert(id)
            if let badge = Badge.allBadges.first(where: { $0.id == id }) {
                self.newlyEarnedBadge = badge
            }
            // Aquí enviaríamos al backend la nueva medalla
        }
    }
    
    func purchase(_ item: StoreItem) -> Bool {
        if canAfford(item.price) && !purchasedItemIds.contains(item.id) {
            chips -= item.price
            purchasedItemIds.insert(item.id)
            syncStats()
            return true
        }
        return false
    }
    
    func joinMission(_ mission: TeamMission) {
        if !joinedMissionIds.contains(mission.id) {
            joinedMissionIds.insert(mission.id)
            Task {
                try? await APIService.shared.send(endpoint: "/missions/\(mission.id)/join", body: ["user_id": userId ?? ""])
            }
        }
    }
    
    func canAfford(_ amount: Int) -> Bool { chips >= amount }

    func syncStats() {
        guard isAuthenticated, let uid = userId else { return }
        Task {
            let stats = ["xp": xp, "chips": chips, "streak": streak, "level_idx": levelIdx]
            try? await APIService.shared.send(endpoint: "/user/\(uid)/stats", body: stats)
        }
    }
    
    func completeLogin(id: String, name: String) {
        self.userId = id
        self.username = name
        self.isAuthenticated = true
        UserDefaults.standard.set(name, forKey: "username")
        syncStats()
    }
    
    func logout() {
        userId = nil
        isAuthenticated = false
        hasCompletedOnboarding = false
    }
}

// Estructura auxiliar para decodificar el perfil del backend
struct RemoteProfile: Codable {
    let username: String
    let xp: Int
    let chips: Int
    let streak: Int
    let levelIdx: Int
    let userBadges: [BadgeRecord]?
    
    struct BadgeRecord: Codable {
        let badgeId: String
    }
}

struct Badge: Identifiable, Codable {
    let id: String; let title: String; let description: String; let icon: String; let colorHex: String
    var color: Color { Color(hex: colorHex) }
    static let allBadges: [Badge] = [
        Badge(id: "first_mission", title: "Primer Salto", description: "Completaste tu primera misión educativa.", icon: "rocket", colorHex: "007AFF"),
        Badge(id: "xp_1000", title: "Batería llena", description: "Alcanzaste tus primeros 1000 de energía.", icon: "bolt.fill", colorHex: "FFCC00"),
        Badge(id: "streak_7", title: "Constancia Estelar", description: "Mantuviste tu racha por 7 días seguidos.", icon: "flame.fill", colorHex: "FF9500"),
        Badge(id: "streak_30", title: "Navegante Experto", description: "Un mes entero sin apagar motores.", icon: "star.fill", colorHex: "AF52DE"),
        Badge(id: "social_ally", title: "Aliado Galáctico", description: "Te uniste a tu primera misión en equipo.", icon: "person.2.fill", colorHex: "34C759")
    ]
    enum CodingKeys: String, CodingKey { case id, title, description, icon, colorHex = "color_hex" }
}

struct TeamMission: Identifiable, Codable {
    var id = UUID(); let title: String; let description: String; let rewardXP: Int; let currentMembers: Int; let maxMembers: Int; let icon: String
    enum CodingKeys: String, CodingKey { case id, title, description, rewardXP, currentMembers, maxMembers, icon }
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        title = try container.decode(String.self, forKey: .title)
        description = try container.decode(String.self, forKey: .description)
        rewardXP = try container.decode(Int.self, forKey: .rewardXP)
        currentMembers = try container.decodeIfPresent(Int.self, forKey: .currentMembers) ?? 0
        maxMembers = try container.decodeIfPresent(Int.self, forKey: .maxMembers) ?? 5
        icon = try container.decode(String.self, forKey: .icon)
    }
    init(title: String, description: String, rewardXP: Int, currentMembers: Int, maxMembers: Int, icon: String) {
        self.id = UUID(); self.title = title; self.description = description; self.rewardXP = rewardXP; self.currentMembers = currentMembers; self.maxMembers = maxMembers; self.icon = icon
    }
}

struct StoreItem: Identifiable, Codable {
    let id: String; let title: String; let price: Int; let icon: String; let colorHex: String; let category: String
    var color: Color { Color(hex: colorHex) }
    enum CodingKeys: String, CodingKey { case id, title, price, icon, category, colorHex = "color_hex" }
}

struct Level: Identifiable, Codable {
    var id: String { name }; let name: String; let minXP: Int; let emoji: String
}

struct Planet: Identifiable, Codable {
    var id = UUID(); let name: String; let colorHex: String; let icon: String
    var color: Color { Color(hex: colorHex) }
    enum CodingKeys: String, CodingKey { case id, name, colorHex, icon }
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        name = try container.decode(String.self, forKey: .name)
        colorHex = try container.decodeIfPresent(String.self, forKey: .colorHex) ?? "FFFFFF"
        icon = try container.decode(String.self, forKey: .icon)
    }
    init(name: String, color: Color, icon: String) {
        self.id = UUID(); self.name = name; self.colorHex = color.toHex() ?? "FFFFFF"; self.icon = icon
    }
}

struct Course: Identifiable, Codable {
    var id = UUID(); let title: String; let icon: String; let progress: Double; let colorHex: String; let lessons: Int; let completedLessons: Int
    var color: Color { Color(hex: colorHex) }
    enum CodingKeys: String, CodingKey { case id, title, icon, progress, colorHex = "color_hex", lessons = "total_lessons", completedLessons = "completed_lessons" }
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        title = try container.decodeIfPresent(String.self, forKey: .title) ?? "Curso sin título"
        icon = try container.decodeIfPresent(String.self, forKey: .icon) ?? "book.fill"
        progress = try container.decodeIfPresent(Double.self, forKey: .progress) ?? 0.0
        colorHex = try container.decodeIfPresent(String.self, forKey: .colorHex) ?? "8B88FF"
        lessons = try container.decodeIfPresent(Int.self, forKey: .lessons) ?? 0
        completedLessons = try container.decodeIfPresent(Int.self, forKey: .completedLessons) ?? 0
    }
    init(title: String, icon: String, progress: Double, color: Color, lessons: Int, completedLessons: Int) {
        self.id = UUID(); self.title = title; self.icon = icon; self.progress = progress; self.colorHex = color.toHex() ?? "FFFFFF"; self.lessons = lessons; self.completedLessons = completedLessons
    }
    init(title: String, icon: String, progress: Double, colorHex: String, lessons: Int, completedLessons: Int) {
        self.id = UUID(); self.title = title; self.icon = icon; self.progress = progress; self.colorHex = colorHex; self.lessons = lessons; self.completedLessons = completedLessons
    }
}

struct Mission: Identifiable, Codable {
    var id = UUID(); let title: String; let reward: Int; let isCompleted: Bool
    enum CodingKeys: String, CodingKey { case id, title, reward, isCompleted }
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        title = try container.decode(String.self, forKey: .title)
        reward = try container.decode(Int.self, forKey: .reward)
        isCompleted = try container.decodeIfPresent(Bool.self, forKey: .isCompleted) ?? false
    }
}

struct Question: Identifiable, Codable {
    var id = UUID(); let title: String; let command: String; let hint: String; let options: [String]; let correctAnswer: Int; let icon: String; let videoUrl: String?
    enum CodingKeys: String, CodingKey { case id, title, command, hint, options, icon, correctAnswer = "correct_answer", videoUrl = "video_url" }
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        title = try container.decode(String.self, forKey: .title)
        command = try container.decode(String.self, forKey: .command)
        hint = try container.decodeIfPresent(String.self, forKey: .hint) ?? ""
        options = try container.decodeIfPresent([String].self, forKey: .options) ?? []
        correctAnswer = try container.decodeIfPresent(Int.self, forKey: .correctAnswer) ?? 0
        icon = try container.decodeIfPresent(String.self, forKey: .icon) ?? "questionmark"
        videoUrl = try container.decodeIfPresent(String.self, forKey: .videoUrl)
    }
}

struct LessonSet: Identifiable, Codable {
    let id: String; let title: String; let questions: [Question]
}

enum JopiTab: String, CaseIterable {
    case home = "house.fill"; case courses = "graduationcap.fill"; case wallet = "bolt.fill"; case community = "globe.americas.fill"; case profile = "person.fill"
    var title: String {
        switch self {
        case .home: return "Inicio"; case .courses: return "Cursos"; case .wallet: return "Chispas"; case .community: return "Comunidad"; case .profile: return "Perfil"
        }
    }
}
