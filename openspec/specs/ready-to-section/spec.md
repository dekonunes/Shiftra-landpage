# ready-to-section Specification

## Purpose
TBD - created by archiving change implement-landing-hero-phase. Update Purpose after archive.
## Requirements
### Requirement: The ReadyToSection component SHALL render with CSS-driven phrase animation

The ReadyToSection component MUST render a section with static text "Are you ready to" followed by animated phrases that drop in from bottom, display, then drop out from top. The animation MUST be pure CSS (no JavaScript) and cycle through 8 phrases indefinitely.

**Context:**
- Component location: `src/pages/landing/components/ReadyToSection.tsx`
- Animation: CSS keyframes (already defined in `index.css` as `dropIn`)
- Phrases sourced from i18n JSON: `readyTo.phrases` (array of 8 phrases)
- Prefix text sourced from i18n JSON: `readyTo.prefix` ("Are you ready to")

**Acceptance Criteria:**
- Section renders with subtle background (`bg-muted/30`)
- Static text "Are you ready to" displays above animated container
- Animated container has fixed height with `overflow-hidden`
- Each phrase animates with `dropIn` keyframes
- Phrases are staggered with `nth-child` delays (1s apart)
- Animation duration is 8s per phrase
- Animation loops infinitely
- No JavaScript required for animation

#### Scenario: User views Ready To section

**Given** the user scrolls to the ReadyToSection
**When** the section enters the viewport
**Then** the static text "Are you ready to" displays at top
**And** the first phrase "ditch WhatsApp shift chaos for good?" drops in from bottom
**And** the phrase displays for ~6s in the center
**And** the phrase drops out from top
**And** the second phrase "manage shifts without missed messages?" drops in
**And** the cycle continues through all 8 phrases
**And** the animation runs smoothly at 60fps

#### Scenario: User has reduced motion preference enabled

**Given** the user has enabled "reduce motion" in system preferences
**When** the ReadyToSection component mounts
**Then** the static text "Are you ready to" displays
**And** the first phrase displays statically (no animation)
**And** the CSS animation is disabled via media query
**And** all phrases remain absolutely positioned (only first is visible)

---

### Requirement: The ReadyToSection component SHALL use staggered animation timing with nth-child delays

Each phrase MUST animate with a staggered delay using `nth-child` CSS selectors to create a continuous, seamless rotation effect. The timing MUST ensure only one phrase is visible at a time.

**Context:**
- 8 phrases total
- 8s animation duration per phrase
- 1s delay between phrase starts
- Total cycle: 8s (each phrase gets 1s entrance + 6s display + 1s exit)

**Acceptance Criteria:**
- Each phrase uses same `dropIn` animation
- Phrase 1 starts at 0s delay
- Phrase 2 starts at 1s delay
- Phrase 3 starts at 2s delay
- Phrase 4 starts at 3s delay
- Phrase 5 starts at 4s delay
- Phrase 6 starts at 5s delay
- Phrase 7 starts at 6s delay
- Phrase 8 starts at 7s delay
- Only one phrase is fully visible at any time
- No overlapping phrase visibility

#### Scenario: Animation timing validation

**Given** the ReadyToSection is rendered
**When** the animation starts (t=0s)
**Then** phrase 1 "ditch WhatsApp shift chaos for good?" is animating in
**When** animation reaches t=1s
**Then** phrase 1 is fully visible and displayed
**And** phrase 2 "manage shifts without missed messages?" is starting to animate in
**When** animation reaches t=2s
**Then** phrase 1 is animating out
**And** phrase 2 is fully visible
**And** phrase 3 "keep every shift detail in one place?" is starting to animate in
**When** animation reaches t=8s
**Then** phrase 8 is fully visible
**And** phrase 1 is starting to animate in again (loop restart)

---

### Requirement: The ReadyToSection component SHALL implement mobile-first responsive design

The ReadyToSection MUST implement mobile-first responsive design with progressive text scaling and container height adjustments across breakpoints.

**Context:**
- Tailwind breakpoints: sm (640px), md (768px), lg (1024px)
- Container max-width: 4xl (896px)
- Centered layout with horizontal padding
- Progressive text scaling for both static and animated text

**Acceptance Criteria:**
- Base (mobile): Compact spacing, smaller text
- sm (640px+): Medium text size
- lg (1024px+): Large text size
- Animated container height: `h-10 sm:h-12 lg:h-14`
- Static text size: `text-2xl sm:text-3xl lg:text-4xl`
- Animated text size: `text-2xl sm:text-3xl lg:text-4xl`
- No horizontal scrollbars at any viewport width
- No layout shift when resizing viewport

#### Scenario: User views section on mobile (375px width)

**Given** the user loads the landing page on a mobile device
**When** the ReadyToSection renders
**Then** the static text "Are you ready to" displays at 24px (text-2xl)
**And** the animated container has height of 40px (h-10)
**And** the animated phrases display at 24px (text-2xl)
**And** all text fits within viewport width
**And** no horizontal scrollbar appears

#### Scenario: User resizes browser from mobile to desktop

**Given** the ReadyToSection is rendered at 375px width
**When** the viewport width increases to 1024px (desktop)
**Then** the static text size increases from 24px to 36px (text-4xl)
**And** the animated container height increases from 40px to 56px (h-14)
**And** the animated phrases size increases from 24px to 36px (text-4xl)
**And** no layout shift or content reflow occurs

---

### Requirement: The ReadyToSection component SHALL integrate with i18n system for multi-language support

All text content in the ReadyToSection MUST be sourced from i18n JSON files using the `useTranslation` hook. The component MUST support switching between English, Portuguese (pt-BR), and Spanish without remounting.

**Context:**
- i18n hook: `useTranslation()` from `react-i18next`
- Translation keys:
  - `readyTo.prefix` (string)
  - `readyTo.phrases` (array of 8 strings)
- Language switcher in Navigation component

**Acceptance Criteria:**
- All text content uses `t()` function from `useTranslation()`
- Phrases array retrieved with `returnObjects: true` option
- Language changes reflect immediately without component remount
- No phrase overflow or layout breaks in Portuguese/Spanish
- TypeScript types enforce `phrases` as `string[]`
- Container width adapts to longest phrase in any language

#### Scenario: User switches language while section is visible

**Given** the Ready To animation is running in English
**And** the current phrase is "generate invoices in one click?"
**When** the user clicks the "PT" language button
**Then** all phrases update to Portuguese immediately
**And** the animation continues without interruption
**And** the static prefix updates to Portuguese ("Você está pronto para")
**And** no layout shift occurs

#### Scenario: Portuguese translation does not overflow container

**Given** the language is set to Portuguese (pt-BR)
**When** the longest phrase is displayed
**Then** the phrase fits within the animated text container
**And** the container width is `w-full` (100% of parent)
**And** text wraps to multiple lines if needed (use `text-center`)
**And** no horizontal scrollbar appears
**And** the container height accommodates wrapped text

---

### Requirement: The ReadyToSection component SHALL respect prefers-reduced-motion for accessibility

When the user has enabled "reduce motion" in their system preferences, the section MUST display a static phrase instead of animating. This ensures accessibility compliance with WCAG 2.1 Level AAA (Guideline 2.3.3).

**Context:**
- Media query: `@media (prefers-reduced-motion: reduce)`
- Fallback: Display first phrase only, no animation
- CSS-driven detection (no JavaScript required)

**Acceptance Criteria:**
- CSS includes `@media (prefers-reduced-motion: reduce)` rule
- Rule disables animation: `animation: none`
- Rule changes positioning: `position: static` (removes absolute)
- Only first phrase is visible in reduced motion mode
- No JavaScript required for motion detection

#### Scenario: User with reduced motion enabled views section

**Given** the user has enabled "reduce motion" in system preferences
**When** the ReadyToSection renders
**Then** the static text "Are you ready to" displays
**And** the first phrase "ditch WhatsApp shift chaos for good?" displays statically
**And** no drop-in animation plays
**And** no other phrases are visible
**And** the phrase remains visible indefinitely (no cycling)

---

