import SwiftUI

struct ChispaMascotView: View {
    @State private var isAnimating = false
    @State private var eyesState: EyeState = .normal
    @State private var victoryRotation: Double = 0
    @Environment(\.jopiPalette) var pal
    var size: CGFloat = 100
    var isVictory: Bool = false
    
    enum EyeState { case normal, happy, blinking, hearts }
    
    var body: some View {
        ZStack {
            // Sombra espacial suave
            Ellipse()
                .fill(Color.black.opacity(0.15))
                .frame(width: size * 0.5, height: size * 0.12)
                .offset(y: size * 0.45)
                .scaleEffect(isAnimating ? 1.1 : 0.9)
            
            // Cuerpo del Robot (Jopi-Bot)
            VStack(spacing: size * 0.02) {
                // Cabeza
                RoundedRectangle(cornerRadius: size * 0.15)
                    .fill(pal.primary)
                    .frame(width: size * 0.6, height: size * 0.45)
                    .overlay(
                        // Ojos digitales expresivos
                        HStack(spacing: size * 0.12) {
                            eyeView
                            eyeView
                        }
                    )
                
                // Cuerpo con efecto de rebote
                RoundedRectangle(cornerRadius: size * 0.2)
                    .fill(pal.primary)
                    .frame(width: size * 0.55, height: size * 0.35)
                    .overlay(
                        Circle()
                            .fill(pal.secondary.opacity(0.8))
                            .frame(width: size * 0.15)
                            .shadow(color: pal.secondary, radius: 5)
                    )
            }
            .rotationEffect(.degrees(victoryRotation))
            .scaleEffect(x: isAnimating ? 1.05 : 0.95, y: isAnimating ? 0.95 : 1.05)
            .offset(y: isAnimating ? -size * 0.08 : size * 0.02)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
            startEyeTimer()
        }
        .onChange(of: isVictory) { oldValue, newValue in
            if newValue {
                triggerVictoryAnimation()
            }
        }
    }
    
    private var eyeView: some View {
        Group {
            if eyesState == .blinking {
                Capsule()
                    .fill(Color.white)
                    .frame(width: size * 0.15, height: size * 0.02)
            } else if eyesState == .happy {
                Image(systemName: "chevron.up")
                    .font(.system(size: size * 0.12, weight: .black))
                    .foregroundColor(.white)
            } else if eyesState == .hearts {
                Image(systemName: "heart.fill")
                    .font(.system(size: size * 0.12, weight: .black))
                    .foregroundColor(pal.secondary)
            } else {
                Circle()
                    .fill(Color.white)
                    .frame(width: size * 0.12, height: size * 0.12)
            }
        }
    }
    
    private func triggerVictoryAnimation() {
        eyesState = .hearts
        withAnimation(.spring(response: 0.6, dampingFraction: 0.5)) {
            victoryRotation = 360
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            victoryRotation = 0
            eyesState = .normal
        }
    }
    
    private func startEyeTimer() {
        Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
            if isVictory { return }
            
            withAnimation(.spring()) {
                eyesState = .blinking
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                if isVictory { return }
                withAnimation(.spring()) {
                    eyesState = .normal
                }
            }
            
            // Ocasionalmente feliz
            if Double.random(in: 0...1) > 0.7 {
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    if isVictory { return }
                    withAnimation(.spring()) { eyesState = .happy }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        if isVictory { return }
                        withAnimation(.spring()) { eyesState = .normal }
                    }
                }
            }
        }
    }
}
