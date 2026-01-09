import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Discriminated union types for type-safe footer links
export type LinkType = 'internal' | 'external' | 'email';

export interface InternalLink {
  type: 'internal';
  labelKey: string;
  href: `#${string}`; // Template literal enforces # prefix
}

export interface ExternalLink {
  type: 'external';
  labelKey: string;
  href: `https://${string}` | `http://${string}`; // Enforces protocol
  rel?: 'noopener noreferrer' | 'noopener noreferrer nofollow';
}

export interface EmailLink {
  type: 'email';
  labelKey: string;
  href: `mailto:${string}`; // Enforces mailto: prefix
  displayEmail?: string;
}

export type FooterLinkType = InternalLink | ExternalLink | EmailLink;

// Type guards
function isExternalLink(link: FooterLinkType): link is ExternalLink {
  return link.type === 'external';
}

function isEmailLink(link: FooterLinkType): link is EmailLink {
  return link.type === 'email';
}

function isInternalLink(link: FooterLinkType): link is InternalLink {
  return link.type === 'internal';
}

interface FooterLinkProps {
  link: FooterLinkType;
  className?: string;
}

/**
 * FooterLink - Type-safe link component with discriminated unions
 *
 * Renders different link types with appropriate attributes:
 * - Internal: Anchor links (#section)
 * - External: Opens in new tab with security attributes
 * - Email: mailto: links
 *
 * @example
 * <FooterLink
 *   link={{
 *     type: 'external',
 *     labelKey: 'Privacy Policy',
 *     href: 'https://shiftra.app/privacy',
 *     rel: 'noopener noreferrer'
 *   }}
 * />
 */
export default function FooterLink({ link, className = '' }: FooterLinkProps) {
  const baseStyles = cn(
    'text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
    className
  );

  // External link with icon and security attributes
  if (isExternalLink(link)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel={link.rel || 'noopener noreferrer'}
        className={cn(baseStyles, 'inline-flex items-center gap-1')}
      >
        <span>{link.labelKey}</span>
        <ExternalLink className="size-3" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }

  // Email link
  if (isEmailLink(link)) {
    return (
      <a href={link.href} className={baseStyles}>
        {link.displayEmail || link.labelKey}
      </a>
    );
  }

  // Internal link (anchor)
  if (isInternalLink(link)) {
    return (
      <a href={link.href} className={baseStyles}>
        {link.labelKey}
      </a>
    );
  }

  // Fallback (should never reach here with proper typing)
  return null;
}
