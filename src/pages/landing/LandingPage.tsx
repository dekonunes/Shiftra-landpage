import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ReadyToSection from './components/ReadyToSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import BenefitsSection from './components/BenefitsSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ReadyToSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        {/* TODO Phase 3: Add PricingSection, CTASection, Footer */}
      </main>
    </div>
  );
}
