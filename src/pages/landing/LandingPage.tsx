import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ReadyToSection from './components/ReadyToSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ReadyToSection />
        {/* TODO: Add remaining sections */}
      </main>
    </div>
  );
}
