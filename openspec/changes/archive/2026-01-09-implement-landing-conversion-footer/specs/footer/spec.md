# footer Specification (Phase 3)

## ADDED Requirements

### Requirement: Footer component with responsive layout

The Footer component SHALL render a site-wide footer with 4 sections (Product, Company, Legal, Connect) that displays as a 4-column grid on desktop (≥768px) and as collapsible accordions on mobile (<768px). The footer MUST be placed outside the `<main>` element as a semantic `<footer>` landmark.

**Context:**

- Component location: `src/pages/landing/components/Footer.tsx`
- Footer configuration: `footer/config.ts` (static, type-safe)
- Footer types: `footer/types.ts` (discriminated unions for links)
- Desktop component: `FooterColumn.tsx`
- Mobile component: `FooterAccordion.tsx`
- Responsive breakpoint: `md:768px` (Tailwind default)

**Acceptance Criteria:**

- Footer renders as `<footer>` element outside `<main>` (after closing `</main>` tag)
- Desktop (≥768px): 4-column grid visible, accordions hidden
- Mobile (<768px): Accordions visible, grid hidden
- Responsive layout controlled by CSS only (no JavaScript breakpoint detection)
- Footer sections: Product (3 links), Company (3 links), Legal (3 links), Connect (2 links)
- Copyright section displays dynamic year: `© {currentYear} Shiftra. All rights reserved.`
- Footer background uses `bg-muted/30` with top border

#### Scenario: User views footer on desktop

**Given** the user loads the landing page on desktop (1024px width)
**When** the user scrolls to the bottom of the page
**Then** the footer displays as a 4-column grid
**And** 4 section headings are visible: Product, Company, Legal, Connect
**And** all links are visible under each heading
**And** NO accordions are visible
**And** the copyright text displays with current year (e.g., "© 2026 Shiftra. All rights reserved.")

#### Scenario: User views footer on mobile

**Given** the user loads the landing page on mobile (375px width)
**When** the user scrolls to the bottom of the page
**Then** the footer displays as accordions
**And** the 4-column grid is hidden
**And** the first section (Product) is expanded by default
**And** other sections (Company, Legal, Connect) are collapsed
**When** the user taps "Company" section
**Then** the Company section expands
**And** the Product section remains expanded (multiple sections can be open)

---

### Requirement: Type-safe link handling with discriminated unions

The Footer component SHALL use TypeScript discriminated unions to handle three link types (internal, external, email) with type-safe rendering. Internal links MUST scroll to hash anchors, external links MUST open in new tabs with security attributes, and email links MUST open the default email client.

**Context:**

- Link types: `InternalLink` (hash anchors), `ExternalLink` (URLs), `EmailLink` (mailto:)
- Type guards: `isInternalLink`, `isExternalLink`, `isEmailLink`
- Link component: `FooterLink.tsx` (discriminated union rendering)
- External link security: `target="_blank"` + `rel="noopener noreferrer"` (automatic)

**Acceptance Criteria:**

- All links defined in `FOOTER_CONFIG` with explicit type field
- Internal links use template literal type `href: #${string}` (enforces # prefix)
- External links use template literal type `href: https://${string}` (enforces protocol)
- Email links use template literal type `href: mailto:${string}` (enforces mailto:)
- External links automatically render with `target="_blank"` and `rel="noopener noreferrer"`
- External links display external icon (Lucide `ExternalLink`, size-3)
- Email links display email address or custom label
- TypeScript compiler enforces correct properties per link type

#### Scenario: User clicks internal footer link

**Given** the user is viewing the footer on desktop
**When** the user clicks the "Features" link (internal)
**Then** the page smoothly scrolls to the FeaturesSection (#features anchor)
**And** no new tab opens
**And** the URL updates to include the hash (#features)

#### Scenario: User clicks external footer link

**Given** the user is viewing the footer on desktop
**When** the user clicks the "Blog" link (external)
**Then** a new browser tab opens with the URL https://shiftra.app/blog
**And** the link includes `rel="noopener noreferrer"` (security)
**And** an external link icon is visible next to "Blog" text
**And** the original tab remains on the landing page

#### Scenario: User clicks email footer link

**Given** the user is viewing the footer on desktop
**When** the user clicks the "contact@shiftra.app" link (email)
**Then** the default email client opens with "To:" field pre-filled with contact@shiftra.app
**And** no new browser tab opens
**And** the email address is displayed as "contact@shiftra.app" (not "Email us")

---

### Requirement: Footer accessibility with keyboard and screen reader support

The Footer component SHALL provide accessible navigation with semantic HTML, keyboard navigation for all links and accordions, screen reader announcements for section headings and links, and proper focus management. All interactive elements MUST be keyboard accessible with visible focus indicators.

**Context:**

- Semantic HTML: `<footer>`, `<nav>`, `<ul>`, `<li>` elements
- Accordion: shadcn/ui Accordion component (built-in keyboard support)
- ARIA attributes: `aria-label` on footer, section headings use proper heading levels
- Focus indicators: Tailwind `focus:ring-2 focus:ring-primary` on links

**Acceptance Criteria:**

- Footer uses semantic `<footer>` element with `aria-label="Site footer"`
- Each section uses `<nav>` element with `aria-labelledby` referencing heading
- Section headings use `<h3>` (assuming page has h1 and h2 already)
- All links are keyboard accessible (Tab to focus, Enter to activate)
- Desktop: Tab cycles through all links in left-to-right, top-to-bottom order
- Mobile: Tab cycles through accordion triggers and expanded links
- Mobile: Enter/Space on accordion trigger toggles section open/closed
- External links announced as "opens in new tab" by screen readers
- WCAG AA contrast ratios met (text-muted-foreground has >4.5:1 contrast)

#### Scenario: Keyboard user navigates footer on desktop

**Given** the user is using keyboard navigation on desktop
**When** the user tabs to the footer
**Then** focus moves to the first link in the Product section ("Features")
**And** a visible focus ring appears around the link
**When** the user presses Tab repeatedly
**Then** focus cycles through all links in this order:
1. Product: Features → How it works → Pricing
2. Company: About → Blog → Careers
3. Legal: Privacy Policy → Terms of Service → Contact
4. Connect: shiftra.app → Email us
**When** the user presses Enter on any link
**Then** the link activates (scroll to anchor, open new tab, or open email client)

#### Scenario: Screen reader user navigates footer

**Given** a screen reader user navigates to the footer
**When** the footer enters the viewport
**Then** the screen reader announces "Site footer, navigation landmark"
**When** the user tabs to the Product section
**Then** the screen reader announces "Product, heading level 3"
**When** the user tabs to the "Blog" link
**Then** the screen reader announces "Blog, link, opens in new tab"
**And** the external link icon has `aria-hidden="true"` (not announced)

---

### Requirement: FooterAccordion with expandable sections

The FooterAccordion component SHALL allow multiple sections to be expanded simultaneously on mobile, with the first section (Product) open by default. Accordion animations MUST be smooth (no jank), and touch targets MUST meet accessibility guidelines (minimum 44px height).

**Context:**

- Accordion component: shadcn/ui Accordion with `type="multiple"`
- Default open section: `defaultValue={['product']}`
- Accordion behavior: Multiple sections can be open simultaneously (not single mode)
- Touch targets: Accordion triggers have minimum 44px height

**Acceptance Criteria:**

- Accordion uses `type="multiple"` (allows multiple sections open)
- First section (Product) is open by default on mount
- User can tap any section heading to toggle open/closed
- Multiple sections can be open at the same time
- Accordion trigger has minimum 44px height (WCAG touch target size)
- Accordion animations smooth (no layout shift, no jank)
- Expand/collapse icon (chevron) rotates smoothly
- Accordion content slides in/out with fade animation

#### Scenario: User interacts with footer accordion on mobile

**Given** the user is viewing the footer on mobile (375px)
**When** the footer renders
**Then** the Product section is expanded by default
**And** Company, Legal, Connect sections are collapsed
**When** the user taps the "Company" section heading
**Then** the Company section expands with slide-down animation
**And** the Product section remains expanded
**When** the user taps the "Legal" section heading
**Then** the Legal section expands
**And** both Product and Company sections remain expanded
**When** the user taps the "Product" section heading
**Then** the Product section collapses with slide-up animation
**And** Company and Legal sections remain expanded

---

### Requirement: Footer internationalization with dynamic copyright

The Footer component SHALL source all footer content (section headings, link labels, copyright text) from i18n translation files and update dynamically when the user changes language. The copyright text MUST display the current year dynamically (not hardcoded) and update when the language changes.

**Context:**

- Translation keys: `footer.sections.{product|company|legal|connect}.title`, `footer.sections.*.links.*`, `footer.copyright`
- Languages: EN, PT-BR, ES
- Dynamic year: `new Date().getFullYear()`
- Copyright with interpolation: `t('footer.copyright', { year: currentYear })`

**Acceptance Criteria:**

- All footer content sourced from i18n JSON (no hardcoded strings)
- Footer content updates immediately when language changes (no page reload)
- No layout shift when switching languages
- Copyright year calculated dynamically: `const year = new Date().getFullYear()`
- Copyright text uses i18n interpolation: `t('footer.copyright', { year })`
- Link labels translate correctly without overflow

#### Scenario: User switches to Brazilian Portuguese

**Given** the user is viewing the footer in English
**When** the user clicks the "PT" language button
**Then** all section headings update to Portuguese:
- Product → Produto
- Company → Empresa
- Legal → Legal
- Connect → Conectar
**And** all link labels update to Portuguese
**And** the copyright text updates to "© 2026 Shiftra. Todos os direitos reservados."
**And** no layout shift occurs

#### Scenario: Copyright year updates dynamically

**Given** the current year is 2026
**When** the footer renders
**Then** the copyright text displays "© 2026 Shiftra. All rights reserved."
**Given** the current year changes to 2027 (simulated by system date change)
**When** the user refreshes the page
**Then** the copyright text displays "© 2027 Shiftra. All rights reserved."
