import SwiftUI

struct AuthView: View {
    @Environment(JopiUserData.self) var user
    @Environment(\.jopiPalette) var pal
    
    @State private var email = ""
    @State private var password = ""
    @State private var username = "" // NUEVO: Campo para nombre
    @State private var isLogin = true
    @State private var isLoading = false
    
    var body: some View {
        ZStack {
            SpaceBackgroundView()
            OrbitDecoration()
            
            VStack(spacing: 30) {
                Spacer()
                
                // LOGO HERO
                VStack(spacing: 16) {
                    Image(systemName: "rocket")
                        .font(.system(size: 60))
                        .foregroundColor(pal.primary)
                        .shadow(color: pal.primary.opacity(0.5), radius: 20)
                    
                    Text("JOPI")
                        .font(.system(size: 44, weight: .black, design: .rounded))
                        .foregroundColor(pal.text)
                }
                
                VStack(spacing: 20) {
                    Text(isLogin ? "¡Bienvenido de vuelta!" : "Crea tu cuenta espacial")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(pal.tertiary)
                    
                    VStack(spacing: 16) {
                        if !isLogin {
                            customTextField(placeholder: "Tu apodo espacial (Ej. @astro_lucas)", text: $username, icon: "at")
                        }
                        customTextField(placeholder: "Tu email estelar", text: $email, icon: "envelope.fill")
                        customTextField(placeholder: "Contraseña secreta", text: $password, icon: "lock.fill", isSecure: true)
                    }
                    
                    Button(action: handleAuth) {
                        HStack {
                            if isLoading {
                                ProgressView().tint(pal.bg)
                            } else {
                                Text(isLogin ? "INICIAR MISIÓN" : "COMENZAR AVENTURA")
                                    .font(.system(size: 16, weight: .black, design: .rounded))
                            }
                        }
                        .foregroundColor(pal.bg)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(pal.primary)
                        .cornerRadius(16)
                        .shadow(color: pal.primary.opacity(0.4), radius: 10)
                    }
                    .disabled(isLoading || (isLogin ? (email.isEmpty || password.isEmpty) : (email.isEmpty || password.isEmpty || username.isEmpty)))
                    
                    Button(action: { 
                        withAnimation { isLogin.toggle() }
                    }) {
                        Text(isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra aquí")
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundColor(pal.textMuted)
                    }
                }
                .padding(30)
                .background(pal.card.opacity(0.8))
                .cornerRadius(32)
                .overlay(RoundedRectangle(cornerRadius: 32).stroke(pal.border.opacity(0.2), lineWidth: 1.5))
                .padding(.horizontal, 24)
                
                Spacer()
            }
        }
    }
    
    private func customTextField(placeholder: String, text: Binding<String>, icon: String, isSecure: Bool = false) -> some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .foregroundColor(pal.primary)
                .frame(width: 20)
            
            if isSecure {
                SecureField(placeholder, text: text)
                    .autocapitalization(.none)
            } else {
                TextField(placeholder, text: text)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
            }
        }
        .padding(16)
        .background(pal.text.opacity(0.05))
        .cornerRadius(12)
        .foregroundColor(pal.text)
    }
    
    private func handleAuth() {
        isLoading = true
        // SIMULACIÓN DE AUTH
        // En producción aquí llamarías a Supabase.auth.signUp/signIn
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            withAnimation {
                let finalUsername = isLogin ? (user.username == "explorador_jopi" ? email.split(separator: "@").first.map(String.init) ?? "explorador" : user.username) : username
                
                user.completeLogin(
                    id: UUID().uuidString.lowercased(),
                    name: finalUsername
                )
            }
        }
    }
}
