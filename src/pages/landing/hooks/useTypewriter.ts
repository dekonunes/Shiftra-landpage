import { useEffect, type RefObject } from 'react';

interface UseTypewriterOptions {
  ref: RefObject<HTMLElement | null>;
  phrases: string[];
  theme: 'light' | 'dark';
  enabled: boolean;
}

const phraseColors = {
  light: [
    'rgb(34, 197, 94)',    // Green (WCAG AA compliant)
    'rgb(51, 51, 51)',     // Dark gray
    'rgb(161, 98, 7)',     // Dark yellow
    'rgb(220, 38, 38)',    // Dark red
  ],
  dark: [
    'rgb(34, 197, 94)',    // Green
    'rgb(255, 255, 255)',  // White
    'rgb(250, 204, 21)',   // Bright yellow
    'rgb(248, 113, 113)',  // Bright red
  ],
};

export function useTypewriter(options: UseTypewriterOptions): void {
  const { ref, phrases, theme, enabled } = options;

  useEffect(() => {
    // Return early if not enabled or ref not available
    if (!enabled || !ref.current || phrases.length === 0) {
      return;
    }

    const element = ref.current;
    let gsapInstance: typeof import('gsap').default | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;

    // Lazy-load GSAP
    import('gsap').then((gsapModule) => {
      if (!isActive) return;

      gsapInstance = gsapModule.default;

      // Initialize typewriter animation
      let currentPhraseIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;

      const colors = phraseColors[theme];

      const typewriterLoop = () => {
        if (!isActive) return;

        const currentPhrase = phrases[currentPhraseIndex];
        const color = colors[currentPhraseIndex % colors.length];

        if (!isDeleting) {
          // Typing phase - add one character at a time
          if (currentCharIndex <= currentPhrase.length) {
            const displayText = currentPhrase.substring(0, currentCharIndex);
            element.textContent = displayText + '|';
            element.style.color = color;
            currentCharIndex++;

            if (currentCharIndex > currentPhrase.length) {
              // Finished typing - hold for 1.5s before deleting
              timeoutId = setTimeout(() => {
                isDeleting = true;
                typewriterLoop();
              }, 1500);
              return;
            }

            // Continue typing - 50ms delay per character
            timeoutId = setTimeout(typewriterLoop, 50);
          }
        } else {
          // Deleting phase - remove one character at a time
          if (currentCharIndex >= 0) {
            const displayText = currentPhrase.substring(0, currentCharIndex);
            element.textContent = displayText + '|';
            element.style.color = color;
            currentCharIndex--;

            if (currentCharIndex < 0) {
              // Finished deleting - pause 500ms before next phrase
              isDeleting = false;
              currentCharIndex = 0;
              currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;

              timeoutId = setTimeout(typewriterLoop, 500);
              return;
            }

            // Continue deleting - 30ms delay per character
            timeoutId = setTimeout(typewriterLoop, 30);
          }
        }
      };

      // Start the animation loop
      typewriterLoop();
    }).catch((error) => {
      console.error('Failed to load GSAP:', error);
    });

    // Cleanup function
    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (gsapInstance && element) {
        gsapInstance.killTweensOf(element);
      }
    };
  }, [ref, phrases, theme, enabled]);
}
