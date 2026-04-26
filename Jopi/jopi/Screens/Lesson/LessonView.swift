import SwiftUI

struct LessonView: View {
    @State private var lessonSet: LessonSet?
    @State private var currentQuestionIndex = 0
    @State private var selectedOption: Int? = nil
    @State private var showFeedback = false
    @State private var showConquest = false
    @State private var showConfetti = false
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    @State private var tts = TTSManager.shared
    
    let initialLessonSet: LessonSet?
    
    init(lessonSet: LessonSet? = nil) {
        self.initialLessonSet = lessonSet
    }
    
    var currentQuestion: Question? {
        lessonSet?.questions[currentQuestionIndex]
    }
    
    var progress: Double {
        guard let set = lessonSet, !set.questions.isEmpty else { return 0.0 }
        return Double(currentQuestionIndex + (showFeedback ? 1 : 0)) / Double(set.questions.count)
    }
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // HUD TOP
                JopiLessonProgressView(progress: progress)
                
                if let set = lessonSet {
                    if set.questions.isEmpty {
                        VStack(spacing: 20) {
                            Text("🛸")
                                .font(.system(size: 80))
                            Text("Esta misión aún no tiene preguntas disponibles.")
                                .font(.system(size: 18, weight: .bold, design: .rounded))
                                .multilineTextAlignment(.center)
                                .foregroundColor(pal.text)
                                .padding(.horizontal, 40)
                            
                            JopiButton(title: "Volver a la base") {
                                dismiss()
                            }
                            .padding(.top, 20)
                        }
                        .frame(maxHeight: .infinity)
                    } else if let question = currentQuestion {
                        // CONTENIDO DE PREGUNTA
                        VStack(alignment: .leading, spacing: 24) {
                            HStack(alignment: .top, spacing: 16) {
                                ChispaMascotView(size: 80, isVictory: showFeedback && selectedOption == question.correctAnswer)
                                    .onTapGesture {
                                        tts.speak(question.title)
                                    }
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(question.command)
                                        .font(.system(size: 14, weight: .black, design: .rounded))
                                        .foregroundColor(pal.tertiary)
                                    
                                    Text(question.title)
                                        .font(.system(size: 24, weight: .bold, design: .rounded))
                                        .foregroundColor(pal.text)
                                }
                            }
                            .padding(.horizontal, 24)
                            
                            ScrollView {
                                VStack(spacing: 12) {
                                    ForEach(0..<question.options.count, id: \.self) { i in
                                        LessonOptionRow(
                                            text: question.options[i],
                                            isSelected: selectedOption == i,
                                            isCorrect: i == question.correctAnswer,
                                            showFeedback: showFeedback,
                                            action: { selectOption(i) }
                                        )
                                    }
                                }
                                .padding(.horizontal, 24)
                            }
                        }
                        .padding(.top, 32)
                    }
                } else {
                    // Estado de Carga
                    VStack {
                        ProgressView()
                            .tint(pal.primary)
                            .scaleEffect(1.5)
                        Text("Cargando misión...")
                            .font(.system(size: 16, weight: .bold, design: .rounded))
                            .foregroundColor(pal.text.opacity(0.7))
                            .padding(.top, 20)
                    }
                    .frame(maxHeight: .infinity)
                }
                
                Spacer()
                
                // BOTÓN DE ACCIÓN
                VStack(spacing: 0) {
                    Divider().background(pal.border)
                    
                    if showFeedback {
                        feedbackBottomBar
                    } else {
                        JopiButton(
                            title: "¡COMPROBAR!",
                            action: {
                                checkAnswer()
                            }
                        )
                        .disabled(selectedOption == nil)
                        .opacity(selectedOption == nil ? 0.5 : 1.0)
                        .padding(24)
                    }
                }
                .background(pal.bg.opacity(0.95))
            }
            
            if showConfetti {
                ConfettiView(colors: [.green, .white, pal.primary])
                    .allowsHitTesting(false)
            }
        }
        .task {
            // Cargar lección al iniciar
            if let initial = initialLessonSet {
                self.lessonSet = initial
            } else {
                let lessons = await LessonDataManager.shared.loadLessons()
                self.lessonSet = lessons.first
            }
        }
        .fullScreenCover(isPresented: $showConquest) {
            if let set = lessonSet {
                // Creamos un planeta temporal para la celebración
                PlanetConquestView(planet: Planet(name: set.title, color: pal.primary, icon: "sparkles")) {
                    dismiss()
                }
            }
        }
    }
    
    // MARK: - Lógica de Lección
    
    private func selectOption(_ index: Int) {
        guard !showFeedback else { return }
        HapticManager.shared.play(.light)
        selectedOption = index
    }
    
    private func checkAnswer() {
        guard let selected = selectedOption, let question = currentQuestion else { return }
        
        showFeedback = true
        let isCorrect = selected == question.correctAnswer
        
        if isCorrect {
            HapticManager.shared.notification(.success)
            AudioManager.shared.play(.success)
            showConfetti = true
            tts.speak("¡Excelente, Explorador!")
        } else {
            HapticManager.shared.notification(.error)
            AudioManager.shared.play(.error)
            tts.speak("¡Casi lo logras!")
        }
    }
    
    private func nextQuestion() {
        guard let set = lessonSet else { return }
        
        showFeedback = false
        selectedOption = nil
        showConfetti = false
        tts.stop()
        
        if currentQuestionIndex + 1 < set.questions.count {
            withAnimation {
                currentQuestionIndex += 1
            }
        } else {
            // Misión terminada
            showConquest = true
        }
    }
    
    // MARK: - Subviews de Feedback
    
    private var feedbackBottomBar: some View {
        let isCorrect = selectedOption == (currentQuestion?.correctAnswer ?? 0)
        
        return VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                Image(systemName: isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .font(.system(size: 28))
                Text(isCorrect ? "¡Excelente, Explorador!" : "¡Casi lo logras!")
                    .font(.system(size: 20, weight: .black, design: .rounded))
            }
            .foregroundColor(isCorrect ? .green : .red)
            
            if !isCorrect {
                Text("La respuesta correcta era: \(currentQuestion?.options[currentQuestion?.correctAnswer ?? 0] ?? "")")
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(pal.text.opacity(0.8))
            }
            
            JopiButton(
                title: isCorrect ? "¡SIGUIENTE!" : "ENTENDIDO",
                style: isCorrect ? .primary : .danger,
                action: {
                    nextQuestion()
                }
            )
        }
        .padding(24)
        .background(isCorrect ? Color.green.opacity(0.1) : Color.red.opacity(0.1))
    }
}

struct LessonOptionRow: View {
    let text: String
    let isSelected: Bool
    let isCorrect: Bool
    let showFeedback: Bool
    let action: () -> Void
    
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Text(text)
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .multilineTextAlignment(.leading)
                    .foregroundColor(.white)
                
                Spacer()
                
                if showFeedback {
                    Image(systemName: isCorrect ? "checkmark.circle.fill" : (isSelected ? "xmark.circle.fill" : "circle"))
                        .foregroundColor(isCorrect ? .green : (isSelected ? .red : .white.opacity(0.2)))
                } else {
                    Circle()
                        .stroke(isSelected ? pal.primary : Color.white.opacity(0.2), lineWidth: 2)
                        .frame(width: 24, height: 24)
                        .overlay(Circle().fill(isSelected ? pal.primary : Color.clear).padding(4))
                }
            }
            .padding(20)
            .background(backgroundColor)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(borderColor, lineWidth: 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var backgroundColor: Color {
        if !showFeedback {
            return isSelected ? pal.primary.opacity(0.1) : pal.card.opacity(0.6)
        }
        if isCorrect { return Color.green.opacity(0.1) }
        if isSelected { return Color.red.opacity(0.1) }
        return pal.card.opacity(0.6)
    }
    
    private var borderColor: Color {
        if !showFeedback {
            return isSelected ? pal.primary : pal.border.opacity(0.3)
        }
        if isCorrect { return Color.green }
        if isSelected { return Color.red }
        return pal.border.opacity(0.3)
    }
}
