import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import FooterLink from './FooterLink';
import type { FooterSection } from './FooterColumn';

interface FooterAccordionProps {
  sections: FooterSection[];
}

/**
 * FooterAccordion - Mobile footer accordion component
 *
 * Displays footer sections as collapsible accordions on mobile (<768px).
 * Multiple sections can be expanded simultaneously for better UX.
 *
 * @example
 * <FooterAccordion
 *   sections={[
 *     { id: 'product', titleKey: 'Product', links: [...] },
 *     { id: 'company', titleKey: 'Company', links: [...] }
 *   ]}
 * />
 */
export default function FooterAccordion({ sections }: FooterAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={[sections[0]?.id]} // First section open by default
      className="w-full"
    >
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-sm font-semibold">
            {section.titleKey}
          </AccordionTrigger>

          <AccordionContent>
            <ul className="flex flex-col gap-3" role="list">
              {section.links.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
