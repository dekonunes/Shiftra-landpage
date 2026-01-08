import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, FileCheck, CheckCircle, TrendingUp } from "lucide-react";
import BenefitCard from "./BenefitCard";

// Icon mapping for benefits
const benefitIcons = [FileCheck, Clock, TrendingUp, CheckCircle];

/**
 * BenefitsSection - Showcase concrete outcomes with animated statistics
 *
 * Features:
 * - 4 outcome cards with animated number counters
 * - Scroll-triggered staggered animations using GSAP
 * - Responsive grid layout (1 col → 2 col → 4 col)
 * - Respects prefers-reduced-motion
 *
 * Layout:
 * - Mobile: Single column stack
 * - Tablet: 2x2 grid
 * - Desktop: 4-column single row
 */
export default function BenefitsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const title = t("benefits.title");
  const items = t("benefits.items", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    number: string;
  }>;

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Lazy load GSAP for scroll animations
    const animateBenefits = async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const cards = sectionRef.current?.querySelectorAll(
        "[data-animate-benefit]"
      );
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
          stagger: 0.2, // 0.2s delay between each card
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true, // Only animate once
          },
        }
      );
    };

    animateBenefits();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} id="benefits" className="px-4 py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-foreground">
          {title}
        </h2>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => {
            const Icon = benefitIcons[index];

            return (
              <div key={index} data-animate-benefit className="h-full">
                <BenefitCard
                  icon={Icon}
                  number={parseInt(item.number, 10)}
                  title={item.title}
                  description={item.description}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
