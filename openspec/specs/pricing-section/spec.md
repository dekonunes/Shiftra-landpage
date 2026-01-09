# pricing-section Specification

## Purpose
TBD - created by archiving change implement-landing-conversion-footer. Update Purpose after archive.
## Requirements
### Requirement: PricingSection with pinned scroll animation

The PricingSection component SHALL render three pricing tiers (Free, Starter, Pro) with a pinned scroll animation that progressively reveals features as the user scrolls. On desktop (≥1024px), the section MUST pin at the top of the viewport while the user scrolls through a 3000px range, revealing features in three phases. On mobile/tablet, pinning MUST be disabled and all features displayed immediately.

**Context:**

- Component location: `src/pages/landing/components/PricingSection.tsx`
- Animation hook: `usePricingScrollAnimation.ts` (GSAP ScrollTrigger with `pin: true`)
- Pricing data sourced from i18n JSON: `pricing.free`, `pricing.starter`, `pricing.pro`
- Responsive breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (≥1024px)

**Acceptance Criteria:**

- Section renders with 3 pricing cards in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Desktop (≥1024px): Section pins at top when entering viewport
- Desktop: Base features reveal with staggered animation (0.1s delay per item)
- Desktop: Starter card highlights (scale 1.05, shadow) at 1000px scroll
- Desktop: Worker discovery feature reveals on Starter card
- Desktop: Pro card highlights at 2000px scroll
- Desktop: Crew chat + Translation features reveal on Pro card
- Desktop: Section unpins after 3000px scroll range
- Mobile/Tablet (<1024px): No pinning, all features visible immediately
- Animation respects `prefers-reduced-motion` (shows all features statically)
- ScrollTrigger cleans up all instances on component unmount

#### Scenario: User scrolls through pricing section on desktop

**Given** the user loads the landing page on desktop (>1024px)
**When** the user scrolls to the PricingSection
**Then** the section pins at the top of the viewport
**And** base features (5 items) reveal with stagger on all 3 cards
**When** the user continues scrolling (1000px into range)
**Then** the Starter card scales to 1.05 and shadow increases
**And** "Worker discovery" feature reveals on Starter card with fade-in animation
**When** the user continues scrolling (2000px into range)
**Then** the Starter card resets to normal scale
**And** the Pro card scales to 1.05 and shadow increases
**And** "Crew chat" and "Translation" features reveal on Pro card with fade-in animation
**When** the user scrolls past 3000px
**Then** the section unpins and continues to next section
**And** the animation runs at 60fps (validated via Chrome DevTools Performance)

#### Scenario: User views pricing section on mobile

**Given** the user loads the landing page on mobile (375px width)
**When** the PricingSection enters the viewport
**Then** cards display in single column, stacked vertically
**And** NO pinning occurs (section scrolls normally)
**And** ALL features are visible immediately (base + exclusive)
**And** NO progressive reveal animation plays
**And** scrolling is smooth with no performance issues

---

### Requirement: Pricing cards with tier-specific styling

The PricingSection component SHALL display pricing cards with tier-specific styling, features, and CTAs. The Free plan MUST show a "No credit card required" badge and indicate Worker discovery is not included. The Starter plan MUST highlight Worker discovery as exclusive. The Pro plan MUST receive premium styling (scale, shadow, background tint) and highlight Crew chat + Translation as exclusive features.

**Context:**

- Pricing tiers from LANDING_PAGE.md lines 176-230:
  - Free ($0): Base features only, Worker discovery NOT included
  - Starter ($2/hired worker): Base + Worker discovery
  - Pro ($27/month): Base + Worker discovery + Crew chat + Translation
- Card component: `PricingCard.tsx` (reusable)
- Icons: Lucide React `Check` (included) and `X` (not included)

**Acceptance Criteria:**

- Free card displays badge: "No credit card required" (bg-primary/10, text-primary)
- Free card shows Worker discovery with X icon and strike-through text
- Starter card shows all base features + Worker discovery (highlighted)
- Pro card has premium styling: `bg-primary/5`, `ring-primary/30`, `lg:scale-105`, `lg:shadow-xl`
- Pro card shows all base features + Worker discovery + Crew chat + Translation
- All feature checkmarks use `Check` icon with `bg-primary/10` background circle
- All text sourced from i18n (pricing.free, pricing.starter, pricing.pro)
- CTA buttons full-width on mobile, responsive sizing on desktop

#### Scenario: User compares pricing tiers on desktop

**Given** the user is viewing the PricingSection on desktop
**When** the user views the Free card
**Then** the card displays "$0" with no billing period
**And** the badge "No credit card required" is visible
**And** 5 base features display with green checkmarks
**And** Worker discovery displays with X icon and strike-through text
**When** the user views the Starter card
**Then** the card displays "$2 / per hired worker"
**And** 5 base features display with green checkmarks
**And** Worker discovery displays with green checkmark (not strike-through)
**When** the user views the Pro card
**Then** the card has light purple background tint (`bg-primary/5`)
**And** the card has purple ring (`ring-primary/30`)
**And** the card is slightly larger than others (`lg:scale-105`)
**And** the card has deeper shadow (`lg:shadow-xl`)
**And** all 8 features display with green checkmarks

---

### Requirement: PricingSection accessibility support

The PricingSection component SHALL provide accessible pricing information with semantic HTML, keyboard navigation for CTA buttons, screen reader announcements for feature reveals, and reduced motion fallback. All interactive elements MUST be keyboard accessible and announced correctly to assistive technologies.

**Context:**

- Semantic HTML: `<section>`, `<article>` per card, `<h2>` section heading, `<h3>` plan names
- ARIA attributes: `aria-labelledby` for cards, `aria-live="polite"` for feature reveals
- Focus management: Tab cycles through CTA buttons in order (Free → Starter → Pro)

**Acceptance Criteria:**

- Section uses semantic `<section id="pricing">` element
- Each pricing card uses `<article>` with `aria-labelledby` referencing plan name
- CTA buttons are keyboard accessible (Tab to focus, Enter to activate)
- Feature reveals on scroll use `aria-live="polite"` to announce to screen readers
- Reduced motion: All features display immediately, no animations
- WCAG AA contrast ratios met (4.5:1 for normal text, 3:1 for large text)
- All prices announced as "X dollars per period" (e.g., "27 dollars per month")

#### Scenario: Screen reader user navigates pricing section

**Given** a screen reader user navigates to the PricingSection
**When** the section enters the viewport
**Then** the screen reader announces "Pricing section, heading Simple, transparent pricing"
**When** the user tabs to the Free card
**Then** the screen reader announces "Free plan, 0 dollars, article"
**And** the screen reader reads the description "For individuals getting organised"
**When** the user tabs to the Free CTA button
**Then** the screen reader announces "Get started free, button"
**When** the user presses Enter
**Then** the CTA action is triggered (future: opens signup modal)

#### Scenario: User with reduced motion preference views pricing

**Given** the user has enabled "reduce motion" in system preferences
**When** the PricingSection enters the viewport
**Then** all pricing cards display immediately with all features visible
**And** NO ScrollTrigger pinning occurs
**And** NO progressive reveal animations play
**And** all features are static (opacity: 1, no transforms)

---

### Requirement: PricingSection internationalization support

The PricingSection component SHALL source all pricing content (plan names, prices, periods, descriptions, features, CTA labels) from i18n translation files and update dynamically when the user changes language. Translations MUST be provided for English, Brazilian Portuguese, and Spanish without layout shift or text overflow.

**Context:**

- Translation keys: `pricing.title`, `pricing.free.*`, `pricing.starter.*`, `pricing.pro.*`, `pricing.features.*`
- Languages: EN (English), PT-BR (Brazilian Portuguese), ES (Spanish)
- Dynamic updates: `useTranslation()` hook from react-i18next

**Acceptance Criteria:**

- All pricing text sourced from i18n JSON (no hardcoded strings)
- Pricing content updates immediately when language changes (no page reload)
- No layout shift when switching between languages
- No text overflow in pricing cards (test longest translations)
- Currency symbols remain consistent ($) across all languages
- Billing periods translate correctly (e.g., "per month" → "por mês" in PT-BR)

#### Scenario: User switches to Brazilian Portuguese

**Given** the user is viewing the PricingSection in English
**When** the user clicks the "PT" language button
**Then** the section heading updates to "Preços simples e transparentes"
**And** the Free plan name updates to "Grátis"
**And** the Starter plan name updates to "Iniciante"
**And** the Pro plan name updates to "Profissional"
**And** all feature descriptions update to Portuguese
**And** the CTA buttons update to Portuguese ("Começar grátis", "Escolher Iniciante", "Ir para Profissional")
**And** no layout shift occurs (cards maintain same height)

---

### Requirement: usePricingScrollAnimation hook implementation

The usePricingScrollAnimation hook SHALL lazy-load GSAP and ScrollTrigger only when needed, register the ScrollTrigger plugin, create a timeline with pinning configuration, and clean up all instances on component unmount to prevent memory leaks and orphaned animations.

**Context:**

- Hook location: `src/pages/landing/hooks/usePricingScrollAnimation.ts`
- Lazy-loading: `Promise.all([import('gsap'), import('gsap/ScrollTrigger')])`
- Timeline config: `start: 'top top'`, `end: '+=3000'`, `pin: !isMobile`, `scrub: 1`

**Acceptance Criteria:**

- Hook returns early if `!enabled` (respects reduced motion)
- Hook returns early if `!sectionRef.current` (section not mounted)
- GSAP and ScrollTrigger imported dynamically via `import()`
- ScrollTrigger plugin registered: `gsap.registerPlugin(ScrollTrigger)`
- Mobile detection: `window.matchMedia('(max-width: 1023px)').matches`
- Timeline created with correct config (pin, scrub, anticipatePin)
- All ScrollTrigger instances killed on unmount
- All GSAP tweens killed on unmount
- No memory leaks (test with React DevTools Profiler)

#### Scenario: Hook initializes on desktop and cleans up on unmount

**Given** the PricingSection mounts on desktop (>1024px)
**And** `prefersReducedMotion` is false
**When** the usePricingScrollAnimation hook initializes
**Then** GSAP and ScrollTrigger are imported dynamically (check Network tab)
**And** ScrollTrigger is registered with GSAP
**And** a timeline is created with `pin: true`
**And** the section element is queried via `sectionRef.current`
**And** base features, Starter features, and Pro features are queried
**When** the component unmounts
**Then** all ScrollTrigger instances are killed
**And** all GSAP tweens are killed
**And** no memory leaks are detected (React DevTools Profiler)

