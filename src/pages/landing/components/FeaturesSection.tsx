import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Calendar,
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Bell,
  MessageSquare,
  Languages,
  Building,
  Clock,
  Calculator,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Icon mapping for worker features
const workerIcons = [Search, Calendar, TrendingUp, CreditCard, FileText, Calculator];

// Icon mapping for business features
const businessIcons = [Users, Bell, MessageSquare, Languages, Building, Clock];

/**
 * FeaturesSection - Two large cards showcasing features
 *
 * Features:
 * - Worker features vs Business features in 2 big cards
 * - Horizontal icon+text layout (icon on same line as text)
 * - Scroll-triggered animations
 * - Responsive grid layout (1 col → 2 col)
 * - Icon-driven visual hierarchy
 * - Respects prefers-reduced-motion
 *
 * Layout:
 * - Mobile: Single column (workers → businesses)
 * - Desktop: 2-column split
 */
export default function FeaturesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const title = t('features.title');
  const workersTitle = t('features.workers.title');
  const workersItems = t('features.workers.items', {
    returnObjects: true,
  }) as string[];
  const businessesTitle = t('features.businesses.title');
  const businessesItems = t('features.businesses.items', {
    returnObjects: true,
  }) as string[];

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Lazy load GSAP for scroll animations
    const animateFeatures = async () => {
      const gsapModule = await import('gsap');
      const ScrollTriggerModule = await import('gsap/ScrollTrigger');

      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const cards = sectionRef.current?.querySelectorAll('[data-animate-feature]');
      if (!cards || hasAnimated) return;

      setHasAnimated(true);

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    };

    animateFeatures();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} id="features" className="px-4 py-20 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 text-foreground">
          {title}
        </h2>

        {/* Two-column layout with big cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Worker Features Card */}
          <div data-animate-feature>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-primary text-center">
                  {workersTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workersItems.map((item, index) => (
                    <FeatureRow
                      key={index}
                      icon={workerIcons[index]}
                      title={item}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Features Card */}
          <div data-animate-feature>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-primary text-center">
                  {businessesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessesItems.map((item, index) => (
                    <FeatureRow
                      key={index}
                      icon={businessIcons[index]}
                      title={item}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * FeatureRow - Horizontal icon + text layout
 */
interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
}

function FeatureRow({ icon: Icon, title }: FeatureRowProps) {
  return (
    <div className="flex items-center gap-4 group">
      {/* Icon container */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      {/* Title text */}
      <p className="text-base font-medium text-foreground">{title}</p>
    </div>
  );
}
