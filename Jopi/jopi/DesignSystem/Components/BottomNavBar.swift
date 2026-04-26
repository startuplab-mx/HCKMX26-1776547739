import SwiftUI

struct JopiBottomNavBar: View {
    @Binding var selectedTab: JopiTab
    @Environment(\.jopiPalette) var pal
    
    // Animación extra para el icono pulsado
    @State private var pressedTab: JopiTab? = nil
    
    var body: some View {
        ZStack {
            // Fondo Flotante Estilo Nube/Cápsula
            HStack(spacing: 0) {
                ForEach(JopiTab.allCases, id: \.self) { tab in
                    Button {
                        HapticManager.shared.play(.light)
                        AudioManager.shared.play(.pop)
                        
                        // Efecto de rebote extra rápido
                        pressedTab = tab
                        withAnimation(.spring(response: 0.2, dampingFraction: 0.5)) {
                            selectedTab = tab
                        }
                        
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                            pressedTab = nil
                        }
                    } label: {
                        VStack(spacing: 6) {
                            ZStack {
                                if selectedTab == tab {
                                    Circle()
                                        .fill(tab == .wallet ? pal.secondary.opacity(0.2) : pal.primary.opacity(0.2))
                                        .frame(width: 44, height: 44)
                                        .shadow(color: (tab == .wallet ? pal.secondary : pal.primary).opacity(0.3), radius: 10)
                                        .transition(.scale.combined(with: .opacity))
                                }
                                
                                Image(systemName: tab.rawValue)
                                    .font(.system(size: 24, weight: selectedTab == tab ? .black : .bold, design: .rounded))
                                    .foregroundColor(selectedTab == tab ? (tab == .wallet ? pal.secondary : pal.primary) : pal.textMuted.opacity(0.6))
                            }
                            .scaleEffect(pressedTab == tab ? 0.8 : (selectedTab == tab ? 1.1 : 1.0))
                            .animation(.spring(response: 0.3, dampingFraction: 0.5), value: pressedTab)
                            .animation(.spring(response: 0.4, dampingFraction: 0.6), value: selectedTab)
                            
                            if selectedTab == tab {
                                Text(tab.title)
                                    .font(.system(size: 10, weight: .black, design: .rounded))
                                    .foregroundColor(tab == .wallet ? pal.secondary : pal.primary)
                                    .transition(.move(edge: .bottom).combined(with: .opacity))
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(pal.bg.opacity(0.8))
                    .background(Capsule().fill(.ultraThinMaterial))
                    .shadow(color: Color.black.opacity(0.2), radius: 15, x: 0, y: 10)
            )
            .overlay(
                Capsule()
                    .stroke(pal.border.opacity(0.2), lineWidth: 1.5)
            )
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
    }
}

