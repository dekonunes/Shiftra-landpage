import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { useTypewriter } from "../hooks/useTypewriter";

export default function HeroSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const animatedTextRef = useRef<HTMLSpanElement>(null);

  // Initialize prefers-reduced-motion from media query
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Retrieve i18n strings
  const prefixText = t("hero.prefixText");
  const phrases = t("hero.phrases", { returnObjects: true }) as string[];
  const subheadline = t("hero.subheadline");
  const primaryCta = t("hero.primaryCta");
  const secondaryCta = t("hero.secondaryCta");
  const trustLine = t("hero.trustLine");

  const handleCtaClick = (variant: "primary" | "secondary") => {
    trackEvent("cta_click", { location: "hero", variant });
  };

  // Listen for changes to prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Initialize typewriter animation
  useTypewriter({
    ref: animatedTextRef,
    phrases,
    theme,
    enabled: !prefersReducedMotion,
  });

  return (
    <section
      id="hero"
      className="relative min-h-[calc(90vh-4rem)] flex items-center justify-center px-4 py-16 bg-background"
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Headline with typewriter effect */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="text-primary block sm:inline text-5xl sm:text-5xl lg:text-6xl">
            {prefixText}
          </span>
          {prefersReducedMotion ? (
            // Static fallback for reduced motion
            <span className="text-primary block sm:inline sm:ml-2 text-3xl sm:text-5xl lg:text-6xl text-center sm:text-left">
              {phrases[0]}
            </span>
          ) : (
            // Animated typewriter text
            <span
              ref={animatedTextRef}
              className="block sm:inline-block sm:ml-2 min-w-[300px] sm:min-w-[400px] text-3xl sm:text-5xl lg:text-6xl text-center sm:text-left"
              aria-live="polite"
              aria-atomic="true"
            >
              {phrases[0]}
            </span>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {subheadline}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button asChild size="lg" onClick={() => handleCtaClick("primary")}>
            <a href="#pricing">{primaryCta}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            onClick={() => handleCtaClick("secondary")}
          >
            <a href="#how-it-works">{secondaryCta}</a>
          </Button>
        </div>

        {/* Trust line */}
        <p className="text-sm text-muted-foreground">{trustLine}</p>
      </div>
    </section>
  );
}
