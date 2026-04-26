import SwiftUI

struct Achievement: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
    let color: Color
    let isUnlocked: Bool
    let progress: Double? // Optional progress for tiered achievements
}

struct AchievementView: View {
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    let achievements = [
        Achievement(title: "Primer Despegue", description: "Completa tu primera lección.", icon: "rocket.fill", color: .orange, isUnlocked: true, progress: nil),
        Achievement(title: "Explorador Constante", description: "Mantén una racha de 7 días.", icon: "flame.fill", color: .red, isUnlocked: true, progress: nil),
        Achievement(title: "Maestro del Código", description: "Completa el curso de Python.", icon: "terminal.fill", color: .blue, isUnlocked: false, progress: 0.6),
        Achievement(title: "Millonario Espacial", description: "Gana 5000 Chispas.", icon: "sparkles", color: .yellow, isUnlocked: true, progress: nil),
        Achievement(title: "Amigo de Jopi", description: "Interactúa con el mascot 50 veces.", icon: "face.smiling.fill", color: .green, isUnlocked: false, progress: 0.2),
        Achievement(title: "Conquistador", description: "Visita 3 planetas diferentes.", icon: "globe.americas.fill", color: .cyan, isUnlocked: true, progress: nil)
    ]
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(pal.text)
                            .frame(width: 44, height: 44)
                            .background(pal.card)
                            .cornerRadius(12)
                    }
                    Spacer()
                    Text("Tus Logros")
                        .font(.system(size: 20, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                    Spacer()
                    Rectangle().fill(Color.clear).frame(width: 44, height: 44)
                }
                .padding(.horizontal, 24)
                .padding(.top, 20)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        // Summary Card
                        JStack {
                            HStack(spacing: 20) {
                                ZStack {
                                    Circle()
                                        .fill(pal.primary.opacity(0.2))
                                        .frame(width: 80, height: 80)
                                    Image(systemName: "trophy.fill")
                                        .font(.system(size: 40))
                                        .foregroundColor(pal.primary)
                                }
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("\(achievements.filter { $0.isUnlocked }.count) / \(achievements.count)")
                                        .font(.system(size: 28, weight: .black, design: .rounded))
                                        .foregroundColor(pal.text)
                                    Text("Logros Desbloqueados")
                                        .font(.system(size: 14, weight: .bold, design: .rounded))
                                        .foregroundColor(pal.textMuted)
                                }
                                Spacer()
                            }
                        }
                        
                        // Grid of achievements
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 20) {
                            ForEach(achievements) { achievement in
                                achievementCard(achievement: achievement)
                            }
                        }
                    }
                    .padding(24)
                    
                    Spacer(minLength: 100)
                }
            }
        }
    }
    
    private func achievementCard(achievement: Achievement) -> some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(achievement.isUnlocked ? achievement.color.opacity(0.15) : pal.card)
                    .frame(width: 70, height: 70)
                
                Image(systemName: achievement.icon)
                    .font(.system(size: 30))
                    .foregroundColor(achievement.isUnlocked ? achievement.color : pal.textMuted.opacity(0.3))
                
                if !achievement.isUnlocked {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 14))
                        .foregroundColor(pal.textMuted)
                        .padding(6)
                        .background(pal.bg)
                        .clipShape(Circle())
                        .offset(x: 25, y: 25)
                }
            }
            
            VStack(spacing: 4) {
                Text(achievement.title)
                    .font(.system(size: 16, weight: .black, design: .rounded))
                    .foregroundColor(achievement.isUnlocked ? pal.text : pal.textMuted)
                    .multilineTextAlignment(.center)
                
                Text(achievement.description)
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundColor(pal.textMuted)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
            
            if let progress = achievement.progress, !achievement.isUnlocked {
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(pal.border.opacity(0.1))
                            .frame(height: 6)
                        Capsule()
                            .fill(achievement.color)
                            .frame(width: geo.size.width * CGFloat(progress), height: 6)
                    }
                }
                .frame(height: 6)
                .padding(.horizontal, 10)
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(pal.card.opacity(achievement.isUnlocked ? 0.6 : 0.3))
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(achievement.isUnlocked ? achievement.color.opacity(0.3) : pal.border, lineWidth: 1.5)
        )
        .grayscale(achievement.isUnlocked ? 0 : 1.0)
    }
}
