import SwiftUI

struct CoursesView: View {
    @Environment(\.jopiPalette) var pal
    
    let categories = ["Todos", "Tecnología", "Oficios", "Emprender"]
    @State private var selectedCategory = "Todos"
    
    @State private var courses: [Course] = []
    @State private var isLoading = true
    
    var body: some View {
        NavigationStack {
            ZStack {
                SpaceBackgroundView()
                OrbitDecoration()

                VStack(spacing: 0) {
                    // HEADER ORGÁNICO
                    VStack(alignment: .leading, spacing: 6) {
                        Text("¡Aprende cosas nuevas!")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(pal.tertiary)

                        Text("Tu Camino")
                            .font(.system(size: 36, weight: .black, design: .rounded))
                            .foregroundColor(pal.text)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 24)
                    .padding(.top, 20)
                    .padding(.bottom, 20)

                    if isLoading {
                        Spacer()
                        ProgressView().tint(pal.primary).scaleEffect(1.5)
                        Spacer()
                    } else {
                        ScrollView(showsIndicators: false) {
                            VStack(alignment: .leading, spacing: 32) {

                                // FILTROS DE GALAXIA
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 12) {
                                        ForEach(categories, id: \.self) { cat in
                                            Button {
                                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                                selectedCategory = cat
                                            } label: {
                                                Text(cat)
                                                    .font(.system(size: 14, weight: .bold, design: .rounded))
                                                    .padding(.horizontal, 20)
                                                    .padding(.vertical, 12)
                                                    .background(selectedCategory == cat ? pal.tertiary.opacity(0.2) : pal.card)
                                                    .foregroundColor(selectedCategory == cat ? pal.tertiary : pal.textMuted)
                                                    .cornerRadius(24)
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 24)
                                                            .stroke(selectedCategory == cat ? pal.tertiary.opacity(0.5) : pal.border.opacity(0.2), lineWidth: 1.5)
                                                    )
                                                    .animation(.spring(response: 0.2, dampingFraction: 0.7), value: selectedCategory)
                                            }
                                        }
                                    }
                                }
                                
                                // SECCIÓN: MUNDO DE CÓDIGO
                                if !courses.isEmpty {
                                    galaxySection(title: "Cursos Disponibles", icon: "terminal") {
                                        VStack(spacing: 16) {
                                            ForEach(courses) { course in
                                                NavigationLink(destination: CourseTikTokView(initialCourse: course)) {
                                                    CourseGalaxyCard(course: course)
                                                }
                                                .buttonStyle(PlainButtonStyle())
                                            }
                                        }
                                    }
                                } else {
                                    VStack(spacing: 16) {
                                        Image(systemName: "telescope")
                                            .font(.system(size: 48))
                                            .foregroundColor(pal.textMuted.opacity(0.5))
                                        Text("No hay cursos disponibles aún")
                                            .font(.system(size: 16, weight: .bold, design: .rounded))
                                            .foregroundColor(pal.textMuted)
                                        Text("Vuelve pronto para explorar nuevas misiones")
                                            .font(.system(size: 14, weight: .medium, design: .rounded))
                                            .foregroundColor(pal.textMuted.opacity(0.6))
                                            .multilineTextAlignment(.center)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 60)
                                }
                                
                                Spacer(minLength: 120)
                            }
                            .padding(.horizontal, 24)
                        }
                    }
                }
            }
        }
        .task {
            await fetchCourses()
        }
    }
    
    private func fetchCourses() async {
        do {
            // Intentar cargar desde el backend
            let fetchedCourses: [Course] = try await APIService.shared.fetch(endpoint: "/courses")
            await MainActor.run {
                self.courses = fetchedCourses
                self.isLoading = false
            }
        } catch {
            print("Error cargando cursos del backend: \(error). Usando datos locales de emergencia.")
            // Fallback (datos locales si el server no está corriendo o falla)
            await MainActor.run {
                self.courses = [
                    Course(title: "Crea tu primera App", icon: "apps.iphone", progress: 0.4, color: .cyan, lessons: 5, completedLessons: 2),
                    Course(title: "Robots Galácticos", icon: "cpu", progress: 0.0, color: .blue, lessons: 8, completedLessons: 0),
                    Course(title: "Vende tus Ideas", icon: "briefcase", progress: 0.1, color: .purple, lessons: 6, completedLessons: 1)
                ]
                self.isLoading = false
            }
        }
    }
    
    private func galaxySection<Content: View>(title: String, icon: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .foregroundColor(pal.tertiary)
                    .font(.system(size: 18))
                Text(title)
                    .font(.system(size: 18, weight: .black, design: .rounded))
                    .foregroundColor(pal.text)
            }
            content()
        }
    }
}

struct CourseGalaxyCard: View {
    let course: Course
    @Environment(\.jopiPalette) var pal
    
    var body: some View {
        JopiCard(padding: 24) {
            HStack(spacing: 16) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(course.color.opacity(0.15))
                        .frame(width: 54, height: 54)
                    Image(systemName: course.icon)
                        .foregroundColor(course.color)
                        .font(.system(size: 24))
                }
                
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(course.title)
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundColor(pal.text)
                        Spacer()
                        HStack(spacing: 4) {
                            Image(systemName: "bolt.fill")
                                .font(.system(size: 11, weight: .bold))
                            Text("+\(course.lessons * 5)")
                                .font(.system(size: 14, weight: .black, design: .rounded))
                        }
                        .foregroundColor(pal.tertiary)
                    }

                    Text("\(course.lessons) Misiones")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundColor(pal.textMuted)
                        .lineLimit(1)

                    if course.progress > 0 {
                        VStack(alignment: .leading, spacing: 4) {
                            JopiProgressBar(progress: course.progress, color: course.color)
                            Text("\(Int(course.progress * 100))% completado")
                                .font(.system(size: 11, weight: .bold, design: .rounded))
                                .foregroundColor(pal.textMuted)
                        }
                    }
                }
                
                Spacer()
                
                SatelliteView(size: 40, color: course.color)
            }
        }
    }
}
