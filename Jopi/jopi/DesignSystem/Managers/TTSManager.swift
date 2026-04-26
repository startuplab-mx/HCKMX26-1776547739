import Foundation
import AVFoundation
import Observation

@MainActor
@Observable
class TTSManager: NSObject, AVSpeechSynthesizerDelegate {
    static let shared = TTSManager()
    
    private let synthesizer = AVSpeechSynthesizer()
    var isSpeaking = false
    
    private override init() {
        super.init()
        synthesizer.delegate = self
        // Configuración de audio para asegurar que suene incluso en silencio
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Error configurando AVAudioSession para TTS: \(error)")
        }
    }
    
    func speak(_ text: String, language: String = "es-MX") {
        // Detener habla actual si la hay
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language)
        utterance.rate = 0.45 // Un poco más lento para los niños
        utterance.pitchMultiplier = 1.1 // Un tono un poco más amigable y alto
        utterance.volume = 1.0
        
        synthesizer.speak(utterance)
    }
    
    func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
    }
    
    // MARK: - AVSpeechSynthesizerDelegate
    
    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        Task { @MainActor in
            self.isSpeaking = true
        }
    }
    
    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        Task { @MainActor in
            self.isSpeaking = false
        }
    }
    
    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        Task { @MainActor in
            self.isSpeaking = false
        }
    }
}
