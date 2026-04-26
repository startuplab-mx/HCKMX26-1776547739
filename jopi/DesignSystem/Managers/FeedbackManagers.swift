import SwiftUI
import UIKit
import AVFoundation
import AudioToolbox

// MARK: - Haptic Manager
class HapticManager {
    static let shared = HapticManager()
    
    private let isSimulator: Bool = {
        #if targetEnvironment(simulator)
        return true
        #else
        return false
        #endif
    }()
    
    func play(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
        guard !isSimulator else { return }
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }
    
    func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        guard !isSimulator else { return }
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(type)
    }
    
    func pop() {
        play(.medium)
    }
}

// MARK: - Audio Manager
class AudioManager {
    static let shared = AudioManager()
    
    private let isSimulator: Bool = {
        #if targetEnvironment(simulator)
        return true
        #else
        return false
        #endif
    }()
    
    private var musicPlayer: AVAudioPlayer?
    
    enum Sound {
        case pop
        case success
        case error
        case fanfare
        
        var systemSoundID: SystemSoundID {
            switch self {
            case .pop: return 1104
            case .success: return 1016
            case .error: return 1053
            case .fanfare: return 1333
            }
        }
    }
    
    func play(_ sound: Sound) {
        guard !isSimulator else { return }
        AudioServicesPlaySystemSound(sound.systemSoundID)
    }
    
    // --- Lógica de Música de Fondo ---
    
    func startBackgroundMusic() {
        if let player = musicPlayer, player.isPlaying {
            return
        }
        
        // Configurar la sesión de audio para que permita música de fondo
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("❌ Error configurando AVAudioSession: \(error)")
        }
        
        if musicPlayer == nil {
            guard let url = Bundle.main.url(forResource: "jopi_ambient", withExtension: "mp3") else {
                print("🔊 Error: No se encontró 'jopi_ambient.mp3' en el bundle principal.")
                return
            }
            
            do {
                musicPlayer = try AVAudioPlayer(contentsOf: url)
                musicPlayer?.numberOfLoops = -1 // Loop infinito
                musicPlayer?.volume = 0.3
                musicPlayer?.prepareToPlay()
                print("✅ Música cargada correctamente desde \(url.lastPathComponent)")
            } catch {
                print("❌ Error al inicializar AVAudioPlayer: \(error)")
                return
            }
        }
        
        musicPlayer?.play()
        print("▶️ Reproduciendo música...")
    }
    
    func stopBackgroundMusic() {
        musicPlayer?.pause()
    }
    
    func setMusicVolume(_ volume: Float) {
        musicPlayer?.setVolume(volume, fadeDuration: 1.0) // Transición suave de 1 segundo
    }
}
