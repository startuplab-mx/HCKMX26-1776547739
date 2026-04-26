import SwiftUI

struct CourseDetailView: View {
    let course: Course
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    @State private var showingLesson = false
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            
            VStack(spacing: 0) {
                // Custom Navigation Bar
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
                    Text("Detalles de Misión")
                        .font(.system(size: 17, weight: .bold, design: .rounded))
                        .foregroundColor(pal.text)
                    Spacer()
                    Rectangle().fill(Color.clear).frame(width: 44, height: 44)
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {
                        // Course Header Card
                        JStack {
                            VStack(spacing: 20) {
                                ZStack {
                                    Circle()
                                        .fill(course.color.opacity(0.15))
                                        .frame(width: 100, height: 100)
                                    
                                    Image(systemName: course.icon)
                                        .font(.system(size: 44))
                                        .foregroundColor(course.color)
                                }
                                
                                VStack(spacing: 8) {
                                    Text(course.title)
                                        .font(.system(size: 32, weight: .black, design: .rounded))
                                        .foregroundColor(pal.text)
                                        .multilineTextAlignment(.center)
                                    
                                    Text("\(course.lessons) Lecciones • \(course.completedLessons) Completadas")
                                        .font(.system(size: 16, weight: .bold, design: .rounded))
                                        .foregroundColor(pal.textMuted)
                                }
                                
                                // Progress Bar
                                VStack(spacing: 8) {
                                    HStack {
                                        Text("Progreso")
                                            .font(.system(size: 14, weight: .bold, design: .rounded))
                                            .foregroundColor(pal.textMuted)
                                        Spacer()
                                        Text("\(Int(course.progress * 100))%")
                                            .font(.system(size: 14, weight: .black, design: .rounded))
                                            .foregroundColor(course.color)
                                    }
                                    
                                    GeometryReader { geo in
                                        ZStack(alignment: .leading) {
                                            Capsule()
                                                .fill(pal.border.opacity(0.1))
                                                .frame(height: 10)
                                            
                                            Capsule()
                                                .fill(course.color)
                                                .frame(width: geo.size.width * CGFloat(course.progress), height: 10)
                                                .shadow(color: course.color.opacity(0.4), radius: 4)
                                        }
                                    }
                                    .frame(height: 10)
                                }
                            }
                        }
                        
                        // Description
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Sobre este curso")
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)
                            
                            Text("Domina los fundamentos de la tecnología y prepárate para conquistar el universo digital. En este curso aprenderás paso a paso con misiones interactivas.")
                                .font(.system(size: 17, weight: .medium, design: .rounded))
                                .foregroundColor(pal.text.opacity(0.8))
                                .lineSpacing(6)
                        }
                        
                        // Missions List
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Tu Ruta de Aprendizaje")
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(pal.text)
                            
                            VStack(spacing: 16) {
                                ForEach(1...course.lessons, id: \.self) { i in
                                    missionRow(index: i, isCompleted: i <= course.completedLessons)
                                }
                            }
                        }
                        
                        Spacer(minLength: 120)
                    }
                    .padding(24)
                }
            }
            
            // Bottom Action Button
            VStack {
                Spacer()
                SpaceLaunchButton(title: course.completedLessons == 0 ? "¡EMPEZAR CURSO!" : "CONTINUAR MISIÓN") {
                    showingLesson = true
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 30)
            }
        }
        .fullScreenCover(isPresented: $showingLesson) {
            LessonView()
        }
        .navigationBarHidden(true)
    }
    
    private func missionRow(index: Int, isCompleted: Bool) -> some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(isCompleted ? course.color : pal.card)
                    .frame(width: 40, height: 40)
                
                if isCompleted {
                    Image(systemName: "checkmark")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.white)
                } else {
                    Text("\(index)")
                        .font(.system(size: 16, weight: .black, design: .rounded))
                        .foregroundColor(pal.textMuted)
                }
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Misión \(index): \(missionTitle(for: index))")
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .foregroundColor(isCompleted ? pal.text : pal.text.opacity(0.6))
                
                Text(isCompleted ? "Completada" : "Pendiente")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(isCompleted ? course.color : pal.textMuted)
            }
            
            Spacer()
            
            if !isCompleted && index == course.completedLessons + 1 {
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(course.color)
            }
        }
        .padding(16)
        .background(pal.card.opacity(isCompleted ? 0.3 : 0.6))
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(isCompleted ? course.color.opacity(0.3) : pal.border, lineWidth: 1.5)
        )
    }
    
    private func missionTitle(for index: Int) -> String {
        let titles = ["Primeros Pasos", "Exploración de Datos", "Lógica de Control", "Funciones Estelares", "Misión Final"]
        return titles[(index - 1) % titles.count]
    }
}
