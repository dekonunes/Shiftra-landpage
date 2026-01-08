import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList, CheckCircle, DollarSign, FileText } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const stepIcons = [ClipboardList, CheckCircle, DollarSign, FileText];

/**
 * HowItWorksSection - Showcase the 4-step workflow
 *
 * Features:
 * - 4 step cards with icons and descriptions
 * - Scroll-triggered staggered animations using GSAP
 * - Responsive images with WebP fallback
 * - Mobile-first responsive layout (1 col → 2 col)
 * - Respects prefers-reduced-motion
 *
 * Layout:
 * - Mobile: Single column stack
 * - Tablet+: 2x2 grid
 */
export default function HowItWorksSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const title = t('howItWorks.title');
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Lazy load GSAP only when needed
    const animateCards = async () => {
      const gsapModule = await import('gsap');
      const ScrollTriggerModule = await import('gsap/ScrollTrigger');

      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      // Select all cards but filter for visibility to ensure we animate the correct set
      const allCards = sectionRef.current?.querySelectorAll('[data-animate-card]');
      if (!allCards || hasAnimated) return;

      const visibleCards = Array.from(allCards).filter((card) => {
        return window.getComputedStyle(card).display !== 'none';
      });

      if (visibleCards.length === 0) return;

      setHasAnimated(true);

      gsap.fromTo(
        visibleCards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2, // 0.2s delay between each card
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true, // Only animate once
          },
        }
      );
    };

    animateCards();
  }, [hasAnimated]);

  const renderCard = (index: number) => {
    const step = steps[index];
    const Icon = stepIcons[index];

    return (
      <Card
        key={index}
        data-animate-card
        className="group transition-shadow hover:shadow-lg h-fit"
      >
        <CardHeader>
          {/* Icon, number, and title on same line */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
              <Icon className="size-6" aria-hidden="true" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
              {index + 1}
            </div>
            <CardTitle className="mb-0">{step.title}</CardTitle>
          </div>

          <CardDescription>{step.description}</CardDescription>
        </CardHeader>

        {/* Show images for specific steps */}
        {index === 0 && (
          <CardContent>
            <OptimizedImage
              src="/src/assets/landing/agenda"
              alt="Agenda showing upcoming shifts and reminders"
              className="w-full rounded-lg border border-border"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </CardContent>
        )}

        {index === 1 && (
          <CardContent>
            <OptimizedImage
              src="/src/assets/landing/shift-details"
              alt="Shift details with requirements and acceptance flow"
              className="w-full rounded-lg border border-border"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </CardContent>
        )}

        {index === 2 && (
          <CardContent>
            <OptimizedImage
              src="/src/assets/landing/estimate"
              alt="Automatic roster with estimated earnings and weekly hours"
              className="w-full rounded-lg border border-border"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </CardContent>
        )}

        {index === 3 && (
          <CardContent>
            <OptimizedImage
              src="/src/assets/landing/invoice"
              alt="Invoice preview with totals and one-click generation"
              className="w-full rounded-lg border border-border"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="px-4 py-20 bg-muted/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-foreground">
          {title}
        </h2>

        {/* Mobile Layout (Single Column) */}
        <div className="md:hidden space-y-8">
          {steps.map((_, index) => renderCard(index))}
        </div>

        {/* Desktop Layout (Masonry 2 Columns) */}
        <div className="hidden md:grid grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {renderCard(0)}
            {renderCard(2)}
          </div>
          <div className="space-y-8">
            {renderCard(1)}
            {renderCard(3)}
          </div>
        </div>
      </div>
    </section>
  );
}
