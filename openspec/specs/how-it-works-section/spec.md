# how-it-works-section Specification

## Purpose
TBD - created by archiving change implement-landing-core-sections. Update Purpose after archive.
## Requirements
### Requirement: The HowItWorksSection component SHALL render a 4-step workflow with scroll-triggered card animations

**Description:**
The HowItWorksSection component MUST render a visual workflow showing 4 steps (Post/Find → Confirm → Track → Invoice) with step cards that fade in with a stagger effect when scrolled into view. Each step card MUST include an icon, title, description, and optionally an accompanying screenshot image. The animation MUST be powered by GSAP ScrollTrigger and respect user motion preferences.

**Context:**

- Component location: `src/pages/landing/components/HowItWorksSection.tsx`
- Animation library: GSAP ScrollTrigger (lazy-loaded)
- Steps sourced from i18n JSON: `howItWorks.steps` (array of 4 objects)
- Images: agenda.png (mobile), shift-details.png (desktop), create-shift.png (desktop), invoice.png (mobile)
- Icons: Lucide React (CalendarPlus, CheckCircle, Clock, FileText)

**Acceptance Criteria:**

- Section renders with 4 step cards in responsive grid (1 col mobile → 2 col tablet → 2 col desktop)
- Each card includes: Lucide icon, step number, title, description, and OptimizedImage component
- Images use WebP format with PNG fallback via `<picture>` element
- Images lazy-loaded with `loading="lazy"` and `decoding="async"`
- Cards fade in from bottom (opacity: 0 → 1, translateY: 50px → 0px) when scrolled into view
- Staggered animation: 0.2s delay per card
- ScrollTrigger start point: "top 80%" (animation begins when card enters bottom 20% of viewport)
- Animation reverses on scroll up (toggleActions: 'play none none reverse')
- Clean up ScrollTrigger instances on component unmount

#### Scenario: User scrolls to How It Works section on desktop

**Given** the user has scrolled past the hero and ReadyTo sections
**When** the HowItWorksSection enters the viewport (top 80%)
**Then** the first step card (Post or find a shift) fades in from bottom over 0.8s
**And** 0.2s later, the second step card (Confirm details) fades in
**And** 0.2s later, the third step card (Track hours) fades in
**And** 0.2s later, the fourth step card (Generate invoices) fades in
**And** all animations complete smoothly at 60fps (validated via Chrome DevTools Performance)
**And** when the user scrolls back up, the cards fade out in reverse order

#### Scenario: User views section with reduced motion preference enabled

**Given** the user has enabled "reduce motion" in system preferences
**When** the HowItWorksSection enters the viewport
**Then** all 4 step cards display immediately in final state (opacity: 1, translateY: 0)
**And** no ScrollTrigger animations are initialized
**And** no GSAP library is loaded (no dynamic import)
**And** the `useScrollAnimation` hook returns early without initializing

---

### Requirement: The HowItWorksSection component SHALL display optimized images with responsive sources (mobile vs desktop)

**Description:**
Each step card MAY display an accompanying screenshot image that illustrates the workflow step. Images MUST be optimized for performance using WebP format with PNG fallback, and MUST use responsive image sources (mobile images for <768px, desktop images for ≥768px). All images MUST be lazy-loaded to improve initial page load performance.

**Context:**

- Mobile images (portrait): agenda.png (707×1425, 207KB), invoice.png (709×1378, 175KB)
- Desktop images (landscape/tall): shift-details.png (1998×1082, 192KB), create-shift.png (1060×1354, 138KB)
- OptimizedImage component: `src/pages/landing/components/OptimizedImage.tsx`
- WebP conversion script: `scripts/generate-webp.js`
- Target: Images <150KB (WebP format)

**Acceptance Criteria:**

- Images use `<picture>` element with WebP `<source>` and PNG `<img>` fallback
- Desktop images load at viewport ≥768px via media query `(min-width: 768px)`
- Mobile images load at viewport <768px (default source)
- All images have `loading="lazy"` attribute (below-fold optimization)
- All images have `decoding="async"` attribute (non-blocking decode)
- All images have descriptive `alt` text (<125 characters, WCAG AA compliant)
- Images have explicit `width` and `height` attributes to prevent CLS (Cumulative Layout Shift)
- WebP images are 25-35% smaller than PNG equivalents

#### Scenario: User loads page on mobile device (viewport 375px)

**Given** the user's viewport width is 375px (mobile)
**When** the HowItWorksSection scrolls into view
**Then** the browser loads mobile images (agenda.webp, invoice.webp)
**And** the browser does NOT load desktop images (shift-details.webp, create-shift.webp)
**And** images load in WebP format (verified via Network tab)
**And** PNG fallback is NOT used (WebP supported in modern mobile browsers)
**And** images load lazily (only when section enters viewport)

#### Scenario: User loads page on desktop device (viewport 1920px)

**Given** the user's viewport width is 1920px (desktop)
**When** the HowItWorksSection scrolls into view
**Then** the browser loads desktop images (shift-details.webp, create-shift.webp)
**And** the browser does NOT load mobile images (agenda.webp, invoice.webp)
**And** images load in WebP format (verified via Network tab)
**And** images load lazily (only when section enters viewport)

---

### Requirement: The HowItWorksSection component SHALL render all text content from i18n translations

**Description:**
All text content in the HowItWorksSection (section heading, step titles, step descriptions) MUST be sourced from i18n JSON files to support English, Portuguese (Brazil), and Spanish translations. The component MUST re-render with updated text when the user switches languages via the Navigation language selector.

**Context:**

- i18n files: `src/i18n/en.json`, `src/i18n/pt-BR.json`, `src/i18n/es.json`
- Translation keys:
  - `howItWorks.heading` (section title)
  - `howItWorks.steps` (array of 4 objects: `{ title, description }`)
- Language switching: User clicks EN | PT-BR | ES button in Navigation

**Acceptance Criteria:**

- Section heading sourced from `t('howItWorks.heading')`
- Steps array sourced from `t('howItWorks.steps', { returnObjects: true }) as Array<{ title: string; description: string }>`
- Component re-renders immediately when language changes
- No layout shift when switching languages (flexible card heights)
- Portuguese/Spanish text does not overflow card containers
- All 3 languages tested and validated

#### Scenario: User switches language from English to Portuguese

**Given** the HowItWorksSection is displaying in English
**When** the user clicks the "PT" button in the Navigation
**Then** the section heading updates to Portuguese ("Como funciona")
**And** all 4 step titles update to Portuguese
**And** all 4 step descriptions update to Portuguese
**And** no cards overflow or break layout
**And** the update completes within 300ms

---

### Requirement: The HowItWorksSection component SHALL display Lucide React icons that are theme-aware and accessible

**Description:**
Each step card MUST display a Lucide React icon that visually represents the workflow step. Icons MUST adapt to the current theme (light/dark mode) using semantic color classes and MUST be accessible to screen readers via proper aria attributes.

**Context:**

- Icon library: Lucide React (v0.562.0, already installed)
- Icons per step:
  1. Step 1 (Post/Find): `CalendarPlus`
  2. Step 2 (Confirm): `CheckCircle`
  3. Step 3 (Track): `Clock`
  4. Step 4 (Invoice): `FileText`
- Icon color: `text-primary` (adapts to light/dark theme)
- Icon size: `h-12 w-12` (mobile), `h-16 w-16` (desktop)

**Acceptance Criteria:**

- Icons import from `lucide-react` package (tree-shakeable, ~1-2KB per icon)
- Icons use semantic color class `text-primary` (theme-aware)
- Icons have consistent size: `h-12 w-12` (mobile), `md:h-16 md:w-16` (desktop)
- Icons include `aria-hidden="true"` attribute (decorative, text provides context)
- Icons render with `strokeWidth={1.5}` for consistent visual weight

#### Scenario: User toggles theme from light to dark mode

**Given** the HowItWorksSection is displaying in light mode
**When** the user clicks the theme toggle button in Navigation
**Then** all 4 step icons update to dark mode primary color
**And** the color transition completes within 300ms
**And** icons remain accessible (aria-hidden="true" unaffected by theme)

---

### Requirement: The HowItWorksSection component SHALL maintain responsive layout across all breakpoints

**Description:**
The HowItWorksSection MUST adapt its layout responsively across mobile, tablet, and desktop breakpoints using a mobile-first approach. Step cards MUST stack vertically on mobile, display in 2 columns on tablet, and remain 2 columns on desktop with increased spacing.

**Context:**

- Tailwind breakpoints:
  - Base (0-767px): 1 column (stacked)
  - md (768px+): 2 columns
  - lg (1024px+): 2 columns (increased padding)
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: `grid-cols-1 md:grid-cols-2 gap-8 md:gap-12`

**Acceptance Criteria:**

- Mobile (375px): Cards stack vertically, full width
- Tablet (768px): Cards display in 2 columns
- Desktop (1024px+): Cards remain 2 columns, increased gap
- No horizontal scrollbars at any breakpoint
- Images scale proportionally within cards (no distortion)
- Touch targets ≥44px×44px (WCAG 2.1 Level AAA) - N/A (no interactive elements in cards)

#### Scenario: User resizes browser from desktop to mobile

**Given** the user's viewport is 1920px wide (desktop)
**When** the user resizes the browser window to 375px (mobile)
**Then** the step cards reflow from 2 columns to 1 column
**And** images scale proportionally without distortion
**And** no horizontal scrollbar appears
**And** all text remains readable (no overflow)
**And** layout reflow completes smoothly without jank

