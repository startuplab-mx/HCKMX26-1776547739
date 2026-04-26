import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBadges from "@/components/sections/TrustBadges";
import PlatformOverview from "@/components/sections/PlatformOverview";
import DashboardPreview from "@/components/sections/DashboardPreview";
import HowItWorks from "@/components/sections/HowItWorks";
import AIRiskEngine from "@/components/sections/AIRiskEngine";
import UseCases from "@/components/sections/UseCases";
import ResponsibleAI from "@/components/sections/ResponsibleAI";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <TrustBadges />
        <PlatformOverview />
        <DashboardPreview />
        <HowItWorks />
        <AIRiskEngine />
        <UseCases />
        <ResponsibleAI />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
