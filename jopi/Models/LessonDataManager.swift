import Foundation

class LessonDataManager {
    static let shared = LessonDataManager()
    
    private init() {}
    
    /// Carga lecciones filtradas por curso (preparado para API real)
    func loadLessons(courseId: UUID? = nil) async -> [LessonSet] {
        do {
            var endpoint = "/lessons"
            if let id = courseId {
                endpoint += "?course_id=\(id.uuidString.lowercased())"
            }
            
            let lessons: [LessonSet] = try await APIService.shared.fetch(endpoint: endpoint)
            return lessons
        } catch {
            print("❌ Error cargando lecciones: \(error)")
            return []
        }
    }
}
