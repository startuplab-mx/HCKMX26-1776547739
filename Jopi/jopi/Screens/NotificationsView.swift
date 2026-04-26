import SwiftUI

struct JopiNotification: Identifiable {
    let id = UUID()
    let title: String
    let message: String
    let icon: String
    let color: Color
    let time: String
    let isRead: Bool
}

struct NotificationsView: View {
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    let notifications = [
        JopiNotification(title: "¡Misión Cumplida!", message: "Tu amigo @astro_cat acaba de conquistar Lumina.", icon: "star.fill", color: .yellow, time: "Hace 5m", isRead: false),
        JopiNotification(title: "Regalo de la Base", message: "Has recibido 50 Chispas por tu racha de 300 días.", icon: "gift.fill", color: .orange, time: "Hace 1h", isRead: false),
        JopiNotification(title: "Nuevo Curso", message: "¡Ya está disponible 'Robots Galácticos'!", icon: "cpu", color: .blue, time: "Hace 3h", isRead: true),
        JopiNotification(title: "Recordatorio", message: "No olvides tu entrenamiento diario de Python.", icon: "bell.fill", color: .red, time: "Ayer", isRead: true)
    ]
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(pal.text)
                            .frame(width: 44, height: 44)
                            .background(pal.card)
                            .cornerRadius(12)
                    }
                    Spacer()
                    Text("Mensajes de la Base")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                    Spacer()
                    Button(action: { }) {
                        Text("Leer todo")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(pal.primary)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 20)
                
                if notifications.isEmpty {
                    emptyState
                } else {
                    ScrollView(showsIndicators: false) {
                        VStack(spacing: 16) {
                            ForEach(notifications) { notification in
                                notificationRow(notification: notification)
                            }
                        }
                        .padding(24)
                        
                        Spacer(minLength: 100)
                    }
                }
            }
        }
    }
    
    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()
            ChispaMascotView(size: 150)
            Text("Todo tranquilo en el radar.")
                .font(.system(size: 20, weight: .black, design: .rounded))
                .foregroundColor(pal.text)
            Text("Vuelve más tarde para ver nuevas actualizaciones.")
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundColor(pal.textMuted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Spacer()
        }
    }
    
    private func notificationRow(notification: JopiNotification) -> some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(notification.color.opacity(0.15))
                    .frame(width: 50, height: 50)
                Image(systemName: notification.icon)
                    .foregroundColor(notification.color)
                    .font(.system(size: 20))
            }
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(notification.title)
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(pal.text)
                    Spacer()
                    Text(notification.time)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .foregroundColor(pal.textMuted)
                }
                
                Text(notification.message)
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundColor(pal.text.opacity(0.7))
                    .lineLimit(2)
            }
            
            if !notification.isRead {
                Circle()
                    .fill(pal.primary)
                    .frame(width: 8, height: 8)
            }
        }
        .padding(16)
        .background(pal.card.opacity(notification.isRead ? 0.4 : 0.8))
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(notification.isRead ? Color.clear : pal.primary.opacity(0.3), lineWidth: 1)
        )
    }
}
