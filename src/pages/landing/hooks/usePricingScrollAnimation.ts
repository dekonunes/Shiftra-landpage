/**
 * usePricingScrollAnimation Hook
 *
 * GSAP ScrollTrigger hook with pinning for progressive pricing feature reveals.
 * Implements a 3-phase animation timeline:
 * - Phase 1: Base features reveal (all cards)
 * - Phase 2: Starter card highlight + Worker discovery reveal
 * - Phase 3: Pro card highlight + Chat/Translation reveal
 *
 * Mobile fallback: Disables pinning on screens <1024px for performance
 */

import { useEffect, type RefObject } from 'react';

/**
 * GSAP Timeline phase configuration
 */
interface TimelinePhase {
  readonly label: string;
  readonly startTime: number;
  readonly duration: number;
}

/**
 * Timeline configuration for pricing section animation
 */
const TIMELINE_PHASES: readonly TimelinePhase[] = [
  {
    label: 'base-features',
    startTime: 0,
    duration: 1.0,
  },
  {
    label: 'starter-highlight',
    startTime: 1.0,
    duration: 1.2,
  },
  {
    label: 'pro-highlight',
    startTime: 2.2,
    duration: 1.2,
  },
] as const;

/**
 * Animation configuration constants
 */
const ANIMATION_CONFIG = {
  SCROLL_RANGE: 3000, // Total scroll distance in pixels
  SCRUB_VALUE: 1, // Smooth scrubbing (1 second delay)
  ANTICIPATE_PIN: 1, // Anticipate pinning for smooth entrance
  MOBILE_BREAKPOINT: 1024, // Desktop breakpoint (lg: in Tailwind)
  STAGGER_DELAY: 0.1, // Delay between base feature animations
  CARD_SCALE: 1.05, // Scale factor for highlighted cards
  FEATURE_SCALE: 0.8, // Initial scale for features (before reveal)
} as const;

/**
 * Hook options interface
 */
interface UsePricingScrollAnimationOptions {
  readonly sectionRef: RefObject<HTMLElement | null>;
  readonly enabled: boolean;
}

/**
 * Custom hook for pricing section scroll-triggered pinned animations
 *
 * @param options - Configuration object
 * @param options.sectionRef - React ref to pricing section element
 * @param options.enabled - Whether animations are enabled (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * const sectionRef = useRef<HTMLElement>(null);
 * const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 *
 * usePricingScrollAnimation({
 *   sectionRef,
 *   enabled: !prefersReducedMotion,
 * });
 * ```
 */
export function usePricingScrollAnimation({
  sectionRef,
  enabled,
}: UsePricingScrollAnimationOptions): void {
  useEffect(() => {
    // Early return if animations disabled or section not mounted
    if (!enabled || !sectionRef.current) {
      return;
    }

    // Capture current section ref for cleanup
    const currentSection = sectionRef.current;

    let gsapInstance: typeof import('gsap').default | null = null;
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let isActive = true;

    // Lazy-load GSAP + ScrollTrigger plugin
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        // Check if component unmounted during async load
        if (!isActive || !sectionRef.current) {
          return;
        }

        gsapInstance = gsapModule.default;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        // Register ScrollTrigger plugin
        gsapInstance.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;

        // Detect mobile device (disable pinning for performance)
        const isMobile =
          window.matchMedia(`(max-width: ${ANIMATION_CONFIG.MOBILE_BREAKPOINT - 1}px)`)
            .matches;

        // Query all elements by data attributes
        const baseFeatures = section.querySelectorAll('[data-feature-type="base"]');
        const starterCard = section.querySelector('[data-pricing-card="starter"]');
        const starterFeatures = section.querySelectorAll(
          '[data-feature-type="starter-exclusive"]'
        );
        const proCard = section.querySelector('[data-pricing-card="pro"]');
        const proFeatures = section.querySelectorAll('[data-feature-type="pro-exclusive"]');

        // Validate required elements exist
        if (baseFeatures.length === 0) {
          console.warn('usePricingScrollAnimation: No base features found');
          return;
        }

        // Create GSAP timeline with ScrollTrigger
        timeline = gsapInstance.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${ANIMATION_CONFIG.SCROLL_RANGE}`,
            pin: !isMobile, // Only pin on desktop
            scrub: ANIMATION_CONFIG.SCRUB_VALUE,
            anticipatePin: ANIMATION_CONFIG.ANTICIPATE_PIN,
            // markers: import.meta.env.DEV, // Enable markers in development
          },
        });

        // Phase 1: Base features reveal (all cards)
        // Staggered entrance animation for all base features
        timeline.fromTo(
          baseFeatures,
          {
            opacity: 0,
            scale: ANIMATION_CONFIG.FEATURE_SCALE,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: ANIMATION_CONFIG.STAGGER_DELAY,
            ease: 'power2.out',
          },
          TIMELINE_PHASES[0].startTime
        );

        // Phase 2: Starter card highlight + Worker discovery reveal
        if (starterCard) {
          // Highlight starter card (scale + shadow)
          timeline.to(
            starterCard,
            {
              scale: ANIMATION_CONFIG.CARD_SCALE,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              duration: 0.3,
              ease: 'power2.out',
            },
            TIMELINE_PHASES[1].startTime
          );

          // Reveal starter exclusive features (Worker discovery)
          if (starterFeatures.length > 0) {
            timeline.fromTo(
              starterFeatures,
              {
                opacity: 0,
                scale: ANIMATION_CONFIG.FEATURE_SCALE,
                y: 10,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
              },
              TIMELINE_PHASES[1].startTime + 0.2
            );
          }

          // Reset starter card scale (prepare for Pro highlight)
          timeline.to(
            starterCard,
            {
              scale: 1,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              duration: 0.3,
              ease: 'power2.out',
            },
            TIMELINE_PHASES[2].startTime - 0.2
          );
        }

        // Phase 3: Pro card highlight + Chat/Translation reveal
        if (proCard) {
          // Highlight pro card (scale + shadow)
          timeline.to(
            proCard,
            {
              scale: ANIMATION_CONFIG.CARD_SCALE,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              duration: 0.3,
              ease: 'power2.out',
            },
            TIMELINE_PHASES[2].startTime
          );

          // Reveal pro exclusive features (Chat + Translation)
          if (proFeatures.length > 0) {
            timeline.fromTo(
              proFeatures,
              {
                opacity: 0,
                scale: ANIMATION_CONFIG.FEATURE_SCALE,
                y: 10,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1, // Stagger chat and translation
                ease: 'power2.out',
              },
              TIMELINE_PHASES[2].startTime + 0.2
            );
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load GSAP ScrollTrigger for pricing animation:', error);
      });

    // Cleanup function: Kill all ScrollTrigger instances and tweens
    return () => {
      isActive = false;

      // Kill timeline (automatically kills associated ScrollTrigger)
      if (timeline) {
        timeline.kill();
        timeline = null;
      }

      // Kill all ScrollTrigger instances for this section
      if (ScrollTrigger && currentSection) {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === currentSection) {
            trigger.kill();
          }
        });
      }

      // Kill all tweens for section elements
      if (gsapInstance && currentSection) {
        gsapInstance.killTweensOf(currentSection.querySelectorAll('*'));
      }
    };
  }, [sectionRef, enabled]);
}

/**
 * Get timeline phase by label
 *
 * @param label - Phase label
 * @returns Timeline phase or undefined
 */
export function getTimelinePhase(label: string): TimelinePhase | undefined {
  return TIMELINE_PHASES.find((phase) => phase.label === label);
}

/**
 * Calculate total animation duration
 *
 * @returns Total duration in seconds
 */
export function getTotalAnimationDuration(): number {
  const lastPhase = TIMELINE_PHASES[TIMELINE_PHASES.length - 1];
  return lastPhase.startTime + lastPhase.duration;
}

/**
 * Check if device should use mobile fallback (no pinning)
 *
 * @returns True if mobile device
 */
export function isMobileDevice(): boolean {
  return window.matchMedia(
    `(max-width: ${ANIMATION_CONFIG.MOBILE_BREAKPOINT - 1}px)`
  ).matches;
}
