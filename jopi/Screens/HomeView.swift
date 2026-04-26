import SwiftUI

struct HomeView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    @Binding var showingLesson: Bool
    @State private var avatar = AvatarState()
    
    // Frases motivadoras de Jopi
    let jopiMessages = [
        "¡Hola Explorador! ¿Qué descubriremos hoy?",
        "¡Tu racha brilla como una supernova! 🔥",
        "¿Sabías que el código es el lenguaje del espacio?",
        "¡Tus chispas están listas para ser canjeadas!",
        "¡Hagamos que hoy cueste luz! 🚀"
    ]
    @State private var currentMessage = ""
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            OrbitDecoration()
            
            VStack(spacing: 0) {
                // HEADER ORGÁNICO
                VStack(alignment: .leading, spacing: 6) {
                    Text("¡Hola Explorador!")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundColor(pal.tertiary)
                    
                    HStack {
                        Text("Tu Base")
                            .font(.system(size: 36, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                        
                        Spacer()
                        
                        // Botón de música sutil
                        Button {
                            HapticManager.shared.play(.light)
                            withAnimation {
                                user.isMusicEnabled.toggle()
                            }
                        } label: {
                            Image(systemName: user.isMusicEnabled ? "speaker.wave.3.fill" : "speaker.slash.fill")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(user.isMusicEnabled ? pal.primary : pal.textMuted)
                                .frame(width: 44, height: 44)
                                .background(pal.card.opacity(0.6))
                                .clipShape(Circle())
                                .overlay(Circle().stroke(pal.border.opacity(0.2), lineWidth: 1))
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 24)
                .padding(.top, 20)
                .padding(.bottom, 20)
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {
                        
                        // SECCIÓN 1: MASCOTA INTERACTIVA (JOPI)
                        HStack(alignment: .bottom, spacing: 20) {
                            ChispaMascotView(size: 120)
                                .onTapGesture {
                                    HapticManager.shared.play(.medium)
                                    updateJopiMessage()
                                }
                            
                            // Globo de Texto
                            VStack(alignment: .leading, spacing: 8) {
                                Text(currentMessage)
                                    .font(.system(size: 15, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.text)
                                    .padding(16)
                                    .background(pal.card.opacity(0.8))
                                    .cornerRadius(20, corners: [.topLeft, .topRight, .bottomRight])
                                    .overlay(
                                        // Triangulito del globo
                                        Image(systemName: "arrowtriangle.left.fill")
                                            .foregroundColor(pal.card.opacity(0.8))
                                            .offset(x: -25, y: 10),
                                        alignment: .bottomLeading
                                    )
                                    .transition(.scale.combined(with: .opacity))
                            }
                            .padding(.bottom, 20)
                        }
                        .padding(.horizontal, 8)
                        
                        // SECCIÓN 2: DESAFÍOS DIARIOS (Checklist)
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Misiones del Día")
                                .font(.system(size: 16, weight: .bold, design: .rounded))
                                .foregroundColor(pal.primary)
                            
                            VStack(spacing: 12) {
                                ForEach(user.dailyQuests) { quest in
                                    DailyQuestRow(quest: quest)
                                }
                            }
                        }

                        // SECCIÓN 3: CONTINUAR APRENDIENDO
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                Text("Continuar Aprendiendo")
                                    .font(.system(size: 14, weight: .bold, design: .rounded))
                                    .foregroundColor(pal.primary)
                                Spacer()
                                NavigationLink(destination: CoursesView()) {
                                    Text("Ver todos").font(.system(size: 12, weight: .bold)).foregroundColor(pal.tertiary)
                                }
                            }

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(user.activeCourses) { course in
                                        NavigationLink(destination: CourseTikTokView(initialCourse: course)) {
                                            NetflixCourseCard(course: course)
                                        }
                                        .buttonStyle(PlainButtonStyle())
                                    }
                                }
                                .padding(.vertical, 8)
                            }
                        }
                        
                        // SECCIÓN 4: BENTO HUD (Estadísticas rápidas)
                        HStack(spacing: 16) {
                            bentoStat(value: "\(user.chips)", label: "Tus Créditos", icon: "bolt.fill", accentColor: pal.tertiary)
                            bentoStat(value: "\(user.streak)", label: "Tu Oxígeno", icon: "wind", accentColor: pal.primary)
                        }
                        
                        Spacer(minLength: 120)
                    }
                    .padding(.horizontal, 24)
                }
            }
        }
        .onAppear {
            if currentMessage.isEmpty {
                updateJopiMessage()
            }
        }
    }
    
    private func updateJopiMessage() {
        withAnimation(.spring()) {
            currentMessage = jopiMessages.randomElement() ?? "¡Vamos allá!"
            // Hablar el mensaje para accesibilidad y diversión
            TTSManager.shared.speak(currentMessage)
        }
    }
    
    private func bentoStat(value: String, label: String, icon: String, accentColor: Color) -> some View {
        JopiCard(padding: 14) {
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(accentColor.opacity(0.15))
                        .frame(width: 38, height: 38)
                    Image(systemName: icon)
                        .foregroundColor(accentColor)
                        .font(.system(size: 16, weight: .bold))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(value)
                        .font(.system(size: 20, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                    Text(label)
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(pal.textMuted)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

struct DailyQuestRow: View {
    let quest: DailyQuest
    @Environment(\.jopiPalette) var pal
    
    @State private var pulse = false
    
    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(quest.isCompleted ? pal.tertiary.opacity(0.2) : pal.card)
                    .frame(width: 44, height: 44)

                if quest.isCompleted {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(pal.tertiary)
                        .scaleEffect(pulse ? 1.1 : 1.0)
                } else {
                    Image(systemName: quest.icon)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(pal.primary)
                }
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(quest.title)
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(quest.isCompleted ? pal.text.opacity(0.6) : pal.text)
                
                // Barra de Progreso Estilizada
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(pal.border.opacity(0.2))
                            .frame(height: 8)

                        Capsule()
                            .fill(
                                LinearGradient(
                                    colors: quest.isCompleted
                                        ? [pal.tertiary, pal.tertiary.opacity(0.6)]
                                        : [pal.primary, pal.primary.opacity(0.6)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: geo.size.width * max(0, min(1.0, quest.progress)), height: 8)
                            .overlay(
                                Capsule()
                                    .fill(Color.white.opacity(0.25))
                                    .frame(height: 2)
                                    .offset(y: -2),
                                alignment: .top
                            )
                    }
                }
                .frame(height: 8)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 2) {
                Text("+\(quest.rewardXP)")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                Text("XP")
                    .font(.system(size: 8, weight: .bold))
            }
            .foregroundColor(quest.isCompleted ? pal.tertiary : pal.tertiary)
        }
        .padding(16)
        .background(
            ZStack {
                pal.card.opacity(quest.isCompleted ? 0.2 : 0.4)
                if quest.isCompleted {
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(pal.tertiary.opacity(0.35), lineWidth: 1)
                }
            }
        )
        .cornerRadius(20)
        .onAppear {
            if quest.isCompleted {
                withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                    pulse = true
                }
            }
        }
    }
}

struct NetflixCourseCard: View {
    let course: Course
    @Environment(\.jopiPalette) var pal

    private let cardWidth: CGFloat = UIScreen.main.bounds.width * 0.58

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Thumbnail
            ZStack {
                Rectangle()
                    .fill(course.color.gradient.opacity(0.3))

                SpaceBackgroundView()
                    .scaleEffect(0.5)

                Image(systemName: course.icon)
                    .font(.system(size: 40))
                    .foregroundColor(course.color)
                    .shadow(color: course.color.opacity(0.5), radius: 10)

                Image(systemName: "play.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .padding(12)
                    .background(.black.opacity(0.4))
                    .clipShape(Circle())
            }
            .frame(width: cardWidth, height: cardWidth * 0.56)
            .clipped()

            // Progress Bar
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(pal.border.opacity(0.2))
                    .frame(height: 3)

                Rectangle()
                    .fill(course.color)
                    .frame(width: cardWidth * max(0, min(1, course.progress)), height: 3)
            }

            // Info
            VStack(alignment: .leading, spacing: 4) {
                Text(course.title)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(pal.text)
                    .lineLimit(1)

                Text("Lección \(course.completedLessons + 1) de \(course.lessons)")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundColor(pal.textMuted)
            }
            .padding(12)
            .frame(width: cardWidth, alignment: .leading)
            .background(pal.card.opacity(0.4))
        }
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(pal.border.opacity(0.15), lineWidth: 1)
        )
    }
}
