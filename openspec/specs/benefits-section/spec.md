# benefits-section Specification

## Purpose
TBD - created by archiving change implement-landing-core-sections. Update Purpose after archive.
## Requirements
### Requirement: The BenefitsSection component SHALL render outcome cards with animated number statistics

**Description:**
The BenefitsSection component MUST render 4 outcome cards that showcase concrete benefits with animated statistics. Each card MUST display an icon, a headline value (e.g., "5 hours/week", "80%", "Zero"), and a description. The number values MUST animate from 0 to the target value when the card scrolls into view using GSAP number interpolation, and the animation MUST respect user motion preferences.

**Context:**

- Component location: `src/pages/landing/components/BenefitsSection.tsx`
- Card component: `src/pages/landing/components/BenefitCard.tsx`
- Animation library: GSAP ScrollTrigger (lazy-loaded)
- Custom hook: `useCountUpAnimation` (wraps GSAP number interpolation)
- Benefits sourced from i18n JSON: `benefits.outcomes` (array of 4 objects)
- Icons: Lucide React (Clock, FileCheck, CheckCircle, TrendingUp)

**Acceptance Criteria:**

- Section renders with 4 benefit cards in responsive grid (1 col mobile → 2 col tablet → 4 col desktop)
- Each card includes: Lucide icon, animated number, description
- Numbers animate from 0 to target value when card enters viewport (ScrollTrigger: "top 80%")
- Number animation duration: 2 seconds
- Number animation easing: `power1.out` (starts fast, slows down)
- Animation triggers only once per page load (toggleActions: 'play none none none')
- Supports integer values (e.g., 5) and percentage values (e.g., 80%)
- Clean up ScrollTrigger instances on component unmount

#### Scenario: User scrolls to Benefits section on desktop

**Given** the user has scrolled past the Features section
**When** the BenefitsSection enters the viewport (top 80%)
**Then** the first benefit card (Save 5 hours/week) becomes visible
**And** the number "5" animates from 0 to 5 over 2 seconds
**And** 0.2s later, the second benefit card (Reduce invoicing time by 80%) becomes visible
**And** the number "80%" animates from 0% to 80% over 2 seconds
**And** staggered reveals continue for all 4 benefit cards
**And** all animations complete smoothly at 60fps (validated via Chrome DevTools Performance)
**And** when the user scrolls back up and back down, the numbers remain at target values (no re-animation)

#### Scenario: User views section with reduced motion preference enabled

**Given** the user has enabled "reduce motion" in system preferences
**When** the BenefitsSection enters the viewport
**Then** all 4 benefit cards display immediately with final number values (no animation)
**And** no ScrollTrigger animations are initialized
**And** no GSAP library is loaded (no dynamic import)
**And** the `useCountUpAnimation` hook returns early without initializing

---

### Requirement: The BenefitsSection component SHALL display concrete outcome statistics sourced from i18n translations

**Description:**
The BenefitsSection MUST render 4 concrete outcome benefits sourced from i18n JSON files. Each benefit MUST include a numeric value (e.g., "5 hours/week", "80%", "Zero", "Get paid faster") and a description that communicates the business value to users.

**Context:**

- i18n files: `src/i18n/en.json`, `src/i18n/pt-BR.json`, `src/i18n/es.json`
- Translation keys:
  - `benefits.heading` (section title: "Concrete outcomes")
  - `benefits.outcomes` (array of 4 objects: `{ value, description, suffix? }`)
- Benefits (from LANDING_PAGE.md lines 162-165):
  1. "Save 5 hours/week on admin"
  2. "Reduce invoicing time by 80%"
  3. "Zero missed shifts with automatic reminders"
  4. "Get paid faster with one-click invoicing"

**Acceptance Criteria:**

- Section heading sourced from `t('benefits.heading')`
- Benefits sourced from `t('benefits.outcomes', { returnObjects: true }) as Array<{ value: string; description: string; suffix?: string }>`
- Each benefit card renders with appropriate Lucide icon:
  - "Save 5 hours/week" → `Clock` or `Zap`
  - "Reduce invoicing time by 80%" → `FileCheck` or `Gauge`
  - "Zero missed shifts" → `CheckCircle` or `Shield`
  - "Get paid faster" → `TrendingUp` or `Wallet`
- Numeric values extracted from `value` prop and passed to animation hook via `data-target` attribute
- Suffix (e.g., "%", " hours") extracted from `suffix` prop and passed via `data-suffix` attribute
- Component re-renders immediately when language changes

#### Scenario: User switches language from English to Portuguese

**Given** the BenefitsSection is displaying in English
**When** the user clicks the "PT" button in the Navigation
**Then** the section heading updates to Portuguese ("Resultados concretos")
**And** all 4 benefit descriptions update to Portuguese
**And** numeric values remain consistent across languages (5, 80%, Zero, etc.)
**And** no cards overflow or break layout
**And** the update completes within 300ms

---

### Requirement: The useCountUpAnimation hook SHALL animate numbers from 0 to target value using GSAP interpolation

**Description:**
The useCountUpAnimation custom hook MUST provide a reusable abstraction for animating numbers from 0 to a target value when the element scrolls into view. The hook MUST support integer values, decimal values, and optional suffixes (e.g., "%", " hours"). The hook MUST use GSAP's `innerText` interpolation and ScrollTrigger for viewport detection.

**Context:**

- Hook location: `src/pages/landing/hooks/useCountUpAnimation.ts`
- GSAP feature: Number interpolation via `gsap.from({ innerText: 0 })`
- ScrollTrigger configuration: `{ trigger: element, start: 'top 80%', toggleActions: 'play none none none' }`
- Data attributes:
  - `data-target`: Target numeric value (e.g., "80")
  - `data-suffix`: Optional suffix to append (e.g., "%")

**Acceptance Criteria:**

- Hook accepts `target` (CSS selector) and `enabled` (boolean) options
- Hook lazy-loads GSAP and ScrollTrigger via dynamic import
- Hook queries all elements matching `target` selector
- For each element:
  - Reads `data-target` attribute (parses as float)
  - Reads `data-suffix` attribute (defaults to empty string)
  - Creates GSAP tween: `from: { innerText: 0 }` to target value
  - Applies `snap: { innerText: 1 }` for integer values (or `0.1` for decimals)
  - Applies `duration: 2`, `ease: 'power1.out'`
  - Applies ScrollTrigger with `start: 'top 80%'`, `toggleActions: 'play none none none'`
  - Updates `innerText` on each frame: `element.innerText = Math.ceil(this.targets()[0].innerText) + suffix`
- Hook cleans up ScrollTrigger instances on unmount

#### Scenario: Integer value animation (5 hours)

**Given** a benefit card has `data-target="5"` and `data-suffix=" hours"`
**When** the card scrolls into viewport (top 80%)
**Then** the number animates from 0 to 5 over 2 seconds
**And** the number snaps to integer values (0, 1, 2, 3, 4, 5) - no decimals
**And** the suffix " hours" is appended on each frame ("0 hours", "1 hours", ..., "5 hours")
**And** the animation completes smoothly without dropped frames

#### Scenario: Percentage value animation (80%)

**Given** a benefit card has `data-target="80"` and `data-suffix="%"`
**When** the card scrolls into viewport (top 80%)
**Then** the number animates from 0 to 80 over 2 seconds
**And** the number snaps to integer values (0, 10, 20, ..., 80)
**And** the suffix "%" is appended on each frame ("0%", "10%", ..., "80%")
**And** the animation completes smoothly without dropped frames

---

### Requirement: The BenefitCard component SHALL render a reusable card with icon, animated number, and description

**Description:**
The BenefitCard component MUST be a reusable component that renders a single benefit card with a Lucide icon, an animated number value, and a description. The card MUST use the shadcn/ui Card component as its base and MUST adapt to the current theme (light/dark mode) using semantic color classes.

**Context:**

- Component location: `src/pages/landing/components/BenefitCard.tsx`
- Base component: shadcn/ui Card (`npx shadcn@latest add card`)
- Props interface:
  ```typescript
  interface BenefitCardProps {
    icon: LucideIcon;
    value: string; // e.g., "5", "80"
    suffix?: string; // e.g., " hours/week", "%"
    description: string;
  }
  ```
- Styling: `p-6 text-center hover:shadow-lg transition-shadow`

**Acceptance Criteria:**

- Component accepts `icon`, `value`, `suffix`, and `description` props
- Icon renders at top of card, `h-12 w-12` in `text-primary` color
- Value renders as `<span>` with `text-4xl font-bold text-foreground` and classes `stat-number data-target={value} data-suffix={suffix || ''}`
- Description renders as `<p>` with `text-sm text-muted-foreground mt-2`
- Card uses semantic classes: `bg-card`, `border-border`, `text-card-foreground`
- Hover effect: `hover:shadow-lg transition-shadow duration-300`
- Card is fully keyboard-accessible (no interactive elements)

#### Scenario: BenefitCard renders with animated number

**Given** the BenefitsSection is rendering
**When** a BenefitCard component mounts with `value="80"` and `suffix="%"`
**Then** the card renders with initial value "0%"
**And** the `useCountUpAnimation` hook detects the `.stat-number` element
**And** when the card scrolls into view, the number animates from "0%" to "80%"
**And** the description remains static throughout the animation

---

### Requirement: The BenefitsSection component SHALL maintain responsive grid layout across all breakpoints

**Description:**
The BenefitsSection MUST adapt its layout responsively across mobile, tablet, and desktop breakpoints using a mobile-first approach. Benefit cards MUST stack vertically on mobile, display in 2 columns on tablet, and display in 4 columns on desktop with consistent spacing.

**Context:**

- Tailwind breakpoints:
  - Base (0-767px): 1 column (stacked)
  - md (768px+): 2 columns
  - lg (1024px+): 4 columns
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8`

**Acceptance Criteria:**

- Mobile (375px): Cards stack vertically, full width
- Tablet (768px): Cards display in 2 columns
- Desktop (1024px+): Cards display in 4 columns (single row)
- No horizontal scrollbars at any breakpoint
- Cards have equal heights within each row (use CSS grid auto-rows)
- Vertical alignment maintained (no jagged rows)

#### Scenario: User resizes browser from desktop to mobile

**Given** the user's viewport is 1920px wide (desktop)
**When** the user resizes the browser window to 375px (mobile)
**Then** the benefit cards reflow from 4 columns to 1 column
**And** no horizontal scrollbar appears
**And** all text remains readable (no overflow)
**And** animated numbers remain visible and properly sized
**And** layout reflow completes smoothly without jank

