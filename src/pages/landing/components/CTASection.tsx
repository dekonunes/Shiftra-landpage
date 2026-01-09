import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import WaitlistDialog from './WaitlistDialog';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CTASection() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply scroll animation to the CTA container
  useScrollAnimation({
    target: '#cta .cta-container',
    animation: {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    },
    triggerConfig: {
      start: 'top 80%',
      once: true,
    },
    enabled: !prefersReducedMotion,
  });

  return (
    <>
      <section id="cta" className="px-4 py-20 bg-muted/30">
        <div className="cta-container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
            {t('cta.title')}
          </h2>

          <Button
            size="lg"
            className="px-8 py-6 text-lg"
            onClick={() => setIsDialogOpen(true)}
          >
            {t('cta.button')}
          </Button>
        </div>
      </section>

      <WaitlistDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
