import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ReadyToSection from './components/ReadyToSection';
import WhatsAppShiftFlowSection from './components/WhatsAppShiftFlowSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import BenefitsSection from './components/BenefitsSection';
import PricingSection from './components/PricingSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import useScrollDepthTracking from './hooks/useScrollDepthTracking';
import useSectionTracking, {
  type SectionTrackingConfig,
} from './hooks/useSectionTracking';

const SECTION_TRACKING_CONFIG: SectionTrackingConfig[] = [
  { id: 'hero', name: 'Hero', order: 1 },
  { id: 'ready-to', name: 'Ready To', order: 2 },
  { id: 'whatsapp-shift-flow', name: 'WhatsApp Shift Flow', order: 3 },
  { id: 'how-it-works', name: 'How It Works', order: 4 },
  { id: 'features', name: 'Features', order: 5 },
  { id: 'benefits', name: 'Benefits', order: 6 },
  { id: 'pricing', name: 'Pricing', order: 7 },
  { id: 'cta', name: 'CTA', order: 8 },
  { id: 'footer', name: 'Footer', order: 9 },
];

export default function LandingPage() {
  useSectionTracking(SECTION_TRACKING_CONFIG);
  useScrollDepthTracking();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ReadyToSection />
        <WhatsAppShiftFlowSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
