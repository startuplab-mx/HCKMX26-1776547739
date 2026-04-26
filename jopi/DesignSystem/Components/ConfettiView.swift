import SwiftUI

struct ConfettiPiece: Identifiable {
    let id = UUID()
    var x: CGFloat
    var y: CGFloat
    var color: Color
    var size: CGFloat
    var velocityY: CGFloat
    var velocityX: CGFloat
    var rotation: Double
}

struct ConfettiView: View {
    @State private var pieces: [ConfettiPiece] = []
    let colors: [Color]
    var duration: Double = 3.0
    
    var body: some View {
        ZStack {
            ForEach(pieces) { piece in
                Image(systemName: "star.fill")
                    .resizable()
                    .frame(width: piece.size, height: piece.size)
                    .foregroundColor(piece.color)
                    .position(x: piece.x, y: piece.y)
                    .rotationEffect(.degrees(piece.rotation))
                    .shadow(color: piece.color.opacity(0.5), radius: 3)
            }
        }
        .onAppear {
            createConfetti()
            animateConfetti()
        }
    }
    
    private func createConfetti() {
        let count = 40
        for _ in 0..<count {
            pieces.append(ConfettiPiece(
                x: CGFloat.random(in: 0...400),
                y: -20,
                color: colors.randomElement() ?? .yellow,
                size: CGFloat.random(in: 10...20),
                velocityY: CGFloat.random(in: 2...6),
                velocityX: CGFloat.random(in: -2...2),
                rotation: Double.random(in: 0...360)
            ))
        }
    }
    
    private func animateConfetti() {
        let timer = Timer.scheduledTimer(withTimeInterval: 0.02, repeats: true) { timer in
            for i in 0..<pieces.count {
                pieces[i].y += pieces[i].velocityY
                pieces[i].x += pieces[i].velocityX
                pieces[i].rotation += 5
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            timer.invalidate()
            pieces.removeAll()
        }
    }
}
