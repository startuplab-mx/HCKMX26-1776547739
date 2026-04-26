import SwiftUI

struct OnboardingView: View {
    @Environment(JopiUserData.self) var user
    @State private var step = 0
    @Environment(\.jopiPalette) var pal
    var onComplete: () -> Void
    
    // Step states
    @State private var tempUsername: String = ""
    @State private var selectedLevelIdx: Int = 1
    
    let storySteps = [
        OnboardingStep(
            title: "¡Hola\nExplorador!", 
            description: "El sistema actual está fallando, cadete. Jopi es la última frecuencia de esperanza. ¿Estás listo para pilotar tu destino?", 
            icon: "📡"
        ),
        OnboardingStep(
            title: "Mapea tu\nCamino", 
            description: "No buscamos seguidores, buscamos exploradores. Domina el código, el diseño y la economía para construir tu propia estación.", 
            icon: "👨‍🚀"
        ),
        OnboardingStep(
            title: "Gana tus\nCréditos", 
            description: "Cada descubrimiento genera Créditos Estelares. ¡Tu esfuerzo tiene valor real! Cada 100 puntos equivalen a 50 pesos para tus misiones.", 
            icon: "💎"
        )
    ]
    
    var totalSteps: Int { storySteps.count + 3 } // Story (3) + Username (1) + Avatar (1) + Level (1) = 6
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // Progress Bar
                progressBar
                
                // Main Content
                ZStack {
                    if step < storySteps.count {
                        storyView(storySteps[step])
                    } else if step == storySteps.count {
                        usernameView
                    } else if step == storySteps.count + 1 {
                        avatarView
                    } else if step == storySteps.count + 2 {
                        levelSelectionView
                    }
                }
                .transition(.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading)))
                .id("onboarding_step_\(step)")
                
                Spacer()
                
                // Navigation Actions
                VStack(spacing: 20) {
                    SpaceLaunchButton(title: step == totalSteps - 1 ? "¡DESPEGAR!" : "SIGUIENTE", isEnabled: isStepValid) {
                        handleNext()
                    }
                    .padding(.horizontal, 32)
                    
                    if step > 0 {
                        Button {
                            withAnimation(.spring()) { step -= 1 }
                        } label: {
                            Text("Atrás")
                                .font(.system(size: 16, weight: .bold, design: .rounded))
                                .foregroundColor(pal.textMuted)
                        }
                    }
                }
                .padding(.bottom, 40)
            }
        }
    }
    
    private var progressBar: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(pal.card).frame(height: 6)
                Capsule().fill(pal.primary).frame(width: geo.size.width * CGFloat(step + 1) / CGFloat(totalSteps), height: 6)
            }
        }
        .frame(height: 6)
        .padding(.horizontal, 40)
        .padding(.top, 20)
    }
    
    private var isStepValid: Bool {
        if step == storySteps.count {
            return !tempUsername.trimmingCharacters(in: .whitespaces).isEmpty
        }
        return true
    }
    
    private func handleNext() {
        if step < totalSteps - 1 {
            withAnimation(.spring()) { step += 1 }
        } else {
            // Final step (Level Selection)
            user.username = tempUsername.isEmpty ? "Explorador" : tempUsername
            user.levelIdx = selectedLevelIdx
            onComplete()
        }
    }
    
    private func storyView(_ stepData: OnboardingStep) -> some View {
        VStack(spacing: 30) {
            Spacer()
            
            if step == 2 { // Gana tus Créditos
                CurrencyValueCard()
                    .padding(.horizontal, 40)
                    .onAppear {
                        TTSManager.shared.speak(stepData.description)
                    }
            } else {
                ChispaMascotView(size: 150)
                    .onAppear {
                        TTSManager.shared.speak(stepData.description)
                    }
            }
            
            VStack(spacing: 20) {
                Text(stepData.title)
                    .font(.system(size: 40, weight: .black, design: .rounded))
                    .multilineTextAlignment(.center)
                    .lineSpacing(-5)
                    .foregroundColor(pal.text)
                
                Text(stepData.description)
                    .font(.system(size: 17, weight: .medium, design: .rounded))
                    .multilineTextAlignment(.center)
                    .foregroundColor(pal.text.opacity(0.9))
                    .padding(.horizontal, 40)
                    .lineSpacing(4)
            }
            .padding(.bottom, 20)
        }
    }
    
    private var usernameView: some View {
        VStack(spacing: 32) {
            Spacer()
            Text("🚀\n¿Cómo te llamamos?")
                .font(.system(size: 32, weight: .black, design: .rounded))
                .multilineTextAlignment(.center)
                .foregroundColor(pal.text)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("NOMBRE DE EXPLORADOR")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                    .foregroundColor(pal.primary)
                
                TextField("Escribe tu nombre...", text: $tempUsername)
                    .font(.system(size: 20, weight: .bold, design: .rounded))
                    .padding(20)
                    .background(pal.card)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(pal.primary.opacity(0.3), lineWidth: 2))
                    .foregroundColor(pal.text)
                    .submitLabel(.done)
            }
            .padding(.horizontal, 40)
            Spacer()
        }
    }
    
    private var avatarView: some View {
        VStack(spacing: 32) {
            Spacer()
            Text("👨‍🚀\nCrea tu Avatar")
                .font(.system(size: 32, weight: .black, design: .rounded))
                .multilineTextAlignment(.center)
                .foregroundColor(pal.text)
            
            ZStack {
                Circle()
                    .fill(pal.card)
                    .frame(width: 200, height: 200)
                AvatarView(state: user.avatar, size: 180)
            }
            
            VStack(alignment: .leading, spacing: 12) {
                Text("COLOR DEL CASCO")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                    .foregroundColor(pal.primary)
                    .padding(.leading, 8)
                
                HStack(spacing: 16) {
                    ForEach(user.avatar.helmetOptions, id: \.self) { color in
                        Circle()
                            .fill(color)
                            .frame(width: 44, height: 44)
                            .overlay(Circle().stroke(user.avatar.helmetColor == color ? pal.primary : Color.clear, lineWidth: 3))
                            .onTapGesture { 
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                user.avatar.helmetColor = color 
                            }
                    }
                }
            }
            Spacer()
        }
    }
    
    private var levelSelectionView: some View {
        VStack(spacing: 32) {
            Spacer()
            Text("📈\n¿Cuánto sabes?")
                .font(.system(size: 32, weight: .black, design: .rounded))
                .multilineTextAlignment(.center)
                .foregroundColor(pal.text)
            
            VStack(spacing: 16) {
                levelOption(idx: 0, title: "Nuevo", desc: "No sé nada de esto.")
                levelOption(idx: 1, title: "Explorador", desc: "Conozco lo básico.")
                levelOption(idx: 2, title: "Avanzado", desc: "Ya he hecho misiones.")
            }
            .padding(.horizontal, 40)
            Spacer()
        }
    }
    
    private func levelOption(idx: Int, title: String, desc: String) -> some View {
        Button {
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            selectedLevelIdx = idx
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .black, design: .rounded))
                    Text(desc)
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundColor(pal.textMuted)
                }
                Spacer()
                if selectedLevelIdx == idx {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(pal.primary)
                        .font(.system(size: 24))
                }
            }
            .padding(20)
            .background(selectedLevelIdx == idx ? pal.primary.opacity(0.1) : pal.card)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(selectedLevelIdx == idx ? pal.primary : pal.border, lineWidth: 2))
            .foregroundColor(pal.text)
        }
    }
}

struct OnboardingStep {
    let title: String
    let description: String
    let icon: String
}

// MARK: - Tarjeta de Valor de Moneda (Onboarding)
struct CurrencyValueCard: View {
    @Environment(\.jopiPalette) var pal
    @State private var animate = false
    
    var body: some View {
        ZStack {
            // Fondo con resplandor
            RoundedRectangle(cornerRadius: 24)
                .fill(pal.card.opacity(0.8))
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(
                            LinearGradient(colors: [pal.primary, pal.secondary], startPoint: .topLeading, endPoint: .bottomTrailing),
                            lineWidth: 2
                        )
                )
            
            HStack(spacing: 20) {
                // Lado de Puntos
                VStack(spacing: 4) {
                    Text("100")
                        .font(.system(size: 32, weight: .black, design: .rounded))
                        .foregroundColor(pal.secondary)
                    Text("PUNTOS")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(pal.textMuted)
                }
                
                Image(systemName: "equal")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(pal.primary)
                
                // Lado de Pesos
                VStack(spacing: 4) {
                    Text("$50")
                        .font(.system(size: 32, weight: .black, design: .rounded))
                        .foregroundColor(.green)
                    Text("PESOS")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(pal.textMuted)
                }
            }
            .padding(30)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 120)
        .scaleEffect(animate ? 1.05 : 1.0)
        .shadow(color: pal.primary.opacity(0.3), radius: animate ? 20 : 10)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                animate = true
            }
        }
    }
}
