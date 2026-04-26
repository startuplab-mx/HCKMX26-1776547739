import SwiftUI

struct AvatarView: View {
    let state: AvatarState
    var size: CGFloat = 200
    
    var body: some View {
        ZStack {
            // Traje de Astronauta (Cuerpo)
            Circle()
                .fill(bodyColor)
                .frame(width: size * 0.7, height: size * 0.7)
                .offset(y: size * 0.2)
                .overlay(
                    Group {
                        if state.equippedSkinId == "skin_gamer" {
                            HStack(spacing: size * 0.1) {
                                Circle().fill(Color.red.opacity(0.8)).frame(width: size * 0.05)
                                Circle().fill(Color.blue.opacity(0.8)).frame(width: size * 0.05)
                            }
                            .offset(y: size * 0.15)
                        }
                    }
                )
            
            // ACCESORIO: CADENA (Debajo del casco)
            if state.equippedAccessoryId == "acc_chain" {
                Circle()
                    .trim(from: 0, to: 0.5)
                    .stroke(Color.yellow, lineWidth: size * 0.04)
                    .frame(width: size * 0.5, height: size * 0.5)
                    .rotationEffect(.degrees(0))
                    .offset(y: size * 0.1)
            }
            
            // Casco Principal
            Circle()
                .fill(state.equippedSkinId == "skin_gamer" ? Color(hex: "1A1A1A") : state.helmetColor)
                .frame(width: size * 0.6, height: size * 0.6)
                .shadow(color: .black.opacity(0.1), radius: 5)
                .overlay(
                    Group {
                        if state.equippedSkinId == "skin_gamer" {
                            Circle()
                                .stroke(Color.red.opacity(0.5), lineWidth: 2)
                                .padding(2)
                        }
                    }
                )
            
            // Visor
            Capsule()
                .fill(
                    LinearGradient(
                        colors: [visorColor, visorColor.opacity(0.7)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: size * 0.45, height: size * 0.35)
                .overlay(
                    // Brillo del visor
                    Capsule()
                        .fill(Color.white.opacity(0.3))
                        .frame(width: size * 0.2, height: size * 0.05)
                        .rotationEffect(.degrees(-15))
                        .offset(x: -size * 0.05, y: -size * 0.08)
                )
            
            // ACCESORIOS DE CABEZA
            Group {
                if state.equippedAccessoryId == "acc_headphones" {
                    // Audífonos
                    HStack(spacing: size * 0.5) {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.blue)
                            .frame(width: size * 0.1, height: size * 0.2)
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.blue)
                            .frame(width: size * 0.1, height: size * 0.2)
                    }
                    .offset(y: -size * 0.05)
                    
                    Circle()
                        .trim(from: 0.5, to: 1.0)
                        .stroke(Color.blue, lineWidth: size * 0.04)
                        .frame(width: size * 0.6, height: size * 0.6)
                        .offset(y: -size * 0.05)
                } else if state.equippedAccessoryId == "acc_cap" {
                    // Gorra
                    VStack(spacing: 0) {
                        Rectangle()
                            .fill(Color.red)
                            .frame(width: size * 0.4, height: size * 0.1)
                            .cornerRadius(10, corners: [.topLeft, .topRight])
                        Rectangle()
                            .fill(Color.red)
                            .frame(width: size * 0.55, height: size * 0.05)
                            .offset(x: size * 0.1)
                    }
                    .offset(y: -size * 0.28)
                } else if state.equippedAccessoryId == "acc_crown" {
                    // Corona
                    Image(systemName: "crown.fill")
                        .font(.system(size: size * 0.25))
                        .foregroundColor(.yellow)
                        .offset(y: -size * 0.35)
                        .shadow(color: .orange, radius: 10)
                }
            }
            
            // Antena (Solo si no hay audífonos)
            if state.equippedAccessoryId != "acc_headphones" {
                Capsule()
                    .fill(state.equippedSkinId == "skin_gamer" ? Color.red : Color.gray)
                    .frame(width: size * 0.02, height: size * 0.15)
                    .offset(x: size * 0.25, y: -size * 0.2)
                
                Circle()
                    .fill(state.currentBelt.color)
                    .frame(width: size * 0.05, height: size * 0.05)
                    .offset(x: size * 0.25, y: -size * 0.28)
            }
            
            // CINTA / RANGO
            VStack {
                Spacer()
                Rectangle()
                    .fill(state.currentBelt.color)
                    .frame(width: size * 0.3, height: size * 0.06)
                    .cornerRadius(4)
                    .overlay(
                        Text(state.currentBelt.rawValue.prefix(1))
                            .font(.system(size: size * 0.04, weight: .black))
                            .foregroundColor(state.currentBelt == .blanca ? .black : .white)
                    )
            }
            .frame(height: size)
            .offset(y: size * 0.25)
            
            if state.equippedSkinId == "skin_gamer" {
                Circle()
                    .stroke(Color.cyan, lineWidth: 1)
                    .frame(width: size * 0.55, height: size * 0.55)
                    .opacity(0.6)
            }
        }
        .frame(width: size, height: size)
    }
    
    private var bodyColor: Color {
        if state.equippedSkinId == "skin_gamer" {
            return Color(hex: "2D2D2D")
        }
        return .white
    }
    
    private var visorColor: Color {
        if state.equippedSkinId == "skin_gamer" {
            return Color.red
        }
        return state.visorColor
    }
}

// Helper para redondear esquinas específicas
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}
