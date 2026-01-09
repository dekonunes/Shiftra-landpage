export interface InternalLink {
  type: 'internal';
  labelKey: string;
  href: `#${string}`;
}

export interface ExternalLink {
  type: 'external';
  labelKey: string;
  href: string;
  rel?: string;
}

export interface EmailLink {
  type: 'email';
  labelKey: string;
  href: `mailto:${string}`;
  displayEmail?: string;
}

export type FooterLink = InternalLink | ExternalLink | EmailLink;

export interface FooterSection {
  id: string;
  titleKey: string;
  links: FooterLink[];
}

export function isInternalLink(link: FooterLink): link is InternalLink {
  return link.type === 'internal';
}

export function isExternalLink(link: FooterLink): link is ExternalLink {
  return link.type === 'external';
}

export function isEmailLink(link: FooterLink): link is EmailLink {
  return link.type === 'email';
}
