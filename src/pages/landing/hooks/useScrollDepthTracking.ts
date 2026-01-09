import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export default function useScrollDepthTracking(): void {
  const reportedRef = useRef(new Set<number>());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const reportIfNeeded = (percent: number) => {
      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (percent >= threshold && !reportedRef.current.has(threshold)) {
          reportedRef.current.add(threshold);
          trackEvent('scroll_depth', { percent: threshold });
        }
      });
    };

    const handleScroll = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;

        const documentElement = document.documentElement;
        const scrollableHeight =
          documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight <= 0) {
          reportIfNeeded(100);
          return;
        }

        const percent = Math.round(
          (window.scrollY / scrollableHeight) * 100
        );

        reportIfNeeded(percent);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
}
