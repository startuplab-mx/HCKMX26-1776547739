import SwiftUI

struct AvatarEditorView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    // Lista de accesorios disponibles en el juego para mapear IDs a nombres
    let accessoryNames: [String: String] = [
        "acc_cap": "Gorra",
        "acc_headphones": "Audífonos",
        "acc_chain": "Cadena",
        "acc_crown": "Corona"
    ]
    
    var body: some View {
        ZStack {
            pal.bg.ignoresSafeArea()
            
            VStack(spacing: 0) {
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        previewSection
                        
                        VStack(alignment: .leading, spacing: 32) {
                            helmetColorSection
                            visorColorSection
                            accessoriesSection
                        }
                        .padding(.horizontal, 24)
                        
                        Spacer(minLength: 40)
                    }
                }
                
                footerSection
            }
        }
        .navigationTitle("Vestidor Espacial")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    // MARK: - Subviews
    
    private var previewSection: some View {
        ZStack {
            Circle()
                .fill(pal.card.opacity(0.8))
                .frame(width: 260, height: 260)
                .shadow(color: pal.primary.opacity(0.3), radius: 20)
            
            AvatarView(state: user.avatar, size: 230)
        }
        .padding(.top, 20)
    }
    
    private var helmetColorSection: some View {
        selectionRow(title: "Color del Casco", options: user.avatar.helmetOptions, selection: Binding(
            get: { user.avatar.helmetColor },
            set: { user.avatar.helmetColor = $0 }
        ))
    }
    
    private var visorColorSection: some View {
        selectionRow(title: "Color del Visor", options: user.avatar.visorOptions, selection: Binding(
            get: { user.avatar.visorColor },
            set: { user.avatar.visorColor = $0 }
        ))
    }
    
    private var accessoriesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Tus Accesorios")
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundColor(pal.textMuted)
            
            let ownedAccs = Array(user.purchasedItemIds.filter { $0.hasPrefix("acc_") }).sorted()
            
            if ownedAccs.isEmpty {
                Text("Aún no tienes accesorios. ¡Visita la tienda!")
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(pal.textMuted.opacity(0.6))
                    .padding(.vertical, 8)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        // Opción de quitar accesorio
                        accessoryButton(id: nil, label: "Ninguno")
                        
                        ForEach(ownedAccs, id: \.self) { id in
                            accessoryButton(id: id, label: accessoryNames[id] ?? "Objeto")
                        }
                    }
                }
            }
        }
    }
    
    private func accessoryButton(id: String?, label: String) -> some View {
        let isSelected = user.avatar.equippedAccessoryId == id
        
        return Button {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            withAnimation(.spring()) {
                user.avatar.equippedAccessoryId = id
            }
        } label: {
            Text(label)
                .font(.system(size: 15, weight: .bold, design: .rounded))
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(isSelected ? pal.primary : pal.card)
                .foregroundColor(isSelected ? .white : pal.text)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(isSelected ? pal.primary : pal.border, lineWidth: 2)
                )
        }
    }
    
    private var footerSection: some View {
        VStack(spacing: 0) {
            Divider().background(pal.border)
            JopiButton(title: "¡Me veo genial!") {
                dismiss()
            }
            .padding(24)
        }
        .background(pal.bg)
    }
    
    private func selectionRow(title: String, options: [Color], selection: Binding<Color>) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundColor(pal.textMuted)
            
            HStack(spacing: 16) {
                ForEach(options, id: \.self) { color in
                    Circle()
                        .fill(color)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Circle()
                                .stroke(selection.wrappedValue == color ? pal.primary : Color.clear, lineWidth: 3)
                                .padding(-4)
                        )
                        .shadow(color: selection.wrappedValue == color ? pal.primary.opacity(0.3) : Color.clear, radius: 5)
                        .onTapGesture {
                            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                            selection.wrappedValue = color
                        }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        AvatarEditorView()
            .environment(JopiUserData())
            .environment(\.jopiPalette, .cosmicDark)
    }
}
