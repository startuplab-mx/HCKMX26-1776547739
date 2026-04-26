import SwiftUI

enum FeedItemType {
    case discovery(Course) // La "Portada" del curso para decidir si entrar
    case theory(title: String, description: String, icon: String, colorHex: String, videoURL: String?, courseID: UUID)
    case question(Question, courseID: UUID)
    case completion(xp: Int, chips: Int, courseID: UUID)
}

struct FeedItem: Identifiable, Equatable {
    let id = UUID()
    let type: FeedItemType
    
    static func == (lhs: FeedItem, rhs: FeedItem) -> Bool {
        lhs.id == rhs.id
    }
}

struct CourseTikTokView: View {
    let initialCourse: Course
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    @State private var visibleItems: [FeedItem] = []
    @State private var expandedCourses: Set<UUID> = []
    @State private var scrollPosition: UUID?
    
    var body: some View {
        ZStack {
            pal.bg.ignoresSafeArea()
            
            if visibleItems.isEmpty {
                VStack(spacing: 20) {
                    ProgressView().tint(pal.primary).scaleEffect(1.5)
                    Text("Cargando misión...").foregroundColor(pal.text.opacity(0.7))
                }
            } else {
                ScrollView(.vertical, showsIndicators: false) {
                    LazyVStack(spacing: 0) {
                        ForEach(visibleItems) { item in
                            FeedItemView(
                                item: item,
                                onAction: { action in
                                    handleAction(action, for: item)
                                }
                            )
                            .containerRelativeFrame([.horizontal, .vertical])
                            .id(item.id)
                        }
                    }
                    .scrollTargetLayout()
                }
                .scrollTargetBehavior(.paging)
                .scrollPosition(id: $scrollPosition)
                .ignoresSafeArea()
            }
            
            // Botón de Salir
            VStack {
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                    }
                    Spacer()
                }
                .padding(.horizontal, 24)
                .padding(.top, 60)
                Spacer()
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            setupInitialFeed()
        }
    }
    
    private func setupInitialFeed() {
        var items: [FeedItem] = []
        items.append(FeedItem(type: .discovery(initialCourse)))
        visibleItems = items
        scrollPosition = items.first?.id
    }
    
    enum FeedAction {
        case startCourse(Course)
        case nextCard
    }
    
    private func handleAction(_ action: FeedAction, for item: FeedItem) {
        switch action {
        case .startCourse(let course):
            Task {
                await expandCourse(course, after: item)
            }
        case .nextCard:
            processRewards(for: item)
            advanceToNext()
        }
    }
    
    private func processRewards(for item: FeedItem) {
        switch item.type {
        case .question:
            user.addXP(15)
        case .completion(let xp, let chips, _):
            user.addXP(xp)
            withAnimation { user.chips += chips }
            AudioManager.shared.play(.success)
        default:
            break
        }
    }
    
    private func expandCourse(_ course: Course, after item: FeedItem) async {
        guard !expandedCourses.contains(course.id) else {
            advanceToNext()
            return
        }
        
        expandedCourses.insert(course.id)
        
        // CARGA DIRECTA DE LECCIONES DEL CURSO DESDE EL BACKEND
        do {
            print("🛰️ Cargando misiones para curso ID: \(course.id)")
            let lessonSets = await LessonDataManager.shared.loadLessons(courseId: course.id)
            
            guard let firstSet = lessonSets.first else {
                print("⚠️ No se encontraron misiones para este curso.")
                return
            }
            
            let questions = firstSet.questions
            var newContent: [FeedItem] = []
            
            for q in questions {
                print("🎬 Inyectando lección: \(q.title) | Video: \(q.videoUrl ?? "SIN VIDEO")")
                
                newContent.append(FeedItem(type: .theory(
                    title: q.title,
                    description: q.hint,
                    icon: q.icon,
                    colorHex: course.colorHex,
                    videoURL: q.videoUrl, // URL REAL DE SUPABASE
                    courseID: course.id
                )))
                newContent.append(FeedItem(type: .question(q, courseID: course.id)))
            }
            
            newContent.append(FeedItem(type: .completion(xp: 50, chips: 10, courseID: course.id)))
            
            if let currentIdx = visibleItems.firstIndex(where: { $0.id == item.id }) {
                await MainActor.run {
                    withAnimation {
                        visibleItems.insert(contentsOf: newContent, at: currentIdx + 1)
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        withAnimation(.spring()) {
                            scrollPosition = newContent.first?.id
                        }
                    }
                }
            }
        } catch {
            print("❌ Error cargando lecciones reales: \(error)")
        }
    }
    
    private func advanceToNext() {
        guard let currentPosition = scrollPosition,
              let currentIdx = visibleItems.firstIndex(where: { $0.id == currentPosition }) else { return }
        
        if currentIdx + 1 < visibleItems.count {
            withAnimation(.spring()) {
                scrollPosition = visibleItems[currentIdx + 1].id
            }
        } else {
            // SI YA NO HAY MÁS CARTAS (Ej. botón final de Volver a la base)
            // Cerramos la vista estilo TikTok para regresar a la Home
            dismiss()
        }
    }
}

// MARK: - Subviews

struct FeedItemView: View {
    let item: FeedItem
    let onAction: (CourseTikTokView.FeedAction) -> Void
    
    var body: some View {
        switch item.type {
        case .discovery(let course):
            DiscoveryCard(course: course, onStart: { onAction(.startCourse(course)) })
        case .theory(let title, let desc, let icon, let colorHex, let videoURL, _):
            TheoryCard(title: title, desc: desc, icon: icon, color: Color(hex: colorHex), videoURL: videoURL, onNext: { onAction(.nextCard) })
        case .question(let q, _):
            TikTokQuestionCard(question: q, onCorrect: { onAction(.nextCard) })
        case .completion(let xp, let chips, _):
            CompletionCard(xp: xp, chips: chips, onFinish: { onAction(.nextCard) })
        }
    }
}

struct DiscoveryCard: View {
    let course: Course
    let onStart: () -> Void
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        ZStack {
            course.color.opacity(0.4).ignoresSafeArea()
            SpaceBackgroundView()
            
            VStack(spacing: 24) {
                Spacer()
                PlanetArtView(size: 200, color: course.color, hasRings: true)
                    .shadow(color: course.color.opacity(0.5), radius: 40)
                
                VStack(spacing: 12) {
                    Text("NUEVA MISIÓN")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .padding(.horizontal, 16).padding(.vertical, 8)
                        .background(pal.text.opacity(0.1)).cornerRadius(12)
                        .foregroundColor(pal.text)
                    
                    Text(course.title)
                        .font(.system(size: 40, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                        .multilineTextAlignment(.center)
                }
                
                Spacer()
                
                Button(action: onStart) {
                    HStack {
                        Text("¡EMPEZAR AHORA!")
                        Image(systemName: "arrow.right.circle.fill")
                    }
                    .font(.system(size: 18, weight: .black, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 24)
                    .background(course.color)
                    .cornerRadius(24)
                    .padding(.horizontal, 40)
                }
                .padding(.bottom, 60)
            }
        }
    }
}

struct TheoryCard: View {
    let title: String
    let desc: String
    let icon: String
    let color: Color
    let videoURL: String?
    let onNext: () -> Void

    @State private var tts = TTSManager.shared
    @State private var expanded = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // Background / video
            ZStack {
                color.opacity(0.3).ignoresSafeArea()
                if let urlString = videoURL, let url = URL(string: urlString) {
                    JopiVideoPlayer(url: url).ignoresSafeArea()
                } else {
                    SpaceBackgroundView()
                    VStack {
                        if icon == "rocket" { RocketView(size: 150) }
                        else if icon == "sparkles" { BlackHoleView(size: 200) }
                        else { PlanetArtView(size: 180, color: color, hasRings: true) }
                    }
                    .shadow(color: color.opacity(0.5), radius: 30)
                }
            }

            // Subtle bottom fade
            LinearGradient(
                colors: [.clear, .black.opacity(0.55)],
                startPoint: .init(x: 0.5, y: 0.6),
                endPoint: .bottom
            ).ignoresSafeArea()

            // Side actions
            VStack(spacing: 20) {
                Spacer()
                tiktokAction(icon: "speaker.wave.2.fill") {
                    if tts.isSpeaking { tts.stop() }
                    else { tts.speak("\(title). \(desc)") }
                }
                tiktokAction(icon: "chevron.down.circle.fill") {
                    tts.stop(); onNext()
                }
            }
            .padding(.bottom, 110)
            .frame(maxWidth: .infinity, alignment: .trailing)
            .padding(.trailing, 16)

            // Text overlay
            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 20, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .shadow(color: .black.opacity(0.6), radius: 4, x: 0, y: 1)

                if expanded {
                    Text(desc)
                        .font(.system(size: 14, weight: .regular, design: .rounded))
                        .foregroundColor(.white.opacity(0.85))
                        .lineSpacing(3)
                        .shadow(color: .black.opacity(0.5), radius: 3)
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                }

                Button {
                    withAnimation(.spring(response: 0.3)) { expanded.toggle() }
                } label: {
                    Text(expanded ? "Ver menos" : "Ver más")
                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.6))
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 20)
            .padding(.bottom, 100)
            .padding(.trailing, 64)
        }
        .onDisappear { tts.stop() }
    }

    private func tiktokAction(icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 26))
                .foregroundColor(.white)
                .shadow(color: .black.opacity(0.5), radius: 4)
        }
    }
}

struct TikTokQuestionCard: View {
    let question: Question
    let onCorrect: () -> Void
    @State private var selectedOption: Int? = nil
    @State private var showFeedback = false
    @Environment(\.jopiPalette) var pal
    @State private var tts = TTSManager.shared
    
    var body: some View {
        ZStack(alignment: .bottom) {
            pal.bg.ignoresSafeArea()
            VStack(alignment: .leading, spacing: 24) {
                Spacer()
                HStack(alignment: .center, spacing: 16) {
                    ChispaMascotView(size: 80, isVictory: showFeedback && selectedOption == question.correctAnswer)
                    VStack(alignment: .leading) {
                        HStack {
                            Text("PREGUNTA").font(.system(size: 14, weight: .bold, design: .rounded)).foregroundColor(pal.textMuted)
                            Button {
                                if tts.isSpeaking { tts.stop() }
                                else { 
                                    let optionsText = question.options.enumerated().map { "Opción \($0.offset + 1): \($0.element)" }.joined(separator: ". ")
                                    tts.speak("\(question.title). \(optionsText)")
                                }
                            } label: {
                                Image(systemName: tts.isSpeaking ? "speaker.slash.fill" : "speaker.wave.2.fill")
                                    .font(.system(size: 14, weight: .bold)).padding(6).background(pal.textMuted.opacity(0.2)).clipShape(Circle()).foregroundColor(pal.textMuted)
                            }
                        }
                        Text(question.title).font(.system(size: 28, weight: .black, design: .rounded)).foregroundColor(pal.text)
                    }
                }
                
                VStack(spacing: 16) {
                    ForEach(0..<question.options.count, id: \.self) { i in
                        Button {
                            if !showFeedback {
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                withAnimation(.spring()) { selectedOption = i }
                            }
                        } label: {
                            HStack(spacing: 16) {
                                Text(question.options[i]).font(.system(size: 17, weight: .bold, design: .rounded)).foregroundColor(pal.text).multilineTextAlignment(.leading)
                                Spacer()
                                if selectedOption == i {
                                    Image(systemName: showFeedback ? (i == question.correctAnswer ? "checkmark.circle.fill" : "xmark.circle.fill") : "circle.fill")
                                        .foregroundColor(showFeedback ? (i == question.correctAnswer ? .green : .red) : pal.primary)
                                }
                            }
                            .padding(20).background(optionBackgroundColor(for: i)).overlay(RoundedRectangle(cornerRadius: 24).stroke(optionBorderColor(for: i), lineWidth: 2)).cornerRadius(24)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                
                Button { handleAction() } label: {
                    Text(showFeedback ? (selectedOption == question.correctAnswer ? "SIGUIENTE" : "REINTENTAR") : "CONFIRMAR")
                        .font(.system(size: 18, weight: .black, design: .rounded)).foregroundColor(.white)
                        .frame(maxWidth: .infinity).padding(.vertical, 20).background(buttonColor).cornerRadius(20)
                }
                .disabled(selectedOption == nil).opacity(selectedOption == nil ? 0.5 : 1)
                Spacer(minLength: 120)
            }
            .padding(.horizontal, 24)
            
            if showFeedback && selectedOption == question.correctAnswer {
                ConfettiView(colors: [.green, .white, pal.primary]).allowsHitTesting(false)
            }
        }
        .onDisappear { tts.stop() }
    }
    
    private var buttonColor: Color {
        guard let sel = selectedOption else { return .gray }
        if showFeedback { return sel == question.correctAnswer ? .green : .red }
        return pal.primary
    }
    
    private func handleAction() {
        if showFeedback {
            if selectedOption == question.correctAnswer { onCorrect() }
            else { withAnimation { selectedOption = nil; showFeedback = false } }
        } else {
            let isCorrect = selectedOption == question.correctAnswer
            withAnimation(.spring()) { 
                showFeedback = true 
                if isCorrect { HapticManager.shared.notification(.success); AudioManager.shared.play(.success) }
                else { HapticManager.shared.notification(.error); AudioManager.shared.play(.error) }
            }
        }
    }
    
    private func optionBackgroundColor(for index: Int) -> Color {
        guard selectedOption == index else { return pal.surface.opacity(0.5) }
        if showFeedback { return index == question.correctAnswer ? Color.green.opacity(0.2) : Color.red.opacity(0.2) }
        return pal.primary.opacity(0.2)
    }
    
    private func optionBorderColor(for index: Int) -> Color {
        guard selectedOption == index else { return pal.border }
        if showFeedback { return index == question.correctAnswer ? .green : .red }
        return pal.primary
    }
}

struct CompletionCard: View {
    let xp: Int; let chips: Int; let onFinish: () -> Void
    @Environment(\.jopiPalette) var pal

    var body: some View {
        ZStack {
            pal.bg.ignoresSafeArea()
            SpaceBackgroundView()
            ConfettiView(colors: [pal.tertiary, pal.primary, pal.secondary])
            VStack(spacing: 32) {
                Text("¡Misión Completada!")
                    .font(.system(size: 36, weight: .black, design: .rounded))
                    .foregroundColor(pal.text)
                    .multilineTextAlignment(.center)

                HStack(spacing: 20) {
                    VStack(spacing: 4) {
                        Text("+\(xp)")
                            .font(.system(size: 40, weight: .black, design: .rounded))
                            .foregroundColor(pal.tertiary)
                        Text("XP GANADO")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(pal.textMuted)
                    }
                    VStack(spacing: 4) {
                        Text("+\(chips)")
                            .font(.system(size: 40, weight: .black, design: .rounded))
                            .foregroundColor(pal.primary)
                        Text("CHISPAS")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(pal.textMuted)
                    }
                }
                .padding(32)
                .background(pal.card.opacity(0.3))
                .cornerRadius(32)
                .overlay(RoundedRectangle(cornerRadius: 32).stroke(pal.border.opacity(0.2), lineWidth: 1))

                Button(action: onFinish) {
                    Text("VOLVER A LA BASE")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(pal.bg)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                        .background(pal.primary)
                        .cornerRadius(20)
                }
                .padding(.horizontal, 40)
            }
        }
    }
}

struct RocketView: View {
    @State private var animate = false; var size: CGFloat
    var body: some View {
        Image(systemName: "rocket").font(.system(size: size)).foregroundColor(.white).offset(y: animate ? -20 : 20).onAppear { withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) { animate = true } }
    }
}
