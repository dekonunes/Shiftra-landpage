import { useEffect, useMemo, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

export interface SectionTrackingConfig {
  id: string;
  name: string;
  order: number;
}

export default function useSectionTracking(
  sections: SectionTrackingConfig[]
): void {
  const observedRef = useRef(new Set<string>());
  const sectionMap = useMemo(() => {
    return new Map(sections.map((section) => [section.id, section]));
  }, [sections]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          const sectionId = target.id;
          if (!sectionId || observedRef.current.has(sectionId)) {
            return;
          }

          const section = sectionMap.get(sectionId);
          if (!section) {
            return;
          }

          observedRef.current.add(sectionId);
          trackEvent('section_view', {
            section_id: section.id,
            section_name: section.name,
            order: section.order,
          });
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections, sectionMap]);
}
