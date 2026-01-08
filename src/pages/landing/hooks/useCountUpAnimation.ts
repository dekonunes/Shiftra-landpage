import { useEffect } from 'react';

interface UseCountUpAnimationOptions {
  target: string;
  enabled?: boolean;
}

/**
 * Custom hook for animated number counting using GSAP ScrollTrigger
 *
 * Reads data-target and data-suffix attributes from HTML elements and animates
 * the numbers from 0 to the target value when they enter the viewport.
 *
 * @param options - Configuration object for the count-up animation
 * @param options.target - CSS selector for elements with data-target attributes
 * @param options.enabled - Whether animations are enabled (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * // In component:
 * useCountUpAnimation({ target: '.stat-number', enabled: !prefersReducedMotion });
 *
 * // In HTML:
 * <span className="stat-number" data-target="80" data-suffix="%">0</span>
 * <span className="stat-number" data-target="5" data-suffix=" hours">0</span>
 * <span className="stat-number" data-target="99.9" data-suffix="%">0</span>
 * ```
 */
export function useCountUpAnimation(options: UseCountUpAnimationOptions): void {
  const { target, enabled = true } = options;

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

      // Query all elements with the target class
      const elements = gsapModule.default.utils.toArray(target);

      if (elements.length === 0) {
        console.warn(`useCountUpAnimation: No elements found for selector "${target}"`);
        return;
      }

      // Animate each counter element
      elements.forEach((element) => {
        if (!gsapInstance) return;

        const htmlElement = element as HTMLElement;

        // Read data attributes
        const targetValue = parseFloat(htmlElement.dataset.target || '0');
        const suffix = htmlElement.dataset.suffix || '';

        // Determine if we should use integer or decimal snapping
        const hasDecimal = targetValue % 1 !== 0;
        const snapValue = hasDecimal ? 0.1 : 1;

        // Create a proxy object to animate
        const counter = { value: 0 };

        gsapInstance.to(counter, {
          value: targetValue,
          duration: 2,
          ease: 'power2.out',
          snap: { value: snapValue },
          scrollTrigger: {
            trigger: htmlElement,
            start: 'top 80%',
            toggleActions: 'play none none none', // Only play once
            once: true, // Animation happens only once
          },
          onUpdate: () => {
            // Update the element's text content with the current value
            const currentValue = counter.value;

            // Format the number based on whether it has decimals
            const formattedValue = hasDecimal
              ? currentValue.toFixed(1)
              : Math.round(currentValue).toString();

            // Update innerText with value + suffix
            htmlElement.innerText = `${formattedValue}${suffix}`;
          },
        });
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
  }, [target, enabled]);
}
