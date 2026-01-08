# features-section Specification

## Purpose
TBD - created by archiving change implement-landing-core-sections. Update Purpose after archive.
## Requirements
### Requirement: The FeaturesSection component SHALL render worker and business feature cards in side-by-side layouts

**Description:**
The FeaturesSection component MUST render two distinct feature sets (Workers and Businesses) in a responsive side-by-side layout. Each feature MUST be displayed as a card with an icon, title, and description. Cards MUST fade in with a stagger effect when scrolled into view using GSAP ScrollTrigger, and the layout MUST adapt responsively from stacked (mobile) to side-by-side columns (desktop).

**Context:**

- Component location: `src/pages/landing/components/FeaturesSection.tsx`
- Card component: `src/pages/landing/components/FeatureCard.tsx`
- Animation library: GSAP ScrollTrigger (lazy-loaded)
- Features sourced from i18n JSON: `features.workers` and `features.businesses` (arrays of objects)
- Icons: Lucide React (Briefcase, Calendar, DollarSign, FileText, Bell, Users, MessageSquare, Globe, UserPlus, BarChart)

**Acceptance Criteria:**

- Section renders with two subsections: "For Workers" and "For Businesses"
- Each subsection displays feature cards in responsive grid (1 col mobile → 2 col tablet → 3 col desktop)
- Each card includes: Lucide icon, feature title, feature description
- Cards use shadcn/ui Card component with hover effect (`hover:shadow-lg transition-shadow`)
- Cards fade in from bottom (opacity: 0 → 1, translateY: 50px → 0px) when scrolled into view
- Staggered animation: 0.15s delay per card (faster than HowItWorks for more cards)
- ScrollTrigger start point: "top 80%"
- Animation reverses on scroll up (toggleActions: 'play none none reverse')
- Clean up ScrollTrigger instances on component unmount

#### Scenario: User scrolls to Features section on desktop

**Given** the user has scrolled past the HowItWorks section
**When** the FeaturesSection enters the viewport (top 80%)
**Then** the "For Workers" heading fades in
**And** the first worker feature card (Find and accept shifts) fades in from bottom over 0.6s
**And** 0.15s later, the second worker feature card fades in
**And** staggered fade-ins continue for all 5 worker feature cards
**And** after worker cards complete, business feature cards begin staggered fade-in
**And** all animations complete smoothly at 60fps (validated via Chrome DevTools Performance)
**And** when the user scrolls back up, the cards fade out in reverse order

#### Scenario: User views section with reduced motion preference enabled

**Given** the user has enabled "reduce motion" in system preferences
**When** the FeaturesSection enters the viewport
**Then** all feature cards display immediately in final state (opacity: 1, translateY: 0)
**And** no ScrollTrigger animations are initialized
**And** no GSAP library is loaded (no dynamic import)
**And** the `useScrollAnimation` hook returns early without initializing

---

### Requirement: The FeaturesSection component SHALL display worker-specific features sourced from i18n translations

**Description:**
The FeaturesSection MUST render worker-specific features sourced from i18n JSON files. Each feature MUST include a title and description that communicate the value proposition for workers (shift finding, calendar management, earnings tracking, payment tracking, invoice generation).

**Context:**

- i18n files: `src/i18n/en.json`, `src/i18n/pt-BR.json`, `src/i18n/es.json`
- Translation keys:
  - `features.workersHeading` (section title: "For Workers")
  - `features.workers` (array of 5 objects: `{ title, description }`)
- Worker features (from LANDING_PAGE.md lines 54-60):
  1. Find and accept shifts
  2. Shift calendar and reminders
  3. Earnings visibility (estimate and history)
  4. Payment tracking (paid vs overdue)
  5. One-click invoice generation and sharing

**Acceptance Criteria:**

- Worker heading sourced from `t('features.workersHeading')`
- Worker features sourced from `t('features.workers', { returnObjects: true }) as Array<{ title: string; description: string }>`
- Each feature card renders with appropriate Lucide icon:
  - "Find and accept shifts" → `Briefcase`
  - "Shift calendar and reminders" → `Calendar`
  - "Earnings visibility" → `TrendingUp`
  - "Payment tracking" → `DollarSign`
  - "One-click invoice generation" → `FileText`
- Component re-renders immediately when language changes
- No layout shift when switching languages (flexible card heights)

#### Scenario: User switches language from English to Portuguese

**Given** the FeaturesSection is displaying in English
**When** the user clicks the "PT" button in the Navigation
**Then** the "For Workers" heading updates to Portuguese ("Para Trabalhadores")
**And** all 5 worker feature titles update to Portuguese
**And** all 5 worker feature descriptions update to Portuguese
**And** no cards overflow or break layout
**And** the update completes within 300ms

---

### Requirement: The FeaturesSection component SHALL display business-specific features sourced from i18n translations

**Description:**
The FeaturesSection MUST render business-specific features sourced from i18n JSON files. Each feature MUST include a title and description that communicate the value proposition for businesses (shift posting, crew management, communication tools, translation, worker discovery, invoice management).

**Context:**

- i18n files: `src/i18n/en.json`, `src/i18n/pt-BR.json`, `src/i18n/es.json`
- Translation keys:
  - `features.businessesHeading` (section title: "For Businesses")
  - `features.businesses` (array of 5+ objects: `{ title, description }`)
- Business features (from LANDING_PAGE.md lines 62-69):
  1. Post shifts and request specific workers
  2. Crew-wide shift reminders
  3. Crew group chat
  4. One-tap translation for multi-language crews
  5. Store invoice details once (ABN, address)

**Acceptance Criteria:**

- Business heading sourced from `t('features.businessesHeading')`
- Business features sourced from `t('features.businesses', { returnObjects: true }) as Array<{ title: string; description: string }>`
- Each feature card renders with appropriate Lucide icon:
  - "Post shifts and request workers" → `UserPlus` or `Users`
  - "Crew-wide shift reminders" → `Bell`
  - "Crew group chat" → `MessageSquare`
  - "One-tap translation" → `Globe`
  - "Store invoice details once" → `FileCheck` or `Database`
- Component re-renders immediately when language changes
- No layout shift when switching languages (flexible card heights)

#### Scenario: User switches language from English to Spanish

**Given** the FeaturesSection is displaying in English
**When** the user clicks the "ES" button in the Navigation
**Then** the "For Businesses" heading updates to Spanish ("Para Empresas")
**And** all 5 business feature titles update to Spanish
**And** all 5 business feature descriptions update to Spanish
**And** no cards overflow or break layout
**And** the update completes within 300ms

---

### Requirement: The FeatureCard component SHALL render a reusable card with icon, title, and description

**Description:**
The FeatureCard component MUST be a reusable component that renders a single feature card with a Lucide icon, title, and description. The card MUST use the shadcn/ui Card component as its base and MUST adapt to the current theme (light/dark mode) using semantic color classes.

**Context:**

- Component location: `src/pages/landing/components/FeatureCard.tsx`
- Base component: shadcn/ui Card (`npx shadcn@latest add card`)
- Props interface:
  ```typescript
  interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
  }
  ```
- Styling: `p-6 hover:shadow-lg transition-shadow`

**Acceptance Criteria:**

- Component accepts `icon`, `title`, and `description` props
- Icon renders at `h-8 w-8` (mobile), `md:h-10 md:w-10` (desktop) in `text-primary` color
- Title renders as `<h3>` with `text-lg font-semibold mb-2`
- Description renders as `<p>` with `text-sm text-muted-foreground`
- Card uses semantic classes: `bg-card`, `border-border`, `text-card-foreground`
- Hover effect: `hover:shadow-lg transition-shadow duration-300`
- Card is fully keyboard-accessible (no interactive elements, so no focus state needed)

#### Scenario: User hovers over a feature card

**Given** the user's cursor is not over any feature card
**When** the user hovers over a feature card
**Then** the card shadow increases from default to large (`shadow-lg`)
**And** the shadow transition completes smoothly over 300ms
**And** when the user moves the cursor away, the shadow returns to default

---

### Requirement: The FeaturesSection component SHALL maintain responsive layout with side-by-side columns

**Description:**
The FeaturesSection MUST adapt its layout responsively across mobile, tablet, and desktop breakpoints. On mobile, worker and business features MUST stack vertically. On tablet and desktop, they MUST display side-by-side with each subsection using a responsive grid for its feature cards.

**Context:**

- Tailwind breakpoints:
  - Base (0-767px): 1 column (stacked subsections)
  - md (768px+): 2 columns (side-by-side subsections)
  - lg (1024px+): Each subsection grid expands to 3 columns
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Subsection layout: `grid grid-cols-1 lg:grid-cols-2 gap-12`
- Feature card grid (per subsection): `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Acceptance Criteria:**

- Mobile (375px): Subsections stack vertically, feature cards stack within each subsection
- Tablet (768px): Subsections side-by-side, feature cards in 2 columns per subsection
- Desktop (1024px+): Subsections side-by-side, feature cards in 3 columns per subsection
- No horizontal scrollbars at any breakpoint
- Cards scale proportionally within grid (no distortion)
- Vertical alignment maintained (no jagged rows)

#### Scenario: User resizes browser from desktop to mobile

**Given** the user's viewport is 1920px wide (desktop)
**When** the user resizes the browser window to 375px (mobile)
**Then** the "For Workers" and "For Businesses" subsections reflow from side-by-side to stacked
**And** feature cards within each subsection reflow from 3 columns to 1 column
**And** no horizontal scrollbar appears
**And** all text remains readable (no overflow)
**And** layout reflow completes smoothly without jank

