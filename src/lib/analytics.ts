type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type GtagFunction = (...args: unknown[]) => void;

export function trackEvent(
  name: string,
  params: AnalyticsEventParams = {}
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const gtag = (window as Window & { gtag?: GtagFunction }).gtag;
  if (typeof gtag !== 'function') {
    return;
  }

  gtag('event', name, params);
}
