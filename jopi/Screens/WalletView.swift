import SwiftUI

struct WalletView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal

    @State private var purchasedItem: StoreItem? = nil
    @State private var selectedCategory = "Todos"

    let categories = ["Todos", "Skin", "Accessory", "Service"]

    let catalog: [StoreItem] = [
        StoreItem(id: "skin_gamer", title: "Traje Gamer", price: 450, icon: "gamecontroller.fill", colorHex: "FF3B30", category: "Skin"),
        StoreItem(id: "acc_cap", title: "Gorra Pro", price: 150, icon: "hat.cap.fill", colorHex: "FF4B4B", category: "Accessory"),
        StoreItem(id: "acc_headphones", title: "Audífonos", price: 300, icon: "headphones", colorHex: "007AFF", category: "Accessory"),
        StoreItem(id: "acc_chain", title: "Cadena Oro", price: 600, icon: "link", colorHex: "FFD700", category: "Accessory"),
        StoreItem(id: "acc_crown", title: "Corona", price: 5000, icon: "crown.fill", colorHex: "FFCC00", category: "Accessory"),
        StoreItem(id: "service_movies", title: "Ver Pelis", price: 800, icon: "tv.fill", colorHex: "AF52DE", category: "Service"),
        StoreItem(id: "food_delivery", title: "Comida Rica", price: 1200, icon: "cart.fill", colorHex: "FF9500", category: "Service")
    ]

    private var filteredCatalog: [StoreItem] {
        selectedCategory == "Todos" ? catalog : catalog.filter { $0.category == selectedCategory }
    }

    private func categoryLabel(_ cat: String) -> String {
        switch cat {
        case "Skin": return "Trajes"
        case "Accessory": return "Accesorios"
        case "Service": return "Servicios"
        default: return cat
        }
    }

    var body: some View {
        ZStack {
            SpaceBackgroundView()
            OrbitDecoration()

            VStack(spacing: 0) {
                // HEADER
                VStack(alignment: .leading, spacing: 6) {
                    Text("Tus Logros Estelares")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundColor(pal.tertiary)

                    Text("Tienda Jopi")
                        .font(.system(size: 36, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 24)
                .padding(.top, 20)
                .padding(.bottom, 20)

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .center, spacing: 32) {

                        // BALANCE HERO
                        VStack(spacing: 12) {
                            Text("Tus Chispas")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundColor(pal.textMuted)

                            ZStack {
                                Circle()
                                    .fill(pal.tertiary.opacity(0.12))
                                    .frame(width: 160, height: 160)
                                    .blur(radius: 40)

                                HStack(alignment: .center, spacing: 10) {
                                    Text("\(user.chips)")
                                        .font(.system(size: 64, weight: .black, design: .rounded))
                                        .foregroundColor(pal.text)
                                        .contentTransition(.numericText())
                                    Image(systemName: "bolt.fill")
                                        .font(.system(size: 30, weight: .bold))
                                        .foregroundColor(pal.tertiary)
                                }
                            }
                            .shadow(color: pal.tertiary.opacity(0.3), radius: 20)

                            HStack(spacing: 8) {
                                Image(systemName: "bolt.fill")
                                    .foregroundColor(pal.tertiary)
                                    .font(.system(size: 14, weight: .bold))
                                Text("LISTO PARA USAR")
                                    .font(.system(size: 12, weight: .black, design: .rounded))
                                    .foregroundColor(pal.tertiary)
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(pal.tertiary.opacity(0.15))
                            .cornerRadius(20)
                        }
                        .padding(.top, 12)

                        // TIENDA GRID
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Catálogo Galáctico")
                                .font(.system(size: 18, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)

                            // Filtros de categoría
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(categories, id: \.self) { cat in
                                        Button {
                                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                            withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                                                selectedCategory = cat
                                            }
                                        } label: {
                                            Text(categoryLabel(cat))
                                                .font(.system(size: 13, weight: .bold, design: .rounded))
                                                .padding(.horizontal, 16)
                                                .padding(.vertical, 10)
                                                .background(selectedCategory == cat ? pal.secondary.opacity(0.2) : pal.card)
                                                .foregroundColor(selectedCategory == cat ? pal.secondary : pal.textMuted)
                                                .cornerRadius(20)
                                                .overlay(
                                                    RoundedRectangle(cornerRadius: 20)
                                                        .stroke(selectedCategory == cat ? pal.secondary.opacity(0.5) : pal.border.opacity(0.2), lineWidth: 1.5)
                                                )
                                        }
                                    }
                                }
                            }

                            LazyVGrid(columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)], spacing: 16) {
                                ForEach(filteredCatalog) { item in
                                    RewardGalaxyCard(item: item) {
                                        withAnimation(.spring()) {
                                            self.purchasedItem = item
                                        }
                                    }
                                }
                            }
                        }

                        Spacer(minLength: 120)
                    }
                    .padding(.horizontal, 24)
                }
            }
        }
        .fullScreenCover(item: $purchasedItem) { item in
            ClaimRewardView(item: item)
                .environment(user)
                .environment(\.jopiPalette, pal)
        }
    }
}

struct RewardGalaxyCard: View {
    let item: StoreItem
    var onPurchaseSuccess: () -> Void
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal

    var isPurchased: Bool {
        user.purchasedItemIds.contains(item.id)
    }

    var isEquipped: Bool {
        if item.category == "Skin" {
            return user.avatar.equippedSkinId == item.id
        } else if item.category == "Accessory" {
            return user.avatar.equippedAccessoryId == item.id
        }
        return false
    }

    var canAfford: Bool {
        user.canAfford(item.price)
    }

    var body: some View {
        JopiCard(padding: 16) {
            VStack(alignment: .leading, spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(item.color.opacity(0.15))
                        .frame(height: 80)
                    Image(systemName: item.icon)
                        .font(.system(size: 32))
                        .foregroundColor(item.color)
                        .shadow(color: item.color.opacity(0.3), radius: 5)

                    if isPurchased && item.category != "Service" {
                        Image(systemName: isEquipped ? "checkmark.circle.fill" : "checkmark.seal.fill")
                            .font(.system(size: 24))
                            .foregroundColor(isEquipped ? pal.primary : pal.tertiary)
                            .background(Circle().fill(pal.bg).padding(4))
                            .offset(x: 30, y: -30)
                    }
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(item.title)
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .foregroundColor(pal.text)
                        .lineLimit(1)

                    if isPurchased {
                        Text(item.category == "Service" ? "DESBLOQUEADO" : (isEquipped ? "EQUIPADO" : "OBTENIDO"))
                            .font(.system(size: 12, weight: .black, design: .rounded))
                            .foregroundColor(isEquipped ? pal.primary : pal.tertiary)
                    } else {
                        HStack(spacing: 4) {
                            Text("\(item.price)")
                                .font(.system(size: 14, weight: .black, design: .rounded))
                            Image(systemName: "bolt.fill")
                                .font(.system(size: 11, weight: .bold))
                        }
                        .foregroundColor(canAfford ? pal.tertiary : pal.secondary.opacity(0.8))
                    }
                }

                Button(action: {
                    if isPurchased {
                        if item.category == "Skin" || item.category == "Accessory" {
                            withAnimation(.spring()) {
                                if item.category == "Skin" {
                                    user.avatar.equippedSkinId = isEquipped ? nil : item.id
                                } else {
                                    user.avatar.equippedAccessoryId = isEquipped ? nil : item.id
                                }
                                HapticManager.shared.play(.light)
                            }
                        }
                    } else if canAfford {
                        Task {
                            do {
                                struct PurchaseRequest: Encodable {
                                    let userId: String
                                    let itemId: String
                                    let price: Int
                                }
                                let request = PurchaseRequest(userId: "default-user-id", itemId: item.id, price: item.price)
                                try await APIService.shared.send(endpoint: "/store/purchase", body: request)
                                await MainActor.run {
                                    if user.purchase(item) {
                                        AudioManager.shared.play(.success)
                                        onPurchaseSuccess()
                                    }
                                }
                            } catch {
                                print("❌ Error en compra: \(error)")
                                if user.purchase(item) {
                                    onPurchaseSuccess()
                                }
                            }
                        }
                    } else {
                        HapticManager.shared.notification(.error)
                        TTSManager.shared.speak("Ups, necesitas más chispas para conseguir este objeto")
                    }
                }) {
                    Text(buttonText)
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(buttonBackground)
                        .foregroundColor(buttonForeground)
                        .cornerRadius(12)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    private var buttonText: String {
        if isPurchased {
            if item.category == "Service" { return "Listo" }
            return isEquipped ? "Desequipar" : "Equipar"
        }
        return canAfford ? "¡Lo quiero!" : "Sin chispas"
    }

    private var buttonBackground: Color {
        if isEquipped { return pal.primary.opacity(0.15) }
        if isPurchased { return pal.tertiary.opacity(0.15) }
        if canAfford { return pal.tertiary.opacity(0.15) }
        return pal.textMuted.opacity(0.1)
    }

    private var buttonForeground: Color {
        if isEquipped { return pal.primary }
        if isPurchased { return pal.tertiary }
        if canAfford { return pal.tertiary }
        return pal.textMuted
    }
}

struct ClaimRewardView: View {
    let item: StoreItem
    @Environment(\.dismiss) var dismiss
    @Environment(\.jopiPalette) var pal
    @Environment(JopiUserData.self) var user

    @State private var showContent = false

    var body: some View {
        ZStack {
            pal.bg.ignoresSafeArea()
            SpaceBackgroundView()

            ConfettiView(colors: [item.color, pal.text, pal.primary])
                .allowsHitTesting(false)

            VStack(spacing: 40) {
                VStack(spacing: 8) {
                    Text("¡OBJETO ADQUIRIDO!")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .foregroundColor(pal.tertiary)
                        .opacity(showContent ? 1 : 0)
                        .offset(y: showContent ? 0 : 20)

                    Text("¡Felicidades!")
                        .font(.system(size: 44, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                        .multilineTextAlignment(.center)
                        .opacity(showContent ? 1 : 0)
                        .offset(y: showContent ? 0 : 20)
                }

                ZStack {
                    Circle()
                        .fill(item.color.opacity(0.2))
                        .frame(width: 200, height: 200)
                        .blur(radius: 20)
                        .scaleEffect(showContent ? 1 : 0.5)

                    Image(systemName: item.icon)
                        .font(.system(size: 100))
                        .foregroundColor(item.color)
                        .shadow(color: item.color.opacity(0.5), radius: 20)
                        .scaleEffect(showContent ? 1.2 : 0.1)
                        .rotationEffect(.degrees(showContent ? 360 : 0))
                }

                VStack(spacing: 12) {
                    Text(item.title)
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(pal.text)

                    Text("Ya puedes encontrar este objeto en tu inventario espacial y usarlo para personalizar tu experiencia.")
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .foregroundColor(pal.textMuted)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                .opacity(showContent ? 1 : 0)

                Spacer()

                Button(action: {
                    HapticManager.shared.play(.medium)
                    dismiss()
                }) {
                    Text("¡RECLAMAR!")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(pal.bg)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                        .background(pal.primary)
                        .cornerRadius(20)
                        .shadow(color: pal.primary.opacity(0.4), radius: 15)
                }
                .padding(.horizontal, 40)
                .padding(.bottom, 40)
                .opacity(showContent ? 1 : 0)
                .offset(y: showContent ? 0 : 50)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7, blendDuration: 0)) {
                showContent = true
            }
        }
    }
}
