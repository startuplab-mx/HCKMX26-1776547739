import SwiftUI

struct ContentView: View {
    @State private var userData = JopiUserData()
    
    var body: some View {
        Group {
            if userData.isAuthenticated {
                if userData.hasCompletedOnboarding {
                    MainTabView()
                        .environment(userData)
                        .environment(\.jopiPalette, userData.currentTheme.palette)
                } else {
                    OnboardingView(onComplete: {
                        withAnimation(.spring(response: 0.8, dampingFraction: 0.8)) {
                            userData.hasCompletedOnboarding = true
                        }
                    })
                    .environment(userData)
                    .environment(\.jopiPalette, userData.currentTheme.palette)
                }
            } else {
                AuthView()
                    .environment(userData)
                    .environment(\.jopiPalette, userData.currentTheme.palette)
            }
        }
        .preferredColorScheme(userData.currentTheme == .dark ? .dark : .light)
        .onAppear {
            NotificationManager.shared.requestPermission()
        }
    }
}

struct MainTabView: View {
    @Environment(JopiUserData.self) var userData
    @State private var selectedTab: JopiTab = .home
    @State private var showingLesson = false
    
    var body: some View {
        ZStack(alignment: .bottom) {
            userData.currentTheme.palette.bg.ignoresSafeArea()
            
            VStack(spacing: 0) {
                Group {
                    switch selectedTab {
                    case .home:
                        HomeView(showingLesson: $showingLesson)
                    case .courses:
                        CoursesView()
                    case .wallet:
                        WalletView()
                    case .community:
                        CommunityView()
                    case .profile:
                        ProfileView()
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                Color.clear.frame(height: 80)
            }
            
            JopiBottomNavBar(selectedTab: $selectedTab)
        }
        .fullScreenCover(isPresented: $showingLesson) {
            LessonView()
                .environment(\.jopiPalette, userData.currentTheme.palette)
        }
        .fullScreenCover(item: Bindable(userData).pendingLevelUp) { level in
            LevelUpView(level: level)
                .environment(userData)
                .environment(\.jopiPalette, userData.currentTheme.palette)
        }
        .fullScreenCover(item: Bindable(userData).newlyEarnedBadge) { badge in
            BadgeCelebrationView(badge: badge)
                .environment(userData)
                .environment(\.jopiPalette, userData.currentTheme.palette)
        }
        .ignoresSafeArea(.keyboard)
    }
}

#Preview {
    ContentView()
}
