import type { FooterSection } from './types';

export const FOOTER_CONFIG: readonly FooterSection[] = [
  {
    id: 'product',
    titleKey: 'footer.sections.product.title',
    links: [
      { type: 'internal', labelKey: 'footer.sections.product.features', href: '#features' },
      { type: 'internal', labelKey: 'footer.sections.product.howItWorks', href: '#how-it-works' },
      { type: 'internal', labelKey: 'footer.sections.product.pricing', href: '#pricing' },
    ],
  },
  {
    id: 'company',
    titleKey: 'footer.sections.company.title',
    links: [
      { type: 'external', labelKey: 'footer.sections.company.about', href: 'https://shiftra.app/about' },
      { type: 'external', labelKey: 'footer.sections.company.blog', href: 'https://shiftra.app/blog' },
      { type: 'external', labelKey: 'footer.sections.company.careers', href: 'https://shiftra.app/careers' },
    ],
  },
  {
    id: 'legal',
    titleKey: 'footer.sections.legal.title',
    links: [
      { type: 'external', labelKey: 'footer.sections.legal.privacy', href: 'https://shiftra.app/privacy' },
      { type: 'external', labelKey: 'footer.sections.legal.terms', href: 'https://shiftra.app/terms' },
      { type: 'email', labelKey: 'footer.sections.legal.contact', href: 'mailto:support@shiftra.app', displayEmail: 'support@shiftra.app' },
    ],
  },
  {
    id: 'connect',
    titleKey: 'footer.sections.connect.title',
    links: [
      { type: 'external', labelKey: 'footer.sections.connect.website', href: 'https://shiftra.app' },
      { type: 'email', labelKey: 'footer.sections.connect.email', href: 'mailto:support@shiftra.app', displayEmail: 'support@shiftra.app' },
    ],
  },
] as const;
