import Foundation
import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()
    
    private init() {}
    
    func requestPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { success, error in
            if success {
                print("✅ Permiso de notificaciones concedido.")
            } else if let error = error {
                print("❌ Error en permisos: \(error.localizedDescription)")
            }
        }
    }
    
    /// Programa un recordatorio si el usuario no ha entrado en un tiempo
    func scheduleStreakReminder() {
        // Limpiar notificaciones previas
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        
        let notificationContent = UNMutableNotificationContent()
        notificationContent.title = "🚀 ¡Explorador, tu racha peligra!"
        notificationContent.body = "Vuelve a la base para completar tu misión diaria y mantener encendido tu fuego."
        notificationContent.sound = .default
        
        // Disparar en 24 horas si no ha vuelto a entrar
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 86400, repeats: false)
        let request = UNNotificationRequest(identifier: "streak_reminder", content: notificationContent, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func sendInstantNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
}
