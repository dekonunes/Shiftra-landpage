# Implementation Tasks: Landing Page Core Content Sections (Phase 2)

**Change ID:** `implement-landing-core-sections`
**Status:** DRAFT

---

## Overview

This document outlines the ordered, verifiable tasks required to implement Phase 2 of the Shiftra landing page (HowItWorksSection, FeaturesSection, BenefitsSection). Each task is small, delivers user-visible progress, and includes validation steps.

**Estimated Total Time:** 16-24 hours

---

## Prerequisites

- [ ] Review LANDING_PAGE.md requirements (lines 139-166)
- [ ] Review Phase 1 implementation patterns (HeroSection, ReadyToSection)
- [ ] Verify image assets exist in `src/assets/landing/` (4 PNG files)
- [ ] Verify Lucide React installed (v0.562.0)
- [ ] Verify GSAP installed (^3.14.2)

---

## Phase 1: Setup & Dependencies

### Task 1.1: Install shadcn/ui Card component

**Estimated Time:** 10 minutes
**Dependencies:** None

**Steps:**

1. Run: `npx shadcn@latest add card`
2. Verify component installed at `src/components/ui/card.tsx`
3. Check component exports `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Validation:**

- [x] File exists: `src/components/ui/card.tsx`
- [x] Import works: `import { Card } from '@/components/ui/card'`
- [x] TypeScript compiles: `npm run build`
- [x] ESLint passes: `npm run lint`

**User-Visible Progress:** None (dependency setup)

---

### Task 1.2: Install sharp package for WebP conversion

**Estimated Time:** 5 minutes
**Dependencies:** None

**Steps:**

1. Run: `npm install --save-dev sharp`
2. Verify package.json includes `"sharp": "^0.33.0"` in devDependencies
3. Run: `npm ls sharp` to confirm installation

**Validation:**

- [x] `sharp` listed in package.json devDependencies
- [x] `npm ls sharp` shows version ^0.33.0
- [x] No installation errors in terminal

**User-Visible Progress:** None (dependency setup)

---

### Task 1.3: Create WebP conversion script

**Estimated Time:** 20 minutes
**Dependencies:** Task 1.2

**Steps:**

1. Create file: `scripts/generate-webp.js`
2. Implement conversion logic:

   ```javascript
   const sharp = require("sharp");
   const fs = require("fs");
   const path = require("path");

   const inputDir = "src/assets/landing";
   const outputDir = "src/assets/landing";

   fs.readdirSync(inputDir)
     .filter((file) => file.endsWith(".png"))
     .forEach(async (file) => {
       const inputPath = path.join(inputDir, file);
       const outputPath = path.join(outputDir, file.replace(".png", ".webp"));

       await sharp(inputPath)
         .webp({ quality: 90, lossless: false })
         .toFile(outputPath);

       const originalSize = fs.statSync(inputPath).size;
       const webpSize = fs.statSync(outputPath).size;
       const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

       console.log(
         `✓ ${file} → ${path.basename(outputPath)} (${savings}% smaller)`
       );
     });
   ```

3. Add script to package.json:
   ```json
   {
     "scripts": {
       "generate-webp": "node scripts/generate-webp.js",
       "prebuild": "npm run generate-webp"
     }
   }
   ```
4. Run script: `npm run generate-webp`
5. Verify 4 WebP files created in `src/assets/landing/`

**Validation:**

- [x] Script file exists: `scripts/generate-webp.js`
- [x] Script runs without errors: `npm run generate-webp`
- [x] 4 WebP files created: `agenda.webp`, `create-shift.webp`, `invoice.webp`, `shift-details.webp`
- [x] WebP files are 25-35% smaller than PNG equivalents
- [x] `prebuild` script added to package.json

**User-Visible Progress:** WebP images available (faster load times)

---

## Phase 2: Shared Components & Hooks

### Task 2.1: Create OptimizedImage component

**Estimated Time:** 30 minutes
**Dependencies:** Task 1.3

**Steps:**

1. Create file: `src/pages/landing/components/OptimizedImage.tsx`
2. Define interface:
   ```typescript
   interface OptimizedImageProps {
     mobileSrc: string; // e.g., 'agenda.png'
     desktopSrc?: string; // e.g., 'shift-details.png'
     alt: string;
     className?: string;
     width?: number;
     height?: number;
   }
   ```
3. Implement `<picture>` element with WebP sources and responsive media queries
4. Apply lazy loading attributes: `loading="lazy"`, `decoding="async"`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test in LandingPage.tsx temporarily)

**User-Visible Progress:** None (reusable component preparation)

---

### Task 2.2: Create useScrollAnimation hook

**Estimated Time:** 45 minutes
**Dependencies:** None

**Steps:**

1. Create file: `src/pages/landing/hooks/useScrollAnimation.ts`
2. Define interface:
   ```typescript
   interface UseScrollAnimationOptions {
     target: string; // CSS selector
     animation: gsap.TweenVars; // GSAP animation config
     triggerConfig?: ScrollTrigger.Vars; // ScrollTrigger config
     enabled?: boolean; // Respect prefers-reduced-motion
   }
   ```
3. Implement `useEffect` hook:
   - Return early if `!enabled`
   - Lazy-load GSAP + ScrollTrigger via dynamic import
   - Register ScrollTrigger plugin
   - Query all elements matching `target` selector
   - For each element, create GSAP tween with ScrollTrigger
   - Default ScrollTrigger config: `{ start: 'top 80%', toggleActions: 'play none none reverse' }`
   - Clean up: `ScrollTrigger.getAll().forEach(st => st.kill())` on unmount

**Validation:**

- [ ] Hook exports `useScrollAnimation` function
- [ ] TypeScript types validate correctly
- [ ] No ESLint warnings
- [ ] Hook compiles without errors: `npm run build`

**User-Visible Progress:** None (hook preparation)

---

### Task 2.3: Create useCountUpAnimation hook

**Estimated Time:** 60 minutes
**Dependencies:** None

**Steps:**

1. Create file: `src/pages/landing/hooks/useCountUpAnimation.ts`
2. Define interface:
   ```typescript
   interface UseCountUpAnimationOptions {
     target: string; // CSS selector (e.g., '.stat-number')
     enabled?: boolean; // Respect prefers-reduced-motion
   }
   ```
3. Implement `useEffect` hook:
   - Return early if `!enabled`
   - Lazy-load GSAP + ScrollTrigger
   - Register ScrollTrigger plugin
   - Query all elements matching `target` selector
   - For each element:
     - Read `data-target` attribute (parse as float)
     - Read `data-suffix` attribute (default: empty string)
     - Create GSAP tween: `from: { innerText: 0 }` to target value
     - Apply `snap: { innerText: 1 }` for integers (or `0.1` for decimals)
     - Apply `duration: 2`, `ease: 'power1.out'`
     - Apply ScrollTrigger: `{ start: 'top 80%', toggleActions: 'play none none none' }`
     - Update `innerText` on each frame: `el.innerText = Math.ceil(value) + suffix`
   - Clean up: `ScrollTrigger.getAll().forEach(st => st.kill())`

**Validation:**

- [ ] Hook exports `useCountUpAnimation` function
- [ ] TypeScript types validate correctly
- [ ] No ESLint warnings
- [ ] Hook compiles without errors: `npm run build`

**User-Visible Progress:** None (hook preparation)

---

### Task 2.4: Create FeatureCard component

**Estimated Time:** 30 minutes
**Dependencies:** Task 1.1

**Steps:**

1. Create file: `src/pages/landing/components/FeatureCard.tsx`
2. Import: `Card` from shadcn/ui, `LucideIcon` type from `lucide-react`
3. Define interface:
   ```typescript
   interface FeatureCardProps {
     icon: LucideIcon;
     title: string;
     description: string;
   }
   ```
4. Implement component:
   - Render Card with `p-6 hover:shadow-lg transition-shadow` classes
   - Render icon at top: `h-8 w-8 md:h-10 md:w-10 text-primary mb-4`
   - Render title as `<h3>`: `text-lg font-semibold mb-2`
   - Render description as `<p>`: `text-sm text-muted-foreground`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test with sample data)

**User-Visible Progress:** None (reusable component preparation)

---

### Task 2.5: Create BenefitCard component

**Estimated Time:** 30 minutes
**Dependencies:** Task 1.1

**Steps:**

1. Create file: `src/pages/landing/components/BenefitCard.tsx`
2. Import: `Card` from shadcn/ui, `LucideIcon` type from `lucide-react`
3. Define interface:
   ```typescript
   interface BenefitCardProps {
     icon: LucideIcon;
     value: string; // e.g., "5", "80"
     suffix?: string; // e.g., " hours/week", "%"
     description: string;
   }
   ```
4. Implement component:
   - Render Card with `p-6 text-center hover:shadow-lg transition-shadow` classes
   - Render icon at top: `h-12 w-12 text-primary mb-4 mx-auto`
   - Render animated number span: `stat-number text-4xl font-bold text-foreground` with `data-target={value}` and `data-suffix={suffix || ''}`
   - Render description: `text-sm text-muted-foreground mt-2`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test with sample data)

**User-Visible Progress:** None (reusable component preparation)

---

## Phase 3: HowItWorksSection Implementation

### Task 3.1: Add HowItWorks translations to i18n files

**Estimated Time:** 30 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add section:
   ```json
   "howItWorks": {
     "heading": "How Shiftra works",
     "steps": [
       {
         "title": "Post or find a shift",
         "description": "Businesses post shifts with clear requirements. Workers browse and accept shifts that match their skills."
       },
       {
         "title": "Confirm details and requirements",
         "description": "Verify shift details, location, and required certifications (White Card, RSA) before starting work."
       },
       {
         "title": "Track hours and payment status",
         "description": "Monitor your earnings in real-time and see which payments are pending or overdue."
       },
       {
         "title": "Generate and send invoices",
         "description": "Create compliant invoices with one click and share them instantly with clients."
       }
     ]
   }
   ```
3. Repeat for `src/i18n/pt-BR.json` (Portuguese translations)
4. Repeat for `src/i18n/es.json` (Spanish translations)

**Validation:**

- [ ] All 3 i18n files updated
- [ ] JSON syntax is valid (no errors in dev server)
- [ ] Translations test-loaded via `useTranslation()` hook

**User-Visible Progress:** None (translation setup)

---

### Task 3.2: Create HowItWorksSection component

**Estimated Time:** 60 minutes
**Dependencies:** Task 2.1, Task 2.2, Task 3.1

**Steps:**

1. Create file: `src/pages/landing/components/HowItWorksSection.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `useScrollAnimation` from `../hooks/useScrollAnimation`
   - `OptimizedImage` from `./OptimizedImage`
   - Lucide icons: `CalendarPlus`, `CheckCircle`, `Clock`, `FileText`
3. Implement component:
   - Retrieve steps from i18n: `t('howItWorks.steps', { returnObjects: true }) as Array<{ title: string; description: string }>`
   - Detect `prefersReducedMotion` with `matchMedia`
   - Call `useScrollAnimation` hook with:
     - `target: '.step-card'`
     - `animation: { opacity: 0, y: 50, duration: 0.8 }`
     - `triggerConfig: { start: 'top 80%', toggleActions: 'play none none reverse', stagger: 0.2 }`
     - `enabled: !prefersReducedMotion`
   - Render responsive grid (1 col → 2 col)
   - Map steps to cards with icons and images
4. Apply Tailwind classes:
   - Section: `py-16 sm:py-24 bg-muted/30`
   - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Heading: `text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12`
   - Grid: `grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12`
   - Card: `step-card bg-card border border-border rounded-lg p-6 md:p-8`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (temporarily add to LandingPage.tsx)

**User-Visible Progress:** HowItWorksSection visible on landing page (when imported)

---

### Task 3.3: Import HowItWorksSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 3.2

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import HowItWorksSection from './components/HowItWorksSection'`
3. Add after ReadyToSection: `<HowItWorksSection />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] HowItWorksSection visible at http://localhost:5173
- [ ] ScrollTrigger animations play when scrolling into view

**User-Visible Progress:** HowItWorksSection visible on landing page with scroll animations

---

### Task 3.4: Test HowItWorksSection scroll animations

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Scroll slowly to HowItWorksSection
3. Verify cards fade in from bottom with stagger
4. Scroll back up and verify animations reverse
5. Open Chrome DevTools Performance tab:
   - Record scroll animation for 10 seconds
   - Verify FPS >60fps on desktop
6. Test with "reduce motion" enabled:
   - Enable in Chrome DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion
   - Reload page
   - Verify cards appear immediately (no animation)

**Validation:**

- [ ] Cards fade in from bottom (opacity: 0 → 1, translateY: 50 → 0)
- [ ] Staggered timing: 0.2s delay per card
- [ ] Animations reverse on scroll up
- [ ] FPS >60fps on desktop (Chrome DevTools Performance)
- [ ] Reduced motion fallback works (cards appear immediately)

**User-Visible Progress:** HowItWorksSection scroll animations validated

---

### Task 3.5: Test HowItWorksSection responsive images

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173 in Chrome DevTools
2. Test mobile (375px width):
   - Resize viewport to 375px
   - Open Network tab, filter by "Img"
   - Scroll to HowItWorksSection
   - Verify mobile images load (agenda.webp, invoice.webp)
   - Verify desktop images do NOT load
3. Test desktop (1920px width):
   - Resize viewport to 1920px
   - Clear Network tab
   - Scroll to HowItWorksSection
   - Verify desktop images load (shift-details.webp, create-shift.webp)
   - Verify mobile images do NOT load
4. Verify WebP format:
   - Check Network tab "Type" column shows "webp"
   - If WebP not supported (very old browser), PNG fallback should load

**Validation:**

- [ ] Mobile viewport loads mobile images only (agenda.webp, invoice.webp)
- [ ] Desktop viewport loads desktop images only (shift-details.webp, create-shift.webp)
- [ ] Images load in WebP format
- [ ] Images are lazy-loaded (only when section enters viewport)
- [ ] No CLS (Cumulative Layout Shift) on image load

**User-Visible Progress:** HowItWorksSection responsive images validated

---

### Task 3.6: Test HowItWorksSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT):
   - Click "PT" button in Navigation
   - Verify section heading updates to Portuguese
   - Verify all 4 step titles update to Portuguese
   - Verify all 4 step descriptions update to Portuguese
   - Check for text overflow in cards
3. Switch to Spanish (ES):
   - Click "ES" button in Navigation
   - Verify all text updates to Spanish
4. Switch back to English (EN)

**Validation:**

- [ ] Section heading updates on language change
- [ ] All step titles update on language change
- [ ] All step descriptions update on language change
- [ ] No layout shift when switching languages
- [ ] No text overflow in cards (Portuguese/Spanish text fits)

**User-Visible Progress:** HowItWorksSection supports 3 languages

---

## Phase 4: FeaturesSection Implementation

### Task 4.1: Add Features translations to i18n files

**Estimated Time:** 45 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add section:
   ```json
   "features": {
     "heading": "Features",
     "workersHeading": "For Workers",
     "businessesHeading": "For Businesses",
     "workers": [
       {
         "title": "Find and accept shifts",
         "description": "Browse available shifts and accept those that match your skills and schedule."
       },
       {
         "title": "Shift calendar and reminders",
         "description": "Keep track of all your shifts in one place with automatic reminders."
       },
       {
         "title": "Earnings visibility",
         "description": "View estimated and actual earnings for each shift in real-time."
       },
       {
         "title": "Payment tracking",
         "description": "Track which payments are pending, paid, or overdue."
       },
       {
         "title": "One-click invoicing",
         "description": "Generate and send professional invoices instantly."
       }
     ],
     "businesses": [
       {
         "title": "Post shifts and request workers",
         "description": "Create shifts with clear requirements and request specific workers."
       },
       {
         "title": "Crew-wide shift reminders",
         "description": "Send automatic reminders to your entire crew before shifts."
       },
       {
         "title": "Crew group chat",
         "description": "Coordinate with your team in real-time via built-in chat."
       },
       {
         "title": "One-tap translation",
         "description": "Communicate with multi-language crews using automatic translation."
       },
       {
         "title": "Store invoice details",
         "description": "Save ABN, address, and business details to streamline invoicing."
       }
     ]
   }
   ```
3. Repeat for `src/i18n/pt-BR.json` (Portuguese translations)
4. Repeat for `src/i18n/es.json` (Spanish translations)

**Validation:**

- [ ] All 3 i18n files updated
- [ ] JSON syntax is valid (no errors in dev server)
- [ ] Translations test-loaded via `useTranslation()` hook

**User-Visible Progress:** None (translation setup)

---

### Task 4.2: Create FeaturesSection component

**Estimated Time:** 60 minutes
**Dependencies:** Task 2.2, Task 2.4, Task 4.1

**Steps:**

1. Create file: `src/pages/landing/components/FeaturesSection.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `useScrollAnimation` from `../hooks/useScrollAnimation`
   - `FeatureCard` from `./FeatureCard`
   - Lucide icons: `Briefcase`, `Calendar`, `TrendingUp`, `DollarSign`, `FileText`, `UserPlus`, `Bell`, `MessageSquare`, `Globe`, `FileCheck`
3. Implement component:
   - Retrieve features from i18n: `t('features.workers', { returnObjects: true })` and `t('features.businesses', { returnObjects: true })`
   - Detect `prefersReducedMotion`
   - Call `useScrollAnimation` for worker cards and business cards separately
   - Render two subsections side-by-side (responsive)
4. Apply Tailwind classes:
   - Section: `py-16 sm:py-24 bg-background`
   - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Main heading: `text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12`
   - Subsection grid: `grid grid-cols-1 lg:grid-cols-2 gap-12`
   - Subsection heading: `text-2xl sm:text-3xl font-semibold mb-6`
   - Feature cards grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** FeaturesSection visible on landing page (when imported)

---

### Task 4.3: Import FeaturesSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 4.2

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import FeaturesSection from './components/FeaturesSection'`
3. Add after HowItWorksSection: `<FeaturesSection />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] FeaturesSection visible at http://localhost:5173
- [ ] ScrollTrigger animations play when scrolling into view

**User-Visible Progress:** FeaturesSection visible on landing page with scroll animations

---

### Task 4.4: Test FeaturesSection scroll animations and responsiveness

**Estimated Time:** 30 minutes
**Dependencies:** Task 4.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Scroll to FeaturesSection
3. Verify worker feature cards fade in with stagger (0.15s delay)
4. Verify business feature cards fade in after worker cards
5. Test responsive layout:
   - Mobile (375px): Subsections stack vertically, cards stack within each
   - Tablet (768px): Subsections stack, cards in 2 columns within each
   - Desktop (1024px+): Subsections side-by-side, cards in 3 columns within each
6. Test with "reduce motion" enabled

**Validation:**

- [ ] Feature cards fade in from bottom with stagger
- [ ] Worker cards animate first, then business cards
- [ ] FPS >60fps on desktop
- [ ] Responsive layout works at all breakpoints
- [ ] Reduced motion fallback works

**User-Visible Progress:** FeaturesSection scroll animations and responsive layout validated

---

### Task 4.5: Test FeaturesSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 4.3

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT) and verify all feature titles/descriptions update
3. Switch to Spanish (ES) and verify updates
4. Check for text overflow in cards (Portuguese/Spanish text may be longer)
5. Switch back to English (EN)

**Validation:**

- [ ] All feature titles update on language change
- [ ] All feature descriptions update on language change
- [ ] No layout shift when switching languages
- [ ] No text overflow in cards

**User-Visible Progress:** FeaturesSection supports 3 languages

---

## Phase 5: BenefitsSection Implementation

### Task 5.1: Add Benefits translations to i18n files

**Estimated Time:** 20 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add section:
   ```json
   "benefits": {
     "heading": "Concrete outcomes",
     "outcomes": [
       {
         "value": "5",
         "suffix": " hours/week",
         "description": "Save 5 hours per week on admin tasks"
       },
       {
         "value": "80",
         "suffix": "%",
         "description": "Reduce invoicing time by 80%"
       },
       {
         "value": "0",
         "suffix": "",
         "description": "Zero missed shifts with automatic reminders"
       },
       {
         "value": "1",
         "suffix": " click",
         "description": "Generate invoices in one click"
       }
     ]
   }
   ```
3. Repeat for `src/i18n/pt-BR.json` (Portuguese translations)
4. Repeat for `src/i18n/es.json` (Spanish translations)

**Validation:**

- [ ] All 3 i18n files updated
- [ ] JSON syntax is valid (no errors in dev server)
- [ ] Translations test-loaded via `useTranslation()` hook

**User-Visible Progress:** None (translation setup)

---

### Task 5.2: Create BenefitsSection component

**Estimated Time:** 60 minutes
**Dependencies:** Task 2.3, Task 2.5, Task 5.1

**Steps:**

1. Create file: `src/pages/landing/components/BenefitsSection.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `useScrollAnimation` from `../hooks/useScrollAnimation`
   - `useCountUpAnimation` from `../hooks/useCountUpAnimation`
   - `BenefitCard` from `./BenefitCard`
   - Lucide icons: `Clock`, `FileCheck`, `CheckCircle`, `TrendingUp`
3. Implement component:
   - Retrieve outcomes from i18n: `t('benefits.outcomes', { returnObjects: true }) as Array<{ value: string; suffix?: string; description: string }>`
   - Detect `prefersReducedMotion`
   - Call `useScrollAnimation` for card fade-ins
   - Call `useCountUpAnimation` with `target: '.stat-number'`
   - Render 4 benefit cards in responsive grid
4. Apply Tailwind classes:
   - Section: `py-16 sm:py-24 bg-muted/30`
   - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Heading: `text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12`
   - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** BenefitsSection visible on landing page (when imported)

---

### Task 5.3: Import BenefitsSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 5.2

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import BenefitsSection from './components/BenefitsSection'`
3. Add after FeaturesSection: `<BenefitsSection />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] BenefitsSection visible at http://localhost:5173
- [ ] ScrollTrigger animations and number counting play when scrolling into view

**User-Visible Progress:** BenefitsSection visible on landing page with animated numbers

---

### Task 5.4: Test BenefitsSection number animations

**Estimated Time:** 30 minutes
**Dependencies:** Task 5.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Scroll slowly to BenefitsSection
3. Verify benefit cards fade in with stagger
4. Verify numbers count from 0 to target value over 2 seconds:
   - "5 hours/week" counts from 0 to 5
   - "80%" counts from 0% to 80%
   - "0 missed shifts" stays at 0 (or counts if non-zero)
   - "1 click" counts from 0 to 1
5. Scroll back up and back down:
   - Verify numbers do NOT re-animate (toggleActions: 'play none none none')
6. Open Chrome DevTools Performance tab:
   - Record number animation for 5 seconds
   - Verify FPS >60fps
7. Test with "reduce motion" enabled:
   - Verify numbers display final values immediately (no animation)

**Validation:**

- [ ] Numbers count from 0 to target value smoothly
- [ ] Animation duration is 2 seconds
- [ ] Suffixes display correctly (" hours/week", "%", " click")
- [ ] Numbers snap to integer values (no decimals)
- [ ] FPS >60fps during animation
- [ ] Reduced motion fallback works (numbers display final values)

**User-Visible Progress:** BenefitsSection number animations validated

---

### Task 5.5: Test BenefitsSection responsiveness

**Estimated Time:** 20 minutes
**Dependencies:** Task 5.3

**Steps:**

1. Open http://localhost:5173 in browser
2. Test mobile (375px width):
   - Resize viewport to 375px
   - Verify cards stack vertically (1 column)
   - Verify numbers are readable and properly sized
3. Test tablet (768px width):
   - Resize to 768px
   - Verify cards display in 2 columns
4. Test desktop (1024px width):
   - Resize to 1024px
   - Verify cards display in 4 columns (single row)
5. Verify no horizontal scrollbars at any breakpoint

**Validation:**

- [ ] Mobile: Cards stack vertically (1 column)
- [ ] Tablet: Cards display in 2 columns
- [ ] Desktop: Cards display in 4 columns
- [ ] No horizontal scrollbars at any breakpoint
- [ ] Numbers remain readable at all sizes

**User-Visible Progress:** BenefitsSection responsive layout validated

---

### Task 5.6: Test BenefitsSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 5.3

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT):
   - Verify section heading updates
   - Verify all 4 benefit descriptions update
   - Verify numeric values remain consistent (5, 80, 0, 1)
   - Verify suffixes update (" hours/week" → " horas/semana", "%" → "%")
3. Switch to Spanish (ES) and verify updates
4. Switch back to English (EN)

**Validation:**

- [ ] Section heading updates on language change
- [ ] All benefit descriptions update on language change
- [ ] Numeric values remain consistent across languages
- [ ] Suffixes update appropriately
- [ ] No layout shift when switching languages

**User-Visible Progress:** BenefitsSection supports 3 languages

---

## Phase 6: Testing & Validation

### Task 6.1: Run Lighthouse accessibility audit

**Estimated Time:** 20 minutes
**Dependencies:** All Phase 3, 4, 5 tasks

**Steps:**

1. Build production bundle: `npm run build`
2. Preview production build: `npm run preview`
3. Open http://localhost:4173 in Chrome
4. Open Chrome DevTools → Lighthouse tab
5. Run audit:
   - Categories: Performance, Accessibility, Best Practices, SEO
   - Device: Desktop
   - Mode: Navigation
6. Review results:
   - Target: Accessibility score = 100
   - Target: Performance score >90 (desktop)
7. Repeat for mobile device simulation

**Validation:**

- [ ] Accessibility score = 100 (both desktop and mobile)
- [ ] Performance score >90 (desktop)
- [ ] Performance score >85 (mobile)
- [ ] No critical accessibility violations
- [ ] All WCAG AA requirements met

**User-Visible Progress:** Landing page meets accessibility and performance standards

---

### Task 6.2: Validate bundle size and performance

**Estimated Time:** 20 minutes
**Dependencies:** Task 6.1

**Steps:**

1. Analyze production bundle:
   - Check dist/ folder size
   - Verify ScrollTrigger adds ~5KB gzipped
   - Verify total bundle <200KB gzipped
2. Run Lighthouse Core Web Vitals check:
   - LCP (Largest Contentful Paint): <2.5s
   - CLS (Cumulative Layout Shift): <0.1
   - INP (Interaction to Next Paint): <200ms
3. Test image loading performance:
   - Open Network tab, throttle to "Slow 3G"
   - Verify images load progressively (lazy loading)
   - Verify WebP images load quickly

**Validation:**

- [ ] Total bundle size <200KB gzipped (target: ~167KB)
- [ ] ScrollTrigger adds ~5KB gzipped
- [ ] LCP <2.5s
- [ ] CLS <0.1 (no layout shift on image load)
- [ ] INP <200ms
- [ ] Images lazy-load correctly

**User-Visible Progress:** Phase 2 meets performance targets

---

### Task 6.3: Test on real mobile devices

**Estimated Time:** 30 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Get local dev server URL with network IP:
   - Run `npm run dev`
   - Note the "Network" URL (e.g., http://192.168.1.x:5173)
2. Test on iOS device (iPhone):
   - Open Safari, navigate to dev server URL
   - Test all 3 section scroll animations
   - Test number animations in BenefitsSection
   - Verify images load correctly (WebP or PNG fallback)
   - Test theme toggle
   - Test language switcher
3. Test on Android device:
   - Open Chrome, navigate to dev server URL
   - Repeat tests from iOS
4. Check for performance issues (dropped frames, laggy animations)

**Validation:**

- [ ] All 3 sections render correctly on iOS
- [ ] All 3 sections render correctly on Android
- [ ] ScrollTrigger animations run smoothly (>30fps minimum)
- [ ] Number animations run smoothly
- [ ] Images load correctly (WebP preferred)
- [ ] No horizontal scrollbars on mobile
- [ ] Theme toggle works on mobile
- [ ] Language switcher works on mobile

**User-Visible Progress:** Phase 2 works on real mobile devices

---

### Task 6.4: Run ESLint and TypeScript checks

**Estimated Time:** 10 minutes
**Dependencies:** All Phase 3, 4, 5 tasks

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

## Phase 7: Documentation & Handoff

### Task 7.1: Update CLAUDE.md with Phase 2 implementation notes

**Estimated Time:** 20 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Open `CLAUDE.md`
2. Update "What's Next?" section:
   - Mark HowItWorksSection, FeaturesSection, BenefitsSection as completed
   - Document `useScrollAnimation` and `useCountUpAnimation` hooks
   - Document OptimizedImage, FeatureCard, BenefitCard components
3. Add implementation notes:
   - Document GSAP ScrollTrigger patterns
   - Note WebP conversion workflow
   - Document number animation patterns

**Validation:**

- [ ] CLAUDE.md updated with Phase 2 completion status
- [ ] Implementation patterns documented
- [ ] File committed to git

**User-Visible Progress:** None (documentation)

---

### Task 7.2: Test with screen readers

**Estimated Time:** 30 minutes
**Dependencies:** All Phase 6 tasks

**Steps:**

1. macOS - VoiceOver:
   - Enable VoiceOver (Cmd+F5)
   - Navigate to http://localhost:5173
   - Verify section headings are announced correctly
   - Verify feature/benefit cards are navigable
   - Verify image alt text is read correctly
   - Verify number animations do not announce intermediate values
2. Windows - NVDA (if available):
   - Open NVDA
   - Navigate to landing page
   - Repeat tests from macOS
3. Test reduced motion with screen reader:
   - Verify static content is announced correctly

**Validation:**

- [ ] VoiceOver announces content logically
- [ ] Section headings are properly structured (h2, h3)
- [ ] Feature/benefit cards are navigable
- [ ] Image alt text is descriptive and concise
- [ ] Number animations do not confuse screen readers
- [ ] Screen reader users can access all content

**User-Visible Progress:** Phase 2 accessible to screen reader users

---

## Summary

### Completed Deliverables

- [ ] HowItWorksSection component (4-step workflow with scroll animations)
- [ ] FeaturesSection component (worker/business feature cards)
- [ ] BenefitsSection component (outcome cards with animated numbers)
- [ ] OptimizedImage component (WebP + PNG fallback, responsive sources)
- [ ] useScrollAnimation hook (reusable ScrollTrigger wrapper)
- [ ] useCountUpAnimation hook (number interpolation)
- [ ] FeatureCard component (reusable feature card)
- [ ] BenefitCard component (reusable benefit card)
- [ ] WebP conversion script (PNG → WebP optimization)
- [ ] i18n translations (EN, PT-BR, ES for all 3 sections)
- [ ] Responsive layouts (mobile → tablet → desktop)
- [ ] Accessibility compliance (WCAG AA, prefers-reduced-motion)

### Performance Metrics to Achieve

- Lighthouse Accessibility: 100
- Lighthouse Performance: >90 (desktop), >85 (mobile)
- LCP: <2.5s
- CLS: <0.1
- Animation FPS: 60fps (desktop), >30fps (mobile)
- Bundle size: <200KB gzipped (target: ~167KB)

### Next Phase Preview

After Phase 2 approval, begin Phase 3:

1. PricingSection (pinned scroll animations with GSAP ScrollTrigger)
2. CTASection (waitlist modal with form validation)
3. Footer (contact links, social media)

---

**Total Tasks:** 35
**Estimated Time:** 16-24 hours
**Status:** Ready for implementation
