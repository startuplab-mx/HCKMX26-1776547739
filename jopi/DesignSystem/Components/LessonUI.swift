import SwiftUI

struct JopiLessonProgressView: View {
    var progress: Double
    @Environment(\.jopiPalette) var pal
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        HStack(spacing: 16) {
            Button(action: { dismiss() }) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 28))
                    .foregroundColor(pal.textMuted.opacity(0.5))
            }
            
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(pal.card)
                        .frame(height: 14)
                    
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [pal.primary, pal.tertiary],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geo.size.width * CGFloat(progress), height: 14)
                        .shadow(color: pal.primary.opacity(0.4), radius: 6)
                }
            }
            .frame(height: 14)
            
            HStack(spacing: 6) {
                Image(systemName: "heart.fill")
                    .font(.system(size: 18))
                    .foregroundColor(.red)
                    .shadow(color: .red.opacity(0.4), radius: 5)
                
                Text("3")
                    .font(.system(size: 18, weight: .black, design: .rounded))
                    .foregroundColor(pal.text)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(pal.card)
            .cornerRadius(16)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }
}
