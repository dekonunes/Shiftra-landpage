# hero-section Specification

## Purpose
TBD - created by archiving change implement-landing-hero-phase. Update Purpose after archive.
## Requirements
### Requirement: The HeroSection component SHALL render a full-viewport hero section with animated typewriter headline

The HeroSection component MUST render a full-viewport hero section with an animated headline that displays "No more {rotating phrase}" where the phrase types in character-by-character, holds for 1.5 seconds, then deletes and cycles to the next phrase. The animation MUST be powered by GSAP and respect user motion preferences.

**Context:**

- Component location: `src/pages/landing/components/HeroSection.tsx`
- Animation library: GSAP (lazy-loaded)
- Phrases sourced from i18n JSON: `hero.phrases` (array of 4 phrases)
- Prefix text sourced from i18n JSON: `hero.prefixText` ("No more")

**Acceptance Criteria:**

- Hero section renders with minimum height of `calc(100vh - 4rem)` (full viewport minus nav)
- Headline displays "No more" prefix in primary brand color (`text-primary`)
- Animated phrase types in character-by-character with cursor
- Phrase holds for 1.5 seconds after typing completes
- Phrase deletes character-by-character
- Cycle repeats through all 4 phrases indefinitely
- GSAP library lazy-loaded via dynamic import
- Animation FPS maintains 60fps on desktop, >30fps on mobile
- Clean up GSAP tweens on component unmount

#### Scenario: User views hero section on desktop

**Given** the user loads the landing page on a desktop browser
**When** the HeroSection component mounts
**Then** the headline displays "No more" in green (primary color)
**And** the first phrase "WhatsApp group chaos" types in character-by-character in green
**And** the phrase holds for 1.5 seconds
**And** the phrase deletes character-by-character
**And** the second phrase "invoice forms" types in character-by-character in dark gray
**And** the cycle continues through all 4 phrases
**And** the animation runs at 60fps (validated via Chrome DevTools Performance tab)

#### Scenario: User has reduced motion preference enabled

**Given** the user has enabled "reduce motion" in system preferences
**When** the HeroSection component mounts
**Then** the headline displays "No more" in green (primary color)
**And** the first phrase "WhatsApp group chaos" displays statically (no animation)
**And** no GSAP library is loaded (no dynamic import)
**And** the `useTypewriter` hook returns early without initializing animation

---

### Requirement: The HeroSection component SHALL display theme-aware phrase colors that meet WCAG AA contrast standards

Each rotating phrase MUST display in a specific color that provides WCAG AA contrast (4.5:1 for normal text) in both light and dark themes. The phrase colors MUST match the design specification and adapt dynamically when the user toggles the theme.

**Context:**

- Phrases and colors (LANDING_PAGE.md lines 105-109):
  1. "WhatsApp group chaos" - Green
  2. "invoice forms" - White (dark mode) / Dark gray (light mode)
  3. "miscommunication" - Yellow
  4. "unknown employers" - Red
- Theme context: `useTheme()` from `ThemeContext.tsx`
- Color values defined in component (not CSS variables)

**Acceptance Criteria:**

- Phrase color changes dynamically based on `theme` context value
- Light mode colors pass WCAG AA (4.5:1 contrast on white background)
- Dark mode colors pass WCAG AA (4.5:1 contrast on dark background)
- Color transitions smoothly when user toggles theme mid-animation
- No color flashing or jarring transitions

#### Scenario: User toggles theme during animation

**Given** the hero animation is running in light mode
**And** the current phrase is "miscommunication" (yellow)
**When** the user clicks the theme toggle button
**Then** the phrase color transitions to dark mode yellow (`rgb(250, 204, 21)`)
**And** the transition completes within 300ms
**And** the animation continues without interruption
**And** subsequent phrases use dark mode color palette

#### Scenario: Contrast validation in light mode

**Given** the HeroSection is rendering in light mode
**When** each phrase is displayed
**Then** "WhatsApp group chaos" displays in `rgb(34, 197, 94)` (green) with 4.6:1 contrast
**And** "invoice forms" displays in `rgb(51, 51, 51)` (dark gray) with 12.6:1 contrast
**And** "miscommunication" displays in `rgb(161, 98, 7)` (dark yellow) with 4.5:1 contrast
**And** "unknown employers" displays in `rgb(220, 38, 38)` (dark red) with 5.3:1 contrast
**And** all contrast ratios meet WCAG AA minimum (4.5:1)

---

### Requirement: The HeroSection component SHALL display CTAs and subheadline with responsive layout

The HeroSection MUST display a subheadline below the animated headline, followed by primary and secondary call-to-action buttons. On mobile, buttons MUST stack vertically; on desktop, they MUST display horizontally.

**Context:**

- Subheadline text: `hero.subheadline` (i18n)
- Primary CTA text: `hero.primaryCta` (i18n)
- Secondary CTA text: `hero.secondaryCta` (i18n)
- Trust line text: `hero.trustLine` (i18n)
- Button component: shadcn/ui `Button` from `@/components/ui/button`

**Acceptance Criteria:**

- Subheadline displays in muted foreground color (`text-muted-foreground`)
- Subheadline uses responsive text sizing: `text-lg sm:text-xl`
- Primary CTA uses Button component with `size="lg"` and default variant
- Secondary CTA uses Button component with `size="lg"` and `variant="outline"`
- Buttons stack vertically on mobile (`flex-col`)
- Buttons display horizontally on desktop (`sm:flex-row`)
- Trust line displays below CTAs in small muted text
- All elements are keyboard-accessible (Tab navigation)

#### Scenario: User views CTAs on mobile (375px width)

**Given** the user loads the landing page on a mobile device
**When** the HeroSection renders
**Then** the subheadline displays at `text-lg` size (18px)
**And** the primary CTA button displays at full width (`w-full`)
**And** the secondary CTA button displays below primary CTA at full width
**And** both buttons have 16px gap between them (`gap-4`)
**And** the trust line "Made for Australia" displays below buttons

#### Scenario: User navigates CTAs with keyboard

**Given** the HeroSection is rendered
**When** the user presses Tab key
**Then** focus moves to the primary CTA button
**And** the button shows visible focus ring
**When** the user presses Tab key again
**Then** focus moves to the secondary CTA button
**And** the button shows visible focus ring
**When** the user presses Enter key
**Then** the button click handler fires (or navigation occurs)

---

### Requirement: The HeroSection component SHALL implement mobile-first responsive design across all breakpoints

The HeroSection MUST implement mobile-first responsive design with progressive enhancement for larger screens. Text sizing, spacing, and layout MUST adapt smoothly across all breakpoints.

**Context:**

- Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Container max-width: 4xl (896px)
- Centered layout with horizontal padding
- Progressive text scaling for headline

**Acceptance Criteria:**

- Base (mobile): Single column, centered text, compact spacing
- sm (640px+): Larger text, horizontal CTA layout
- lg (1024px+): Maximum headline size, increased spacing
- Container uses `max-w-4xl mx-auto` for centering
- Horizontal padding: `px-4` on mobile, `sm:px-6`, `lg:px-8`
- Headline size: `text-4xl sm:text-5xl lg:text-6xl`
- No horizontal scrollbars at any viewport width
- No layout shift when resizing viewport

#### Scenario: User resizes browser from mobile to desktop

**Given** the user loads the landing page at 375px width
**When** the viewport width increases to 768px (tablet)
**Then** the headline text size increases from 36px to 48px
**And** the CTA buttons switch from vertical stack to horizontal layout
**And** the subheadline text size increases from 18px to 20px
**When** the viewport width increases to 1024px (desktop)
**Then** the headline text size increases from 48px to 60px
**And** the container width is constrained to 896px (max-w-4xl)
**And** no layout shift or content reflow occurs

---

### Requirement: The HeroSection component SHALL integrate with i18n system for multi-language support

All text content in the HeroSection MUST be sourced from i18n JSON files using the `useTranslation` hook. The component MUST support switching between English, Portuguese (pt-BR), and Spanish without remounting.

**Context:**

- i18n hook: `useTranslation()` from `react-i18next`
- Translation keys:
  - `hero.prefixText` (string)
  - `hero.phrases` (array of 4 strings)
  - `hero.subheadline` (string)
  - `hero.primaryCta` (string)
  - `hero.secondaryCta` (string)
  - `hero.trustLine` (string)
- Language switcher in Navigation component

**Acceptance Criteria:**

- All text content uses `t()` function from `useTranslation()`
- Phrases array retrieved with `returnObjects: true` option
- Language changes reflect immediately without component remount
- Animation updates to new language phrases on next cycle
- No phrase overflow or layout breaks in Portuguese/Spanish
- TypeScript types enforce `phrases` as `string[]`

#### Scenario: User switches language during animation

**Given** the hero animation is running in English
**And** the current phrase is "invoice forms"
**When** the user clicks the "PT" language button
**Then** the current phrase completes its cycle (type + hold + delete)
**And** the next phrase types in Portuguese ("caos de grupos de WhatsApp")
**And** the subheadline updates to Portuguese
**And** the CTA buttons update to Portuguese
**And** no layout shift occurs due to longer text

#### Scenario: Portuguese translation does not overflow container

**Given** the language is set to Portuguese (pt-BR)
**When** the longest phrase "caos de grupos de WhatsApp" is displayed
**Then** the phrase fits within the animated text container
**And** the container width is at least `min-w-[300px]` on mobile
**And** the container width is at least `min-w-[400px]` on desktop (sm+)
**And** no horizontal scrollbar appears

---

