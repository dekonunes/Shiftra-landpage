import { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  number: number;
  title: string;
  description: string;
  className?: string;
}

/**
 * BenefitCard - Display a benefit with animated number counter
 *
 * Features:
 * - Animates number from 0 to target value on scroll into view
 * - Respects prefers-reduced-motion for accessibility
 * - Theme-aware styling with hover effects
 *
 * @example
 * <BenefitCard
 *   icon={Clock}
 *   number={5}
 *   suffix="hours/week"
 *   title="Save 5 hours/week on admin"
 *   description="Less paperwork, more productivity"
 * />
 */
export default function BenefitCard({
  icon: Icon,
  number,
  title,
  description,
  className = "",
}: BenefitCardProps) {
  // Check for reduced motion preference once
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Initialize with final number if motion is reduced
  const [displayNumber, setDisplayNumber] = useState(
    prefersReducedMotion ? number : 0
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip animation setup if reduced motion is preferred
    if (prefersReducedMotion) {
      return;
    }

    // Define animation function inside effect to capture current number value
    const animateNumber = () => {
      const duration = 2000; // 2 second animation
      const steps = 30;
      const increment = number / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          setDisplayNumber(number);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current));
        }
      }, duration / steps);

      // Return cleanup function
      return () => clearInterval(timer);
    };

    // Capture current ref value for cleanup
    const currentRef = cardRef.current;

    // Intersection Observer to trigger animation when card enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateNumber();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of card is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, number, prefersReducedMotion]);

  return (
    <Card
      ref={cardRef}
      className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
      size="sm"
    >
      <CardHeader>
        {/* Icon, number, and title on same line */}
        <div className="flex items-center gap-3">
          {/* Icon container */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </div>

          {/* Number and title context */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-extrabold text-primary"
                aria-live="polite"
              >
                {displayNumber}
              </span>
            </div>
            <CardTitle className="mt-2 text-base font-semibold text-foreground leading-tight">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
