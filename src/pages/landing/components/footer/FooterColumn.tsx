import FooterLink, { type FooterLinkType } from './FooterLink';

export interface FooterSection {
  id: string;
  titleKey: string;
  links: FooterLinkType[];
}

interface FooterColumnProps {
  section: FooterSection;
}

/**
 * FooterColumn - Desktop footer section component
 *
 * Displays a single footer section with title and links.
 * Used in the desktop layout (md:768px+) with 4-column grid.
 *
 * @example
 * <FooterColumn
 *   section={{
 *     id: 'product',
 *     titleKey: 'Features',
 *     links: [...]
 *   }}
 * />
 */
export default function FooterColumn({ section }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section title */}
      <h3 className="text-sm font-semibold text-foreground">{section.titleKey}</h3>

      {/* Links */}
      <ul className="flex flex-col gap-3" role="list">
        {section.links.map((link) => (
          <li key={link.href}>
            <FooterLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
