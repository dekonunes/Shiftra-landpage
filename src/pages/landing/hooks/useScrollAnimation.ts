import { useEffect } from 'react';

interface ScrollTriggerConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  toggleActions?: string;
  scrub?: boolean | number;
  pin?: boolean | string | HTMLElement;
  markers?: boolean;
  once?: boolean;
}

interface AnimationVars {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotation?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | object;
  scrollTrigger?: ScrollTriggerConfig;
  [key: string]: unknown;
}

interface UseScrollAnimationOptions {
  target: string;
  animation: AnimationVars;
  triggerConfig?: ScrollTriggerConfig;
  enabled?: boolean;
}

/**
 * Custom hook for GSAP ScrollTrigger animations
 *
 * @param options - Configuration object for the scroll animation
 * @param options.target - CSS selector for target elements to animate
 * @param options.animation - GSAP animation properties
 * @param options.triggerConfig - ScrollTrigger configuration options
 * @param options.enabled - Whether animations are enabled (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * useScrollAnimation({
 *   target: '.step-card',
 *   animation: { opacity: 0, y: 50, duration: 0.8, stagger: 0.2 },
 *   triggerConfig: { start: 'top 80%', toggleActions: 'play none none reverse' },
 *   enabled: !prefersReducedMotion
 * });
 * ```
 */
export function useScrollAnimation(options: UseScrollAnimationOptions): void {
  const {
    target,
    animation,
    triggerConfig = {},
    enabled = true
  } = options;

  useEffect(() => {
    // Return early if animations are disabled
    if (!enabled) {
      return;
    }

    let gsapInstance: typeof import('gsap').default | null = null;
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;
    let isActive = true;

    // Lazy-load GSAP and ScrollTrigger plugin
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([gsapModule, scrollTriggerModule]) => {
      if (!isActive) return;

      gsapInstance = gsapModule.default;
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      // Register ScrollTrigger plugin
      gsapInstance.registerPlugin(ScrollTrigger);

      // Query all matching elements
      const elements = gsapModule.default.utils.toArray(target);

      if (elements.length === 0) {
        console.warn(`useScrollAnimation: No elements found for selector "${target}"`);
        return;
      }

      // Default ScrollTrigger configuration
      const defaultTriggerConfig: ScrollTriggerConfig = {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...triggerConfig,
      };

      // Create GSAP animation with ScrollTrigger for each element
      elements.forEach((element, index) => {
        if (!gsapInstance) return;

        const htmlElement = element as HTMLElement;

        // Build animation config with ScrollTrigger
        const animationConfig: AnimationVars = {
          ...animation,
          scrollTrigger: {
            trigger: htmlElement,
            ...defaultTriggerConfig,
          },
        };

        // Apply stagger delay if animation has stagger property
        if (animation.stagger && typeof animation.stagger === 'number') {
          animationConfig.delay = (animationConfig.delay || 0) + (index * animation.stagger);
          delete animationConfig.stagger; // Remove stagger as we're handling it manually
        }

        // Create the animation
        gsapInstance.from(htmlElement, animationConfig);
      });
    }).catch((error) => {
      console.error('Failed to load GSAP ScrollTrigger:', error);
    });

    // Cleanup function
    return () => {
      isActive = false;

      if (ScrollTrigger) {
        // Kill all ScrollTrigger instances for the target elements
        ScrollTrigger.getAll().forEach((trigger) => {
          const triggerElement = trigger.trigger;
          if (triggerElement && typeof target === 'string') {
            if ((triggerElement as HTMLElement).matches?.(target)) {
              trigger.kill();
            }
          }
        });
      }

      if (gsapInstance) {
        // Kill all tweens for the target elements
        const elements = gsapInstance.utils.toArray(target);
        elements.forEach((element) => {
          if (gsapInstance) {
            gsapInstance.killTweensOf(element as gsap.TweenTarget);
          }
        });
      }
    };
  }, [target, animation, triggerConfig, enabled]);
}
