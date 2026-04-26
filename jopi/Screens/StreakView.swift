import SwiftUI

struct StreakView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    let calendarDays: [StreakDay] = (1...30).map { i in
        StreakDay(dayNumber: i, isCompleted: i < 15 || i == 18, isToday: i == 15)
    }
    
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
                    Text("Tu Racha Estelar")
                        .font(.system(size: 20, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                    Spacer()
                    Rectangle().fill(Color.clear).frame(width: 44, height: 44)
                }
                .padding(.horizontal, 24)
                .padding(.top, 20)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        // Big Streak Hero
                        VStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(pal.primary.opacity(0.1))
                                    .frame(width: 150, height: 150)
                                
                                Image(systemName: "wind")
                                    .font(.system(size: 80))
                                    .foregroundColor(.cyan)
                                    .shadow(color: .cyan.opacity(0.5), radius: 15)
                            }
                            
                            VStack(spacing: 4) {
                                Text("\(user.streak)")
                                    .font(.system(size: 48, weight: .black, design: .rounded))
                                    .foregroundColor(pal.text)
                                Text("Días de Oxígeno")
                                    .font(.system(size: 18, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.textMuted)
                            }
                        }
                        .padding(.top, 20)
                        
                        // Calendar Card
                        JStack {
                            VStack(alignment: .leading, spacing: 20) {
                                Text("Abril 2026")
                                    .font(.system(size: 18, weight: .black, design: .rounded))
                                    .foregroundColor(pal.text)
                                
                                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 12) {
                                    ForEach(calendarDays) { day in
                                        calendarDayView(day: day)
                                    }
                                }
                            }
                        }
                        
                        // Rewards Roadmap
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Próximos Premios")
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)
                            
                            rewardRow(days: 320, title: "Caja de Suministros", icon: "shippingbox.fill", color: .orange)
                            rewardRow(days: 350, title: "Visor de Oro", icon: "eye.fill", color: .yellow)
                            rewardRow(days: 365, title: "Un Año en el Espacio", icon: "medal.fill", color: pal.primary)
                        }
                        
                        Spacer(minLength: 100)
                    }
                    .padding(24)
                }
            }
        }
    }
    
    private func calendarDayView(day: StreakDay) -> some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(day.isCompleted ? Color.cyan : (day.isToday ? pal.primary.opacity(0.2) : pal.border.opacity(0.1)))
                    .frame(width: 36, height: 36)
                
                if day.isCompleted {
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .black))
                        .foregroundColor(.black)
                } else if day.isToday {
                    Circle()
                        .stroke(pal.primary, lineWidth: 2)
                        .frame(width: 36, height: 36)
                    Text("\(day.dayNumber)")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .foregroundColor(pal.primary)
                } else {
                    Text("\(day.dayNumber)")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundColor(pal.textMuted.opacity(0.5))
                }
            }
        }
    }
    
    private func rewardRow(days: Int, title: String, icon: String, color: Color) -> some View {
        HStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(color.opacity(0.15))
                    .frame(width: 44, height: 44)
                Image(systemName: icon)
                    .foregroundColor(color)
                    .font(.system(size: 20))
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(pal.text)
                Text("En \(days - user.streak) días")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(pal.textMuted)
            }
            
            Spacer()
            
            Text("\(days)")
                .font(.system(size: 14, weight: .black, design: .rounded))
                .foregroundColor(color)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(color.opacity(0.1))
                .cornerRadius(8)
        }
        .padding(16)
        .background(pal.card)
        .cornerRadius(20)
    }
}

struct StreakDay: Identifiable {
    let id = UUID()
    let dayNumber: Int
    let isCompleted: Bool
    let isToday: Bool
}
