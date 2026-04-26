import SwiftUI
import AVKit

struct JopiVideoPlayer: View {
    let url: URL
    @State private var player: AVPlayer?
    
    var body: some View {
        ZStack {
            if let player = player {
                VideoPlayerContainer(player: player)
                    .onAppear {
                        // Silenciamos la música de fondo por completo para el video
                        AudioManager.shared.setMusicVolume(0.0)
                        player.play()
                    }
                    .onDisappear {
                        // Restauramos la música al salir del video
                        AudioManager.shared.setMusicVolume(0.3)
                        player.pause()
                    }
            } else {
                Color.black
                ProgressView().tint(.white)
            }
        }
        .onAppear {
            setupPlayer()
        }
    }
    
    private func setupPlayer() {
        do {
            // Usamos .duckOthers para que el sistema nos ayude, 
            // pero mantenemos el control manual para máxima precisión.
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback, options: [])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("❌ Error Audio Session Video: \(error)")
        }

        let player = AVPlayer(url: url)
        player.actionAtItemEnd = .none
        
        // Loop infinito
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem,
            queue: .main) { _ in
                player.seek(to: .zero)
                player.play()
            }
        
        self.player = player
    }
}

struct VideoPlayerContainer: UIViewControllerRepresentable {
    var player: AVPlayer?
    
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = player
        controller.showsPlaybackControls = false
        controller.videoGravity = .resizeAspectFill
        return controller
    }
    
    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        uiViewController.player = player
    }
}
