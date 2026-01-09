# Implementation Tasks: Landing Page Conversion & Footer (Phase 3)

**Change ID:** `implement-landing-conversion-footer`
**Status:** DRAFT

---

## Overview

This document outlines the ordered, verifiable tasks required to implement Phase 3 of the Shiftra landing page (PricingSection, CTASection, Footer). Each task is small, delivers user-visible progress, and includes validation steps.

**Estimated Total Time:** 24-32 hours

---

## Prerequisites

- [x] Review LANDING_PAGE.md requirements (lines 176-270)
- [x] Review Phase 2 implementation patterns (HowItWorks, Features, Benefits)
- [x] Verify GSAP + ScrollTrigger installed (^3.14.2)
- [x] Verify Lucide React installed (v0.562.0)
- [x] Verify shadcn/ui Card installed (from Phase 2)

---

## Phase 1: Setup & Dependencies

### Task 1.1: Install shadcn/ui Dialog component

**Estimated Time:** 10 minutes
**Dependencies:** None

**Steps:**

1. Run: `npx shadcn@latest add dialog`
2. Verify component installed at `src/components/ui/dialog.tsx`
3. Check component exports `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`

**Validation:**

- [x] File exists: `src/components/ui/dialog.tsx`
- [x] Import works: `import { Dialog } from '@/components/ui/dialog'`
- [x] TypeScript compiles: `npm run build`
- [x] ESLint passes: `npm run lint`

**User-Visible Progress:** None (dependency setup)

---

### Task 1.2: Install shadcn/ui Checkbox component

**Estimated Time:** 5 minutes
**Dependencies:** None

**Steps:**

1. Run: `npx shadcn@latest add checkbox`
2. Verify component installed at `src/components/ui/checkbox.tsx`
3. Check component exports `Checkbox`

**Validation:**

- [x] File exists: `src/components/ui/checkbox.tsx`
- [x] Import works: `import { Checkbox } from '@/components/ui/checkbox'`
- [x] TypeScript compiles: `npm run build`
- [x] ESLint passes: `npm run lint`

**User-Visible Progress:** None (dependency setup)

---

### Task 1.3: Install shadcn/ui Accordion component

**Estimated Time:** 5 minutes
**Dependencies:** None

**Steps:**

1. Run: `npx shadcn@latest add accordion`
2. Verify component installed at `src/components/ui/accordion.tsx`
3. Check component exports `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

**Validation:**

- [x] File exists: `src/components/ui/accordion.tsx`
- [x] Import works: `import { Accordion } from '@/components/ui/accordion'`
- [x] TypeScript compiles: `npm run build`
- [x] ESLint passes: `npm run lint`

**User-Visible Progress:** None (dependency setup)

---

## Phase 2: Pricing Section Implementation

### Task 2.1: Add Pricing translations to i18n files

**Estimated Time:** 45 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add section (see design.md for complete structure):
   ```json
   {
     "pricing": {
       "title": "Simple, transparent pricing",
       "free": { "name": "Free", "price": "$0", ... },
       "starter": { "name": "Starter", "price": "$2", ... },
       "pro": { "name": "Pro", "price": "$27", ... },
       "features": { ... }
     }
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

### Task 2.2: Create usePricingScrollAnimation hook

**Estimated Time:** 90 minutes
**Dependencies:** None

**Steps:**

1. Create file: `src/pages/landing/hooks/usePricingScrollAnimation.ts`
2. Define interface:
   ```typescript
   interface UsePricingScrollAnimationOptions {
     sectionRef: RefObject<HTMLElement | null>;
     enabled: boolean;
   }
   ```
3. Implement `useEffect` hook:
   - Return early if `!enabled` or `!sectionRef.current`
   - Lazy-load GSAP + ScrollTrigger via `Promise.all([import('gsap'), ...])`
   - Register ScrollTrigger plugin
   - Detect mobile: `window.matchMedia('(max-width: 1023px)').matches`
   - Create GSAP timeline with ScrollTrigger config:
     - `start: 'top top'`
     - `end: '+=3000'`
     - `pin: !isMobile`
     - `scrub: 1`
     - `anticipatePin: 1`
   - Query all feature elements by `data-feature-type` attribute
   - Add timeline phases:
     - Phase 1 (0s): Base features reveal (all cards)
     - Phase 2 (1s): Starter card highlight + Worker discovery reveal
     - Phase 3 (2.2s): Pro card highlight + Chat/Translation reveal
   - Clean up: Kill all ScrollTrigger instances on unmount

**Validation:**

- [ ] Hook exports `usePricingScrollAnimation` function
- [ ] TypeScript types validate correctly
- [ ] No ESLint warnings
- [ ] Hook compiles without errors: `npm run build`

**User-Visible Progress:** None (hook preparation)

---

### Task 2.3: Create PricingCard component

**Estimated Time:** 60 minutes
**Dependencies:** Task 1.1 (shadcn Card), Task 2.1

**Steps:**

1. Create file: `src/pages/landing/components/PricingCard.tsx`
2. Import: `Card`, `Check`, `X` from lucide-react
3. Define interface:
   ```typescript
   interface PricingCardProps {
     tier: "free" | "starter" | "pro";
     name: string;
     price: string;
     period?: string;
     description: string;
     badge?: string;
     cta: string;
     baseFeatures: string[];
     exclusiveFeatures?: string[];
     notIncluded?: string[];
   }
   ```
4. Implement component:
   - Render Card with `data-pricing-card={tier}` attribute
   - Render badge (if provided, Free plan only)
   - Render name, price, period, description
   - Render CTA button (full-width)
   - Render divider
   - Render base features with checkmarks (`data-feature-type="base"`)
   - Render exclusive features with checkmarks (`data-feature-type="{tier}-exclusive"`)
   - Render not included features with X icon (Free plan Worker discovery)
5. Apply tier-specific styling:
   - Free: Default card styling
   - Starter: Optional `border-l-4 border-primary`
   - Pro: `bg-primary/5 ring-primary/30 lg:scale-105 lg:shadow-xl`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test with sample data)

**User-Visible Progress:** None (reusable component preparation)

---

### Task 2.4: Create PricingSection component

**Estimated Time:** 90 minutes
**Dependencies:** Task 2.1, Task 2.2, Task 2.3

**Steps:**

1. Create file: `src/pages/landing/components/PricingSection.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `usePricingScrollAnimation` from `../hooks/usePricingScrollAnimation`
   - `PricingCard` from `./PricingCard`
   - `useRef`, `useState`, `useEffect` from `react`
3. Implement component:
   - Create section ref: `const sectionRef = useRef<HTMLElement>(null)`
   - Detect `prefersReducedMotion` with `matchMedia`
   - Call `usePricingScrollAnimation({ sectionRef, enabled: !prefersReducedMotion })`
   - Retrieve pricing data from i18n
   - Render responsive grid (1 col → 2 col → 3 col)
   - Render 3 PricingCard components (Free, Starter, Pro)
4. Apply Tailwind classes:
   - Section: `px-4 py-20 bg-background`
   - Container: `max-w-7xl mx-auto`
   - Heading: `text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12`
   - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (temporarily add to LandingPage.tsx)

**User-Visible Progress:** PricingSection visible on landing page (when imported)

---

### Task 2.5: Import PricingSection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 2.4

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import PricingSection from './components/PricingSection'`
3. Add after BenefitsSection: `<PricingSection />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] PricingSection visible at http://localhost:5173
- [ ] Pricing cards display correctly (3 cards)

**User-Visible Progress:** PricingSection visible on landing page with static layout

---

### Task 2.6: Test PricingSection pinned scroll animation (Desktop)

**Estimated Time:** 45 minutes
**Dependencies:** Task 2.5

**Steps:**

1. Open http://localhost:5173 in Chrome (desktop)
2. Resize window to >1024px (desktop breakpoint)
3. Scroll slowly to PricingSection
4. Verify animation phases:
   - Section pins at top when it enters viewport
   - Base features reveal with stagger (0.1s delay)
   - Starter card highlights (scale 1.05, shadow increase)
   - Worker discovery reveals on Starter card
   - Starter card resets
   - Pro card highlights (scale 1.05, shadow increase)
   - Chat + Translation reveal on Pro card
   - Section unpins after scroll range completes
5. Scroll back up and verify animations reverse
6. Open Chrome DevTools Performance tab:
   - Record scroll animation for 10 seconds
   - Verify FPS >60fps
7. Test with "reduce motion" enabled:
   - Enable in Chrome DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion
   - Reload page
   - Verify pricing cards show all features immediately (no pinning, no animation)

**Validation:**

- [ ] Section pins correctly at top of viewport
- [ ] Base features reveal with stagger
- [ ] Starter card highlights correctly
- [ ] Worker discovery reveals at correct scroll position
- [ ] Pro card highlights correctly
- [ ] Chat + Translation reveal at correct scroll position
- [ ] Section unpins after scroll range
- [ ] FPS >60fps on desktop (Chrome DevTools Performance)
- [ ] Reduced motion fallback works (all features visible, no animation)

**User-Visible Progress:** PricingSection pinned scroll animation validated (desktop)

---

### Task 2.7: Test PricingSection mobile fallback

**Estimated Time:** 30 minutes
**Dependencies:** Task 2.5

**Steps:**

1. Open http://localhost:5173 in Chrome DevTools
2. Resize to mobile (375px width)
3. Scroll to PricingSection
4. Verify:
   - Cards stack vertically (1 column)
   - NO pinning (section scrolls normally)
   - ALL features visible immediately (base + exclusive)
   - No progressive reveal animation
5. Test on real mobile device (iOS Safari, Android Chrome)
6. Verify no performance issues (smooth scrolling)

**Validation:**

- [ ] Cards stack vertically on mobile (<768px)
- [ ] 2 columns on tablet (768-1023px)
- [ ] 3 columns on desktop (1024px+)
- [ ] No pinning on mobile/tablet
- [ ] All features visible immediately (no animation)
- [ ] Smooth scrolling on real mobile devices

**User-Visible Progress:** PricingSection mobile fallback validated

---

### Task 2.8: Test PricingSection i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 2.5

**Steps:**

1. Open http://localhost:5173
2. Switch to Portuguese (PT):
   - Click "PT" button in Navigation
   - Verify section heading updates to Portuguese
   - Verify all pricing card names update (Grátis, Iniciante, Profissional)
   - Verify all feature descriptions update
   - Check for text overflow in cards
3. Switch to Spanish (ES):
   - Click "ES" button in Navigation
   - Verify all text updates to Spanish
4. Switch back to English (EN)

**Validation:**

- [ ] Section heading updates on language change
- [ ] All pricing card content updates
- [ ] All feature descriptions update
- [ ] No layout shift when switching languages
- [ ] No text overflow in cards

**User-Visible Progress:** PricingSection supports 3 languages

---

## Phase 3: CTA Section & Waitlist Dialog Implementation

### Task 3.1: Add CTA/Waitlist translations to i18n files

**Estimated Time:** 30 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add sections:
   ```json
   {
     "cta": {
       "title": "Ready to run shifts without the chaos?",
       "button": "Get started"
     },
     "waitlist": {
       "title": "Join the Waitlist",
       "description": "The app is still in development",
       "features": { ... },
       "feedback": { ... },
       "email": { ... },
       "submit": "Notify me when ready",
       "success": { ... }
     }
   }
   ```
3. Repeat for `src/i18n/pt-BR.json`
4. Repeat for `src/i18n/es.json`

**Validation:**

- [ ] All 3 i18n files updated
- [ ] JSON syntax is valid
- [ ] Translations test-loaded via `useTranslation()`

**User-Visible Progress:** None (translation setup)

---

### Task 3.2: Create WaitlistDialog component

**Estimated Time:** 120 minutes
**Dependencies:** Task 1.1, Task 1.2, Task 3.1

**Steps:**

1. Create file: `src/pages/landing/components/WaitlistDialog.tsx`
2. Import dependencies:
   - `Dialog`, `DialogContent`, etc. from `@/components/ui/dialog`
   - `Checkbox` from `@/components/ui/checkbox`
   - `Input`, `Textarea`, `Button` from shadcn/ui
   - `useTranslation` from `react-i18next`
   - `useState` from `react`
   - `Check` from `lucide-react`
3. Define interfaces:
   ```typescript
   type WaitlistFeature = 'shift-management' | 'earnings-tracking' | ...;
   interface WaitlistFormData {
     selectedFeatures: WaitlistFeature[];
     feedback: string;
     email: string;
   }
   interface ValidationErrors {
     email?: string;
     selectedFeatures?: string;
   }
   interface WaitlistDialogProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
   }
   ```
4. Implement component state:
   - `const [formData, setFormData] = useState<WaitlistFormData>(...)`
   - `const [errors, setErrors] = useState<ValidationErrors>({})`
   - `const [isSubmitted, setIsSubmitted] = useState(false)`
5. Implement validation:
   - `validateEmail(email: string): string | undefined`
   - Email required check
   - Email format check (RFC 5322 simplified regex)
6. Implement event handlers:
   - `handleFeatureToggle(feature: WaitlistFeature)`
   - `handleEmailChange(e: ChangeEvent<HTMLInputElement>)`
   - `handleFeedbackChange(e: ChangeEvent<HTMLTextAreaElement>)`
   - `handleSubmit(e: FormEvent)`
   - `handleDialogClose(open: boolean)`
7. Implement form JSX:
   - Feature checkbox group (6 checkboxes)
   - Feedback textarea (optional)
   - Email input (required, with validation)
   - Submit button
8. Implement success state JSX:
   - Success icon (Check from lucide-react)
   - Success title
   - Success message with submitted email
   - Close button
9. Apply accessibility attributes:
   - `aria-invalid` on email input when error
   - `aria-describedby` linking to error message
   - `aria-required="true"` on email
   - `role="alert"` on error messages

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test dialog open/close)

**User-Visible Progress:** None (modal component preparation)

---

### Task 3.3: Create CTASection component

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.2

**Steps:**

1. Create file: `src/pages/landing/components/CTASection.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `useScrollAnimation` from `../hooks/useScrollAnimation` (from Phase 2)
   - `WaitlistDialog` from `./WaitlistDialog`
   - `Button` from shadcn/ui
   - `useState`, `useEffect` from `react`
3. Implement component:
   - Detect `prefersReducedMotion`
   - Call `useScrollAnimation` for fade-in effect
   - Manage dialog state: `const [isOpen, setIsOpen] = useState(false)`
   - Render section with heading and CTA button
   - Render WaitlistDialog component
4. Apply Tailwind classes:
   - Section: `px-4 py-20 bg-muted/30`
   - Container: `max-w-4xl mx-auto text-center`
   - Heading: `text-3xl sm:text-4xl lg:text-5xl font-bold mb-8`
   - Button: `px-8 py-4 text-lg`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** CTASection visible on landing page (when imported)

---

### Task 3.4: Import CTASection in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 3.3

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import CTASection from './components/CTASection'`
3. Add after PricingSection: `<CTASection />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] CTASection visible at http://localhost:5173
- [ ] CTA button displays correctly

**User-Visible Progress:** CTASection visible on landing page

---

### Task 3.5: Test waitlist form validation

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.4

**Steps:**

1. Open http://localhost:5173
2. Click "Get started" CTA button
3. Modal opens
4. Test email validation:
   - Leave email empty → Submit → Verify error: "Email address is required"
   - Enter invalid email (no @) → Submit → Verify error: "Please enter a valid email address"
   - Enter invalid email (no domain) → Submit → Verify error
   - Enter valid email → Verify no error
5. Test form submission:
   - Fill form (select features, add feedback, enter email)
   - Submit
   - Verify console.log shows correct data:
     ```json
     {
       "email": "test@example.com",
       "features": ["shift-management", "invoice-generation"],
       "feedback": "Looks great!",
       "timestamp": "2026-01-09T..."
     }
     ```
6. Test success state:
   - Verify success message displays submitted email
   - Verify close button works
   - Verify dialog closes on Escape key
7. Test form reset:
   - Close dialog
   - Reopen dialog
   - Verify form is empty (fresh state)

**Validation:**

- [ ] Email validation errors display correctly
- [ ] Form submission logs correct data to console
- [ ] Success message displays submitted email
- [ ] Dialog closes on close button click
- [ ] Dialog closes on Escape key
- [ ] Form resets to empty on reopen

**User-Visible Progress:** Waitlist form validation working correctly

---

### Task 3.6: Test modal keyboard navigation

**Estimated Time:** 20 minutes
**Dependencies:** Task 3.4

**Steps:**

1. Open http://localhost:5173
2. Tab to "Get started" CTA button
3. Press Enter to open modal
4. Verify focus trapped within modal
5. Press Tab repeatedly:
   - Focus cycles through: Feature checkboxes → Feedback textarea → Email input → Submit button → Close button (X) → back to first checkbox
6. Press Space on checkbox to toggle
7. Type in email field
8. Press Enter when focused on Submit button → Form submits
9. Press Escape → Modal closes
10. Verify focus returns to CTA button (trigger element)

**Validation:**

- [ ] Modal opens on Enter key (when CTA focused)
- [ ] Focus trapped within modal (Tab cycles internally)
- [ ] Space toggles checkboxes
- [ ] Enter on Submit button submits form
- [ ] Escape closes modal
- [ ] Focus returns to trigger button on close

**User-Visible Progress:** Modal keyboard navigation validated

---

### Task 3.7: Test modal accessibility (Screen Reader)

**Estimated Time:** 30 minutes
**Dependencies:** Task 3.4

**Steps:**

1. macOS - Enable VoiceOver (Cmd+F5)
2. Navigate to http://localhost:5173
3. Tab to CTA button
4. Verify VoiceOver announces: "Get started, button"
5. Press Enter to open modal
6. Verify VoiceOver announces modal title and description:
   - "Join the Waitlist, dialog"
   - "The app is still in development"
7. Tab through form fields:
   - Verify checkbox labels announced correctly
   - Verify email input announced as "Email address, required, edit text"
8. Enter invalid email
9. Tab away (blur event triggers validation)
10. Tab back to email input
11. Verify VoiceOver announces error: "Email address, invalid, Please enter a valid email address"
12. Submit form with valid data
13. Verify success message announced (via `role="status" aria-live="polite"`)

**Validation:**

- [ ] Modal title and description announced correctly
- [ ] Form field labels announced correctly
- [ ] Required fields announced as "required"
- [ ] Validation errors announced correctly
- [ ] Success message announced via live region

**User-Visible Progress:** Modal accessible to screen reader users

---

## Phase 4: Footer Implementation

### Task 4.1: Add Footer translations to i18n files

**Estimated Time:** 30 minutes
**Dependencies:** None

**Steps:**

1. Open `src/i18n/en.json`
2. Add section (see design.md for complete structure):
   ```json
   {
     "footer": {
       "sections": {
         "product": { "title": "Product", "links": { ... } },
         "company": { "title": "Company", "links": { ... } },
         "legal": { "title": "Legal", "links": { ... } },
         "connect": { "title": "Connect", "links": { ... } }
       },
       "copyright": "© {{year}} Shiftra. All rights reserved.",
       "domain": "shiftra.app",
       "email": "contact@shiftra.app"
     }
   }
   ```
3. Repeat for `src/i18n/pt-BR.json`
4. Repeat for `src/i18n/es.json`

**Validation:**

- [ ] All 3 i18n files updated
- [ ] JSON syntax is valid
- [ ] Translations test-loaded

**User-Visible Progress:** None (translation setup)

---

### Task 4.2: Create Footer type definitions and configuration

**Estimated Time:** 60 minutes
**Dependencies:** Task 4.1

**Steps:**

1. Create file: `src/pages/landing/components/footer/types.ts`
2. Define types (see design.md for complete structure):
   - `LinkType = 'internal' | 'external' | 'email'`
   - `InternalLink`, `ExternalLink`, `EmailLink` interfaces
   - `FooterLink` discriminated union
   - `FooterSection`, `FooterConfig` interfaces
   - Type guards: `isInternalLink`, `isExternalLink`, `isEmailLink`
3. Create file: `src/pages/landing/components/footer/config.ts`
4. Define `FOOTER_CONFIG` constant with all sections:
   - Product section (3 links: Features, How it works, Pricing)
   - Company section (3 links: About, Blog, Careers)
   - Legal section (3 links: Privacy, Terms, Contact email)
   - Connect section (2 links: Website, Email)
5. Export type-safe getters:
   - `getFooterSections()`
   - `getFooterSection(id: string)`

**Validation:**

- [ ] `types.ts` exports all interfaces and type guards
- [ ] `config.ts` exports FOOTER_CONFIG constant
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings

**User-Visible Progress:** None (type definitions)

---

### Task 4.3: Create FooterLink component

**Estimated Time:** 45 minutes
**Dependencies:** Task 4.2

**Steps:**

1. Create file: `src/pages/landing/components/footer/FooterLink.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `ExternalLink` icon from `lucide-react`
   - Type guards from `./types`
3. Define interface:
   ```typescript
   interface FooterLinkProps {
     link: FooterLink;
     className?: string;
     onClick?: (link: FooterLink) => void;
   }
   ```
4. Implement component:
   - Use type guards to render correct link type
   - Internal links: `<a href={link.href}>`
   - External links: `<a href={link.href} target="_blank" rel={link.rel || 'noopener noreferrer'}>` + external icon
   - Email links: `<a href={link.href}>{link.displayEmail || t(link.labelKey)}</a>`
5. Apply consistent styling:
   - `text-sm text-muted-foreground hover:text-foreground`
   - `transition-colors duration-200`
   - `focus:outline-none focus:ring-2 focus:ring-primary`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] Type guards work correctly (TypeScript inference)
- [ ] No ESLint warnings

**User-Visible Progress:** None (reusable component)

---

### Task 4.4: Create FooterColumn component (Desktop)

**Estimated Time:** 30 minutes
**Dependencies:** Task 4.3

**Steps:**

1. Create file: `src/pages/landing/components/footer/FooterColumn.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `FooterLink` from `./FooterLink`
   - Types from `./types`
3. Define interface:
   ```typescript
   interface FooterColumnProps {
     section: FooterSection;
     className?: string;
     onLinkClick?: (link: FooterLink) => void;
   }
   ```
4. Implement component:
   - Render section heading (`<h3>`)
   - Render list of FooterLink components (`<nav><ul>`)
5. Apply Tailwind classes:
   - Heading: `text-sm font-semibold mb-4 text-foreground`
   - List: `flex flex-col gap-3`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** None (desktop component)

---

### Task 4.5: Create FooterAccordion component (Mobile)

**Estimated Time:** 60 minutes
**Dependencies:** Task 1.3, Task 4.3

**Steps:**

1. Create file: `src/pages/landing/components/footer/FooterAccordion.tsx`
2. Import dependencies:
   - `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from `@/components/ui/accordion`
   - `useTranslation` from `react-i18next`
   - `FooterLink` from `./FooterLink`
   - Types from `./types`
3. Define interface:
   ```typescript
   interface FooterAccordionProps {
     sections: readonly FooterSection[];
     behavior: "single" | "multiple";
     defaultOpen?: readonly string[];
     onLinkClick?: (link: FooterLink) => void;
   }
   ```
4. Implement component:
   - Render Accordion with `type={behavior}` and `defaultValue={defaultOpen}`
   - Map sections to AccordionItem components
   - Render section title as AccordionTrigger
   - Render section links as AccordionContent
5. Apply Tailwind classes:
   - Content: `flex flex-col gap-3 pt-3`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation (test accordion behavior)

**User-Visible Progress:** None (mobile component)

---

### Task 4.6: Create Footer main component

**Estimated Time:** 60 minutes
**Dependencies:** Task 4.2, Task 4.4, Task 4.5

**Steps:**

1. Create file: `src/pages/landing/components/Footer.tsx`
2. Import dependencies:
   - `useTranslation` from `react-i18next`
   - `FooterColumn` from `./footer/FooterColumn`
   - `FooterAccordion` from `./footer/FooterAccordion`
   - `FOOTER_CONFIG` from `./footer/config`
3. Define interface:
   ```typescript
   interface FooterProps {
     config?: FooterConfig;
     breakpoint?: "sm" | "md" | "lg";
     onLinkClick?: (link: FooterLink) => void;
   }
   ```
4. Implement component:
   - Use config prop or FOOTER_CONFIG default
   - Render desktop layout (hidden md:grid md:grid-cols-4)
   - Render mobile layout (block md:hidden)
   - Render copyright section with dynamic year
5. Apply Tailwind classes:
   - Footer element: `bg-muted/30 border-t border-border`
   - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`
   - Desktop grid: `hidden md:grid md:grid-cols-4 gap-8 mb-8`
   - Mobile accordion: `block md:hidden mb-8`
   - Copyright: `text-center text-sm text-muted-foreground`

**Validation:**

- [ ] Component exports default function
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Component renders in isolation

**User-Visible Progress:** Footer visible on landing page (when imported)

---

### Task 4.7: Import Footer in LandingPage.tsx

**Estimated Time:** 5 minutes
**Dependencies:** Task 4.6

**Steps:**

1. Open `src/pages/landing/LandingPage.tsx`
2. Import: `import Footer from './components/Footer'`
3. Add after closing `</main>` tag: `<Footer />`
4. Save and verify hot reload

**Validation:**

- [ ] No TypeScript errors
- [ ] Dev server reloads successfully
- [ ] Footer visible at http://localhost:5173 (bottom of page)
- [ ] Footer displays 4 sections

**User-Visible Progress:** Footer visible on landing page

---

### Task 4.8: Test Footer desktop layout

**Estimated Time:** 20 minutes
**Dependencies:** Task 4.7

**Steps:**

1. Open http://localhost:5173 in desktop browser
2. Resize window to >768px (desktop breakpoint)
3. Scroll to bottom of page
4. Verify:
   - 4 columns visible (Product, Company, Legal, Connect)
   - NO accordions visible
   - All links clickable
   - Hover states work (text color changes)
5. Click internal link (#features)
   - Verify smooth scroll to Features section
6. Click external link (Blog)
   - Verify new tab opens
   - Verify external link icon visible
7. Click email link (Contact)
   - Verify email client opens (mailto:)

**Validation:**

- [ ] 4-column grid visible on desktop (md:768px+)
- [ ] Accordions hidden on desktop
- [ ] Internal links scroll to correct section
- [ ] External links open in new tab with `noopener noreferrer`
- [ ] Email links open email client
- [ ] Hover states work correctly

**User-Visible Progress:** Footer desktop layout validated

---

### Task 4.9: Test Footer mobile accordion

**Estimated Time:** 25 minutes
**Dependencies:** Task 4.7

**Steps:**

1. Open http://localhost:5173 in Chrome DevTools
2. Resize to mobile (375px width)
3. Scroll to bottom of page
4. Verify:
   - Grid hidden
   - Accordions visible
   - First section (Product) open by default
5. Test accordion behavior:
   - Tap "Company" section → Expands
   - Verify "Product" section remains open (multiple expandable)
   - Tap "Legal" section → Expands
   - Verify other sections remain open
   - Tap "Product" again → Collapses
6. Test on real mobile device (iOS Safari, Android Chrome)

**Validation:**

- [ ] Accordions visible on mobile (<768px)
- [ ] Grid hidden on mobile
- [ ] First section open by default
- [ ] Multiple sections can be open simultaneously
- [ ] Accordion animations smooth (no jank)
- [ ] Touch targets sufficient size (>44px)

**User-Visible Progress:** Footer mobile accordion validated

---

### Task 4.10: Test Footer i18n integration

**Estimated Time:** 15 minutes
**Dependencies:** Task 4.7

**Steps:**

1. Open http://localhost:5173
2. Scroll to footer
3. Switch to Portuguese (PT):
   - Click "PT" button in Navigation
   - Verify all section headings update (Produto, Empresa, Legal, Conectar)
   - Verify all link labels update
   - Verify copyright text updates
4. Switch to Spanish (ES)
5. Switch back to English (EN)

**Validation:**

- [ ] Section headings update on language change
- [ ] All link labels update on language change
- [ ] Copyright text updates (with current year)
- [ ] No layout shift when switching languages

**User-Visible Progress:** Footer supports 3 languages

---

## Phase 5: Integration & Testing

### Task 5.1: Run complete end-to-end user flow test

**Estimated Time:** 30 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Open http://localhost:5173 in fresh browser tab
2. Complete user journey:
   - View HeroSection (Phase 1)
   - Scroll through ReadyToSection (Phase 1)
   - Scroll through HowItWorks (Phase 2)
   - Scroll through Features (Phase 2)
   - Scroll through Benefits (Phase 2)
   - Scroll to PricingSection → Verify pinned scroll works
   - Scroll to CTASection
   - Click "Get started" button
   - Fill waitlist form (select features, add feedback, enter email)
   - Submit form
   - Verify success message
   - Close modal
   - Scroll to Footer
   - Click footer link (#features) → Verify scroll to Features
3. Test all sections with theme toggle (light/dark)
4. Test all sections with language switch (EN, PT-BR, ES)

**Validation:**

- [ ] Complete user flow works end-to-end
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Theme toggle works in all sections
- [ ] Language switch works in all sections

**User-Visible Progress:** Complete landing page user flow validated

---

### Task 5.2: Run Lighthouse accessibility audit

**Estimated Time:** 20 minutes
**Dependencies:** Task 5.1

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

### Task 5.3: Validate bundle size and performance

**Estimated Time:** 20 minutes
**Dependencies:** Task 5.2

**Steps:**

1. Analyze production bundle:
   - Check dist/ folder size
   - Verify ScrollTrigger (pinning) adds minimal size
   - Verify shadcn components add expected size (~3KB Dialog + Checkbox + Accordion)
   - Verify total bundle <200KB gzipped
2. Run Lighthouse Core Web Vitals check:
   - LCP (Largest Contentful Paint): <2.5s
   - CLS (Cumulative Layout Shift): <0.1
   - INP (Interaction to Next Paint): <200ms
3. Open Chrome DevTools → Network tab
4. Reload page, filter by JS
5. Verify GSAP lazy-loaded (only when PricingSection enters viewport)

**Validation:**

- [ ] Total bundle size <200KB gzipped (target: ~164KB)
- [ ] ScrollTrigger adds minimal size (already included)
- [ ] shadcn components add ~10KB uncompressed, ~3KB gzipped
- [ ] LCP <2.5s
- [ ] CLS <0.1 (no layout shift from animations)
- [ ] INP <200ms
- [ ] GSAP lazy-loads correctly

**User-Visible Progress:** Phase 3 meets performance targets

---

### Task 5.4: Test on real mobile devices

**Estimated Time:** 30 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Get local dev server URL with network IP:
   - Run `npm run dev`
   - Note the "Network" URL (e.g., http://192.168.1.x:5173)
2. Test on iOS device (iPhone):
   - Open Safari, navigate to dev server URL
   - Test PricingSection scroll (mobile fallback, no pinning)
   - Test modal (tap CTA, fill form, submit, close)
   - Test footer accordion (tap to expand/collapse)
   - Test theme toggle
   - Test language switcher
3. Test on Android device:
   - Open Chrome, navigate to dev server URL
   - Repeat tests from iOS
4. Check for performance issues (dropped frames, laggy animations)

**Validation:**

- [ ] All 3 Phase 3 sections render correctly on iOS
- [ ] All 3 Phase 3 sections render correctly on Android
- [ ] PricingSection mobile fallback works (no pinning, all features visible)
- [ ] Modal works on mobile (keyboard, form submission)
- [ ] Footer accordion works on mobile (smooth animations)
- [ ] No horizontal scrollbars on mobile
- [ ] Theme toggle works on mobile
- [ ] Language switcher works on mobile

**User-Visible Progress:** Phase 3 works on real mobile devices

---

### Task 5.5: Run ESLint and TypeScript checks

**Estimated Time:** 10 minutes
**Dependencies:** All implementation tasks

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

### Task 5.6: Test screen reader accessibility (All Sections)

**Estimated Time:** 45 minutes
**Dependencies:** All previous tasks

**Steps:**

1. macOS - VoiceOver:
   - Enable VoiceOver (Cmd+F5)
   - Navigate to http://localhost:5173
   - Test PricingSection:
     - Verify pricing card names announced correctly
     - Verify features announced correctly
     - Verify CTA buttons announced correctly
   - Test CTASection + Modal:
     - Verify modal title and description announced
     - Verify form fields announced correctly
     - Verify validation errors announced
     - Verify success message announced
   - Test Footer:
     - Verify section headings announced correctly
     - Verify links announced with correct roles
     - Verify external links announced as "opens in new tab"
2. Windows - NVDA (if available):
   - Open NVDA
   - Navigate to landing page
   - Repeat tests from macOS
3. Test reduced motion with screen reader:
   - Verify static content announced correctly

**Validation:**

- [ ] VoiceOver announces all content logically
- [ ] Section headings properly structured (h2, h3)
- [ ] Pricing cards navigable
- [ ] Modal focus management works with screen reader
- [ ] Form validation errors announced
- [ ] Footer links announced correctly
- [ ] External links announced as "opens in new tab"
- [ ] Screen reader users can access all content

**User-Visible Progress:** Phase 3 accessible to screen reader users

---

## Phase 6: Documentation & Handoff

### Task 6.1: Update CLAUDE.md with Phase 3 implementation notes

**Estimated Time:** 30 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Open `CLAUDE.md`
2. Update "What's Next?" section:
   - Mark PricingSection, CTASection, Footer as completed
   - Document `usePricingScrollAnimation` hook
   - Document WaitlistDialog component and form patterns
   - Document Footer type-safe link system
3. Add implementation notes:
   - Document GSAP ScrollTrigger pinning patterns
   - Note modal form validation patterns
   - Document Footer discriminated union patterns
4. Update "Phase 3" section with completion status

**Validation:**

- [ ] CLAUDE.md updated with Phase 3 completion status
- [ ] Implementation patterns documented
- [ ] File committed to git

**User-Visible Progress:** None (documentation)

---

### Task 6.2: Validate complete landing page

**Estimated Time:** 20 minutes
**Dependencies:** All previous tasks

**Steps:**

1. Open http://localhost:5173
2. Verify complete landing page structure:
   - Navigation (Phase 0)
   - HeroSection (Phase 1)
   - ReadyToSection (Phase 1)
   - HowItWorksSection (Phase 2)
   - FeaturesSection (Phase 2)
   - BenefitsSection (Phase 2)
   - PricingSection (Phase 3) ✓
   - CTASection (Phase 3) ✓
   - Footer (Phase 3) ✓
3. Verify all sections:
   - Responsive (mobile → tablet → desktop)
   - Theme-aware (light/dark mode)
   - i18n-enabled (EN, PT-BR, ES)
   - Accessible (keyboard, screen reader)
4. Take screenshots for documentation

**Validation:**

- [ ] All 9 sections visible and functional
- [ ] All sections responsive
- [ ] All sections theme-aware
- [ ] All sections support 3 languages
- [ ] All sections accessible
- [ ] Landing page feature-complete

**User-Visible Progress:** Complete landing page validated

---

## Summary

### Completed Deliverables

- [ ] PricingSection component (3 pricing cards with pinned scroll animation)
- [ ] PricingCard component (reusable pricing card)
- [ ] usePricingScrollAnimation hook (GSAP pinning with progressive reveals)
- [ ] CTASection component (final call-to-action)
- [ ] WaitlistDialog component (modal dialog with form)
- [ ] Footer component (responsive with desktop columns and mobile accordions)
- [ ] FooterColumn component (desktop section layout)
- [ ] FooterAccordion component (mobile collapsible sections)
- [ ] FooterLink component (type-safe link rendering)
- [ ] Footer types and configuration (TypeScript discriminated unions)
- [ ] shadcn/ui Dialog, Checkbox, Accordion components (installed)
- [ ] i18n translations (EN, PT-BR, ES for pricing, waitlist, footer)
- [ ] Responsive layouts (mobile → tablet → desktop)
- [ ] Accessibility compliance (WCAG AA, keyboard nav, screen reader)

### Performance Metrics to Achieve

- Lighthouse Accessibility: 100
- Lighthouse Performance: >90 (desktop), >85 (mobile)
- LCP: <2.5s
- CLS: <0.1
- Animation FPS: 60fps (desktop), >30fps (mobile)
- Bundle size: <200KB gzipped (target: ~164KB after Phase 3)

### Next Phase Preview

Phase 3 completes the landing page. Future work:

1. **Phase 4: SEO & Analytics**

   - Meta tags (title, description, Open Graph)
   - Favicon and app icons
   - Google Analytics or Plausible integration
   - Sitemap.xml generation

2. **Phase 5: Backend Integration**

   - Waitlist API endpoint (`POST /api/waitlist`)
   - Email validation service
   - Email confirmation notifications
   - Admin dashboard for waitlist management

3. **Phase 6: Advanced Features**
   - Pricing calculator (estimate costs)
   - Testimonials section (social proof)
   - FAQ section (accordion format)
   - Blog integration

---

**Total Tasks:** 47
**Estimated Time:** 24-32 hours
**Status:** Ready for implementation
