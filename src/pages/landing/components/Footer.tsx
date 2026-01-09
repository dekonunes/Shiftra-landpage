import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { FOOTER_CONFIG } from './footer/config';
import { isExternalLink, isEmailLink, type FooterLink } from './footer/types';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Use centralized type-safe footer configuration
  const sections = FOOTER_CONFIG;

  const handleFooterClick = (link: FooterLink, label: string) => {
    trackEvent('footer_link_click', {
      link_text: label,
      href: link.href,
      link_type: link.type,
    });
  };

  const renderLink = (link: FooterLink) => {
    const baseClasses =
      'text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded';
    const label = isEmailLink(link)
      ? link.displayEmail || t(link.labelKey)
      : t(link.labelKey);

    if (isExternalLink(link)) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel={link.rel || 'noopener noreferrer'}
          className={`${baseClasses} inline-flex items-center gap-1`}
          onClick={() => handleFooterClick(link, label)}
        >
          {label}
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      );
    }

    if (isEmailLink(link)) {
      return (
        <a
          href={link.href}
          className={baseClasses}
          onClick={() => handleFooterClick(link, label)}
        >
          {label}
        </a>
      );
    }

    return (
      <a
        href={link.href}
        className={baseClasses}
        onClick={() => handleFooterClick(link, label)}
      >
        {label}
      </a>
    );
  };

  return (
    <footer id="footer" className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                {t(section.titleKey)}
              </h3>
              <nav>
                <ul className="flex flex-col gap-3">
                  {section.links.map((link, index) => (
                    <li key={index}>{renderLink(link)}</li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="block md:hidden mb-8">
          <Accordion type="multiple" defaultValue={['product']}>
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-sm font-semibold">
                  {t(section.titleKey)}
                </AccordionTrigger>
                <AccordionContent>
                  <nav>
                    <ul className="flex flex-col gap-3 pt-3">
                      {section.links.map((link, index) => (
                        <li key={index}>{renderLink(link)}</li>
                      ))}
                    </ul>
                  </nav>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
