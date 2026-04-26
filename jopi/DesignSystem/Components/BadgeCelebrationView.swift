import SwiftUI

struct BadgeCelebrationView: View {
    let badge: Badge
    @Environment(\.dismiss) var dismiss
    @Environment(\.jopiPalette) var pal
    
    @State private var showContent = false
    
    var body: some View {
        ZStack {
            pal.bg.opacity(0.95).ignoresSafeArea()
            SpaceBackgroundView()
            
            ConfettiView(colors: [badge.color, pal.text, .yellow])
                .allowsHitTesting(false)
            
            VStack(spacing: 30) {
                Text("¡NUEVO LOGRO!")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                    .foregroundColor(pal.tertiary)
                    .kerning(4)
                
                // MEDALLA GIGANTE
                ZStack {
                    Circle()
                        .fill(badge.color.opacity(0.2))
                        .frame(width: 240, height: 240)
                        .blur(radius: 40)
                    
                    Circle()
                        .stroke(badge.color, lineWidth: 4)
                        .frame(width: 200, height: 200)
                        .opacity(showContent ? 1 : 0)
                        .scaleEffect(showContent ? 1.1 : 0.5)
                    
                    Image(systemName: badge.icon)
                        .font(.system(size: 80))
                        .foregroundColor(badge.color)
                        .shadow(color: badge.color.opacity(0.6), radius: 20)
                        .scaleEffect(showContent ? 1.2 : 0.1)
                        .rotationEffect(.degrees(showContent ? 360 : 0))
                }
                
                VStack(spacing: 12) {
                    Text(badge.title)
                        .font(.system(size: 32, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                    
                    Text(badge.description)
                        .font(.system(size: 18, weight: .medium, design: .rounded))
                        .foregroundColor(pal.text.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 20)
                
                Spacer()
                
                Button(action: { 
                    HapticManager.shared.play(.medium)
                    dismiss() 
                }) {
                    Text("¡GENIAL!")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                        .background(badge.color)
                        .cornerRadius(24)
                }
                .padding(.horizontal, 40)
                .padding(.bottom, 40)
            }
        }
        .onAppear {
            AudioManager.shared.play(.success)
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                showContent = true
            }
        }
    }
}
