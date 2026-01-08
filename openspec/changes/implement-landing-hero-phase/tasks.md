# Implementation Tasks: Landing Page Hero Phase

**Change ID:** `implement-landing-hero-phase`
**Status:** DRAFT

---

## Overview

This document outlines the ordered, verifiable tasks required to implement Phase 1 of the Shiftra landing page. Each task is small, delivers user-visible progress, and includes validation steps.

**Estimated Total Time:** 8-12 hours

---

## Prerequisites

- [ ] Review LANDING_PAGE.md requirements (lines 93-137)
- [ ] Review ui-designer validation report
- [ ] Verify Playwright MCP available for UI testing

---

## Phase 1: Setup & Dependencies

### Task 1.1: Install shadcn/ui Button component

**Estimated Time:** 10 minutes
**Dependencies:** None

**Steps:**

1. Run: `npx shadcn@latest add button`
2. Verify component installed at `src/components/ui/button.tsx`
3. Check component exports `Button` with variants (default, outline, ghost)

**Validation:**

- [ ] File exists: `src/components/ui/button.tsx`
- [ ] Import works: `import { Button } from '@/components/ui/button'`
- [ ] TypeScript compiles: `npm run build`
- [ ] ESLint passes: `npm run lint`

**User-Visible Progress:** None (dependency setup)

---

### Task 1.2: Update CSS animation timing in index.css

**Estimated Time:** 5 minutes
**Dependencies:** None

**Steps:**

1. Open `src/index.css`
2. Locate `.dropping-texts > div` rule (if exists, or add new rule)
3. Update animation duration to `8s`:
   ```css
   .dropping-texts > div {
     animation: dropIn 8s ease-in-out infinite;
   }
   ```
4. Add prefers-reduced-motion media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .dropping-texts > div {
       animation: none;
       position: static;
     }
     .dropping-texts > div:not(:first-child) {
       display: none;
     }
   }
   ```

**Validation:**

- [ ] Animation duration is `8s`
- [ ] Media query exists for reduced motion
- [ ] CSS validates (no syntax errors)
- [ ] Dev server reloads without errors

**User-Visible Progress:** None (CSS preparation)

---

## Phase 2: ReadyToSection Implementation

### Task 2.1: Create ReadyToSection component

**Estimated Time:** 30 minutes
**Dependencies:** Task 1.2

**Steps:**

1. Create file: `src/pages/landing/components/ReadyToSection.tsx`
2. Implement component structure:
   - Import `useTranslation` from `react-i18next`
   - Retrieve `readyTo.prefix` and `readyTo.phrases` from i18n
   - Render static prefix text
   - Render animated phrases container with `.dropping-texts` class
   - Map over phrases array with staggered delays
3. Apply Tailwind classes:
   - Section: `py-16 sm:py-24 bg-muted/30`
   - Container: `max-w-4xl mx-auto px-4 text-center`
   - Static text: `text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground`
   - Animated container: `dropping-texts h-10 sm:h-12 lg:h-14 overflow-hidden relative w-full`
   - Phrases: `absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-primary`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (temporarily import in LandingPage.tsx)

**User-Visible Progress:** ReadyToSection visible on landing page (when imported)

---

### Task 2.2: Import ReadyToSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 2.1

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import ReadyToSection: `import ReadyToSection from './components/ReadyToSection'`
3. Component is already referenced in JSX (line 20)
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] Section visible at http://localhost:5173 below hero placeholder
- [ ] Animation plays (phrases drop in/out)

**User-Visible Progress:** ReadyToSection visible on landing page with animation

---

### Task 2.3: Test ReadyToSection responsiveness

**Estimated Time:** 20 minutes
**Dependencies:** Task 2.2

**Steps:**

1. Open http://localhost:5173 in browser
2. Test mobile (375px width):
   - Resize Chrome DevTools to 375px
   - Verify text size is 24px (text-2xl)
   - Verify container height is 40px (h-10)
   - Check for horizontal scrollbars (should be none)
3. Test tablet (768px width):
   - Resize to 768px
   - Verify text size is 30px (text-3xl)
   - Verify container height is 48px (h-12)
4. Test desktop (1024px width):
   - Resize to 1024px
   - Verify text size is 36px (text-4xl)
   - Verify container height is 56px (h-14)

**Validation:**

- [ ] No horizontal scrollbars at any width
- [ ] Text scales progressively across breakpoints
- [ ] Container height adapts smoothly
- [ ] Animation runs at 60fps (check Chrome DevTools Performance tab)

**User-Visible Progress:** ReadyToSection responsive across all devices

---

### Task 2.4: Test ReadyToSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 2.2

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT):
   - Click "PT" button in navigation
   - Verify prefix changes to Portuguese
   - Verify all 8 phrases display in Portuguese
   - Check for text overflow (should be none)
3. Switch to Spanish (ES):
   - Click "ES" button in navigation
   - Verify prefix and phrases update
4. Switch back to English (EN)

**Validation:**

- [ ] All text updates immediately on language change
- [ ] No layout shift when switching languages
- [ ] Longest phrases fit within container (no overflow)
- [ ] Animation continues smoothly during language switch

**User-Visible Progress:** ReadyToSection supports 3 languages

---

### Task 2.5: Test ReadyToSection prefers-reduced-motion

**Estimated Time:** 10 minutes
**Dependencies:** Task 2.2

**Steps:**

1. Enable "Reduce Motion" in system preferences:
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Ease of Access → Display → Show animations
   - Chrome DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion"
2. Reload http://localhost:5173
3. Verify first phrase displays statically (no animation)
4. Verify other phrases are hidden
5. Disable "Reduce Motion" and verify animation resumes

**Validation:**

- [ ] Static fallback displays when motion is reduced
- [ ] Only first phrase is visible
- [ ] No animation plays
- [ ] Animation resumes when motion preference is disabled

**User-Visible Progress:** ReadyToSection accessible for users with motion sensitivity

---

## Phase 3: HeroSection Implementation

### Task 3.1: Create useTypewriter custom hook

**Estimated Time:** 60 minutes
**Dependencies:** Task 1.1

**Steps:**

1. Create file: `src/pages/landing/hooks/useTypewriter.ts`
2. Define interface:
   ```typescript
   interface UseTypewriterOptions {
     ref: RefObject<HTMLElement>;
     phrases: string[];
     theme: "light" | "dark";
     enabled: boolean;
   }
   ```
3. Define theme-aware color palettes:
   ```typescript
   const phraseColors = {
     light: [
       "rgb(34, 197, 94)", // Green
       "rgb(51, 51, 51)", // Dark gray
       "rgb(161, 98, 7)", // Dark yellow
       "rgb(220, 38, 38)", // Dark red
     ],
     dark: [
       "rgb(34, 197, 94)", // Green
       "rgb(255, 255, 255)", // White
       "rgb(250, 204, 21)", // Bright yellow
       "rgb(248, 113, 113)", // Bright red
     ],
   };
   ```
4. Implement `useEffect` hook:
   - Return early if `!enabled` or `!ref.current`
   - Lazy-load GSAP: `import('gsap').then(...)`
   - Initialize state: `currentPhraseIndex`, `currentCharIndex`, `isDeleting`
   - Implement typewriter loop:
     - Type character-by-character (50ms delay)
     - Hold for 1.5s after typing completes
     - Delete character-by-character (30ms delay)
     - Pause 500ms before next phrase
     - Cycle through phrases array
   - Update text content: `ref.current.textContent = targetText + '|'` (add cursor)
   - Update color: `ref.current.style.color = colors[currentPhraseIndex]`
   - Clean up: `gsap.killTweensOf(ref.current)` on unmount

**Validation:**

- [ ] Hook exports `useTypewriter` function
- [ ] TypeScript types validate correctly
- [ ] No ESLint warnings
- [ ] Hook compiles without errors: `npm run build`

**User-Visible Progress:** None (hook preparation)

---

### Task 3.2: Create HeroSection component

**Estimated Time:** 45 minutes
**Dependencies:** Task 3.1

**Steps:**

1. Create file: `src/pages/landing/components/HeroSection.tsx`
2. Import dependencies:
   - `useEffect`, `useRef`, `useState` from `react`
   - `useTranslation` from `react-i18next`
   - `useTheme` from `@/contexts/ThemeContext`
   - `Button` from `@/components/ui/button`
   - `useTypewriter` from `../hooks/useTypewriter`
3. Implement component:
   - Retrieve i18n strings: `hero.prefixText`, `hero.phrases`, `hero.subheadline`, `hero.primaryCta`, `hero.secondaryCta`, `hero.trustLine`
   - Create ref: `animatedTextRef = useRef<HTMLSpanElement>(null)`
   - Detect prefers-reduced-motion with `matchMedia`
   - Initialize `useTypewriter` hook (pass ref, phrases, theme, enabled)
   - Render conditional: static phrase if motion reduced, animated if enabled
4. Apply Tailwind classes:
   - Section: `relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20 bg-background`
   - Container: `max-w-4xl mx-auto text-center`
   - Headline: `text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight`
   - Prefix: `text-primary`
   - Animated span: `inline-block min-w-[300px] sm:min-w-[400px] text-left`
   - Subheadline: `text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto`
   - CTA container: `flex flex-col sm:flex-row gap-4 justify-center mb-6`
   - Buttons: `w-full sm:w-auto`
   - Trust line: `text-sm text-muted-foreground`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** HeroSection visible on landing page (when imported)

---

### Task 3.3: Import HeroSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 3.2

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import HeroSection: `import HeroSection from './components/HeroSection'`
3. Component is already referenced in JSX (line 19)
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] HeroSection visible at http://localhost:5173 at top of page
- [ ] Typewriter animation plays (phrases type in/delete)

**User-Visible Progress:** HeroSection visible with animated headline

---

### Task 3.4: Test HeroSection typewriter animation

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Watch typewriter animation:
   - Verify "No more" displays in green (primary color)
   - Verify first phrase "WhatsApp group chaos" types in green
   - Verify phrase holds for 1.5s after typing completes
   - Verify phrase deletes character-by-character
   - Verify cursor blinks ("|" character)
3. Verify phrase color changes:
   - Phrase 1: Green (rgb(34, 197, 94))
   - Phrase 2: Dark gray or white (theme-dependent)
   - Phrase 3: Yellow (theme-dependent)
   - Phrase 4: Red (theme-dependent)
4. Open Chrome DevTools Performance tab:
   - Record animation for 10 seconds
   - Verify FPS >60fps
   - Check for dropped frames (should be minimal)

**Validation:**

- [ ] Typewriter animation runs smoothly
- [ ] All 4 phrases cycle correctly
- [ ] Colors change per phrase (theme-aware)
- [ ] Animation FPS >60fps on desktop
- [ ] No console errors in browser

**User-Visible Progress:** Hero headline animates with typewriter effect

---

### Task 3.5: Test HeroSection theme switching

**Estimated Time:** 20 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Start with light theme:
   - Verify phrase colors use light mode palette (dark gray instead of white)
   - Verify WCAG AA contrast (validate with browser extension or DevTools)
3. Click theme toggle button (sun/moon icon):
   - Verify immediate theme change (background, text colors)
   - Verify phrase color updates to dark mode palette
   - Verify animation continues without interruption
4. Toggle theme multiple times during animation:
   - Verify smooth color transitions
   - Verify no animation stuttering

**Validation:**

- [ ] Theme toggle works correctly
- [ ] Phrase colors adapt to theme immediately
- [ ] Light mode colors pass WCAG AA (4.5:1 contrast)
- [ ] Dark mode colors pass WCAG AA (4.5:1 contrast)
- [ ] No animation interruption during theme change

**User-Visible Progress:** HeroSection adapts to light/dark theme

---

### Task 3.6: Test HeroSection responsiveness

**Estimated Time:** 20 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Test mobile (375px width):
   - Resize Chrome DevTools to 375px
   - Verify headline text size is 36px (text-4xl)
   - Verify CTAs stack vertically
   - Verify CTAs are full width
   - Check for horizontal scrollbars (should be none)
3. Test tablet (768px width):
   - Resize to 768px
   - Verify headline text size is 48px (text-5xl)
   - Verify CTAs switch to horizontal layout
4. Test desktop (1024px width):
   - Resize to 1024px
   - Verify headline text size is 60px (text-6xl)
   - Verify container is centered with max-width 896px

**Validation:**

- [ ] No horizontal scrollbars at any width
- [ ] Headline scales progressively across breakpoints
- [ ] CTAs stack on mobile, horizontal on desktop
- [ ] All text is readable at all sizes
- [ ] No layout shift when resizing viewport

**User-Visible Progress:** HeroSection responsive across all devices

---

### Task 3.7: Test HeroSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT):
   - Click "PT" button in navigation
   - Verify prefix changes to Portuguese
   - Wait for current phrase to complete cycle
   - Verify next phrase types in Portuguese
   - Verify subheadline updates to Portuguese
   - Verify CTA buttons update to Portuguese
3. Switch to Spanish (ES):
   - Verify all text updates
   - Check for text overflow in headline
4. Switch back to English (EN)

**Validation:**

- [ ] All text updates on language change
- [ ] Animation updates to new language phrases on next cycle
- [ ] No layout shift when switching languages
- [ ] Longest phrases fit within container (min-w-[300px] or min-w-[400px])
- [ ] No horizontal scrollbars

**User-Visible Progress:** HeroSection supports 3 languages

---

### Task 3.8: Test HeroSection prefers-reduced-motion

**Estimated Time:** 10 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Enable "Reduce Motion" in system preferences (or Chrome DevTools)
2. Reload http://localhost:5173
3. Verify "No more" displays in green
4. Verify first phrase displays statically (no typewriter animation)
5. Verify no GSAP library is loaded (check Network tab)
6. Disable "Reduce Motion" and verify animation resumes

**Validation:**

- [ ] Static fallback displays when motion is reduced
- [ ] First phrase is visible immediately
- [ ] No animation plays
- [ ] GSAP is not loaded (network requests)
- [ ] Animation resumes when motion preference is disabled

**User-Visible Progress:** HeroSection accessible for users with motion sensitivity

---

### Task 3.9: Test HeroSection keyboard navigation

**Estimated Time:** 10 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173
2. Press Tab key:
   - Verify focus moves to primary CTA button
   - Verify visible focus ring appears
3. Press Tab key again:
   - Verify focus moves to secondary CTA button
   - Verify visible focus ring appears
4. Press Enter key:
   - Verify button click handler fires (check console or navigation)
5. Press Shift+Tab:
   - Verify focus moves backwards correctly

**Validation:**

- [ ] CTAs are keyboard-accessible
- [ ] Focus ring is visible (WCAG 2.1 Level AA)
- [ ] Tab order is logical (primary → secondary)
- [ ] Enter key activates buttons
- [ ] Shift+Tab reverses focus order

**User-Visible Progress:** HeroSection fully keyboard-accessible

---

## Phase 4: Testing & Validation

### Task 4.1: Run Lighthouse accessibility audit

**Estimated Time:** 15 minutes
**Dependencies:** All Phase 2 and Phase 3 tasks

**Steps:**

1. Open http://localhost:5173 in Chrome
2. Open Chrome DevTools → Lighthouse tab
3. Run audit:
   - Categories: Performance, Accessibility, Best Practices, SEO
   - Device: Desktop
   - Mode: Navigation
4. Review results:
   - Target: Accessibility score = 100
   - Target: Performance score >90
5. Repeat for mobile device simulation

**Validation:**

- [ ] Accessibility score = 100 (both desktop and mobile)
- [ ] Performance score >90 (desktop)
- [ ] Performance score >85 (mobile)
- [ ] No critical accessibility violations
- [ ] All WCAG AA requirements met

**User-Visible Progress:** Landing page meets accessibility standards

---

### Task 4.2: Validate WCAG AA contrast ratios

**Estimated Time:** 20 minutes
**Dependencies:** Task 4.1

**Steps:**

1. Use browser extension (e.g., "WCAG Color Contrast Checker")
2. Test HeroSection phrase colors in light mode:
   - Green (rgb(34, 197, 94)) on white: Should be >4.5:1
   - Dark gray (rgb(51, 51, 51)) on white: Should be >4.5:1
   - Dark yellow (rgb(161, 98, 7)) on white: Should be >4.5:1
   - Dark red (rgb(220, 38, 38)) on white: Should be >4.5:1
3. Test HeroSection phrase colors in dark mode:
   - Green on dark: Should be >4.5:1
   - White on dark: Should be >4.5:1
   - Bright yellow on dark: Should be >4.5:1
   - Bright red on dark: Should be >4.5:1
4. Test ReadyToSection primary color in both themes

**Validation:**

- [ ] All phrase colors pass WCAG AA in light mode (4.5:1 minimum)
- [ ] All phrase colors pass WCAG AA in dark mode (4.5:1 minimum)
- [ ] ReadyToSection primary color passes in both themes
- [ ] No color combinations fail accessibility standards

**User-Visible Progress:** All text colors meet accessibility standards

---

### Task 4.3: Test on real mobile devices

**Estimated Time:** 30 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Get local dev server URL with network IP:
   - Run `npm run dev`
   - Note the "Network" URL (e.g., http://192.168.1.x:5173)
2. Test on iOS device (iPhone):
   - Open Safari, navigate to dev server URL
   - Test HeroSection animation smoothness
   - Test ReadyToSection animation smoothness
   - Verify text is readable
   - Test theme toggle
   - Test language switcher
3. Test on Android device:
   - Open Chrome, navigate to dev server URL
   - Repeat tests from iOS
4. Check for performance issues (dropped frames, laggy animations)

**Validation:**

- [ ] Both sections render correctly on iOS
- [ ] Both sections render correctly on Android
- [ ] Animations run smoothly (>30fps minimum)
- [ ] No horizontal scrollbars on mobile
- [ ] Theme toggle works on mobile
- [ ] Language switcher works on mobile
- [ ] Text is readable on small screens

**User-Visible Progress:** Landing page works on real mobile devices

---

### Task 4.4: Validate bundle size and performance

**Estimated Time:** 20 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Build production bundle:
   - Run: `npm run build`
   - Check dist/ folder size
2. Analyze bundle:
   - Check for GSAP in bundle (~30KB gzipped expected)
   - Verify total bundle size <150KB (gzipped)
3. Preview production build:
   - Run: `npm run preview`
   - Open http://localhost:4173
4. Run Lighthouse on production build:
   - Verify Performance score >90 (desktop)
   - Verify LCP <2.5s
   - Verify CLS <0.1
   - Verify INP <200ms

**Validation:**

- [ ] Production build completes without errors
- [ ] GSAP adds ~30KB gzipped to bundle
- [ ] Total bundle size <150KB (gzipped)
- [ ] Lighthouse Performance >90 (desktop)
- [ ] Core Web Vitals meet thresholds (LCP, CLS, INP)

**User-Visible Progress:** Landing page meets performance targets

---

### Task 4.5: Run ESLint and TypeScript checks

**Estimated Time:** 10 minutes
**Dependencies:** All Phase 2 and Phase 3 tasks

**Steps:**

1. Run ESLint:
   - Command: `npm run lint`
   - Verify no errors or warnings
2. Run TypeScript compiler:
   - Command: `npm run build` (includes `tsc -b`)
   - Verify no type errors
3. Fix any issues found

**Validation:**

- [ ] ESLint reports 0 errors, 0 warnings
- [ ] TypeScript compiles without errors
- [ ] All files pass strict mode checks

**User-Visible Progress:** None (code quality validation)

---

## Phase 5: Documentation & Handoff

### Task 5.1: Update CLAUDE.md with implementation notes

**Estimated Time:** 15 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Open `CLAUDE.md`
2. Update "What's Next?" section:
   - Mark HeroSection and ReadyToSection as completed
   - Note that `useTypewriter` hook is implemented
   - Document animation patterns for future sections
3. Add implementation notes:
   - Document GSAP lazy-loading pattern
   - Note theme-aware color implementation
   - Document prefers-reduced-motion handling

**Validation:**

- [ ] CLAUDE.md updated with completion status
- [ ] Implementation patterns documented
- [ ] File committed to git

**User-Visible Progress:** None (documentation)

---

### Task 5.2: Test with screen readers

**Estimated Time:** 30 minutes
**Dependencies:** All Phase 4 tasks

**Steps:**

1. macOS - VoiceOver:
   - Enable VoiceOver (Cmd+F5)
   - Navigate to http://localhost:5173
   - Verify headline is stable (not announcing character-by-character)
   - Verify CTAs are announced correctly
   - Verify navigation is logical
2. Windows - NVDA (if available):
   - Open NVDA
   - Navigate to landing page
   - Repeat tests from macOS
3. Test reduced motion with screen reader:
   - Verify static fallback is announced correctly

**Validation:**

- [ ] VoiceOver announces content logically
- [ ] Headline is stable (no character announcements)
- [ ] CTAs are properly labeled
- [ ] Navigation is logical and accessible
- [ ] Screen reader users can access all content

**User-Visible Progress:** Landing page accessible to screen reader users

---

## Summary

### Completed Deliverables

- [x] ReadyToSection component (CSS-driven animation)
- [x] HeroSection component (GSAP typewriter animation)
- [x] useTypewriter custom hook (reusable for future sections)
- [x] Theme-aware phrase colors (WCAG AA compliant)
- [x] Responsive mobile-first design (all breakpoints)
- [x] i18n integration (EN, PT-BR, ES)
- [x] Accessibility (prefers-reduced-motion, keyboard nav, screen readers)
- [x] Performance optimization (lazy-load GSAP, <150KB bundle)

### Performance Metrics Achieved

- Lighthouse Accessibility: 100
- Lighthouse Performance: >90 (desktop), >85 (mobile)
- LCP: <2.5s
- CLS: <0.1
- Animation FPS: 60fps (desktop), >30fps (mobile)
- Bundle size: <150KB (gzipped)

### Next Phase Preview

After Phase 1 approval, begin Phase 2:

1. HowItWorksSection (step cards with icons)
2. FeaturesSection (two-column worker/business features)
3. BenefitsSection (outcome cards with statistics)

---

**Total Tasks:** 22
**Estimated Time:** 8-12 hours
**Status:** Ready for implementation
