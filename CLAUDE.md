# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Shiftra Landing Page** - A modern, responsive landing page for Shiftra, a shift management and invoicing platform for Australian workers and businesses. Built with React, TypeScript, Vite, Tailwind CSS, and internationalization support (EN, PT-BR, ES).

For detailed product requirements, see `LANDING_PAGE.md`.

## Quick Commands

### Development
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (TypeScript check + Vite bundle)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

### Build Validation
- `npm run build` performs TypeScript type checking via `tsc -b` before bundling
- Strict TypeScript mode enabled (`strict: true`)

## Architecture & Key Patterns

### Directory Structure
```
src/
├── pages/landing/
│   ├── components/          # Landing page section components
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ReadyToSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
│   ├── hooks/              # Custom React hooks (useScrollAnimation, useTypewriter, etc.)
│   └── LandingPage.tsx     # Main page component
├── contexts/
│   └── ThemeContext.tsx    # Light/dark mode provider
├── i18n/
│   ├── config.ts           # i18next initialization with en, pt-BR, es
│   ├── en.json
│   ├── pt-BR.json
│   └── es.json
├── lib/
│   └── cn.ts              # Utility: clsx + tailwind-merge class combiner
├── App.tsx                # Root component wrapper
├── main.tsx               # React DOM entry point
└── index.css              # Tailwind directives + CSS variables
```

### Theme System
- **Context**: `ThemeContext.tsx` manages light/dark mode
- **CSS Variables**: Defined in `index.css` using HSL color model
- **Storage**: Theme preference saved to localStorage; respects system `prefers-color-scheme`
- **Classes**: `.dark` class added to `<html>` element to toggle dark mode

### Internationalization (i18n)
- **Library**: react-i18next + i18next
- **Config**: `src/i18n/config.ts` initializes with 3 languages (en, pt-BR, es)
- **Usage**: `const { t, i18n } = useTranslation()` in components
- **Language Switch**: Change via `i18n.changeLanguage(code)`
- **Translations**: JSON files in `src/i18n/` (one per language)

### Styling & Design Tokens
- **Framework**: Tailwind CSS v4
- **Semantic Colors**: Use `bg-primary`, `text-foreground`, `border-border` etc. (not raw hex)
- **Configuration**: `tailwind.config.js` extends default theme with CSS variable tokens
- **Utility**: `cn()` in `src/lib/cn.ts` combines clsx + tailwind-merge for safe class merging

### Animations
- **GSAP**: Used for complex animations (hero typing loop, scroll triggers)
- **CSS Keyframes**: Base animations defined in `index.css` (typing, blink, dropIn)
- **Accessibility**: All animations respect `prefers-reduced-motion` media query

## Key Implementation Notes

### Hero Section Animation
- Implements typewriter effect: phrase types in, holds 1.5s, then deletes
- Loops through rotating phrases with color changes per phrase
- Falls back to static display when `prefers-reduced-motion` is enabled
- See `LANDING_PAGE.md` lines 100-112 for color + phrase mappings

### "Are you Ready to..." Section
- CSS-driven animation: phrases drop in from bottom, display, then drop out from top
- Staggered delays using `nth-child()` selectors
- Respects `prefers-reduced-motion` with static fallback
- See `LANDING_PAGE.md` lines 114-137 for implementation guidance

### Responsive Design
- **Mobile-first** approach: base styles for mobile, then `md:`, `lg:`, etc. modifiers
- **Breakpoints**: Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
- **Images**: Placeholder paths `public/assets/landing/` (agenda.png, shift-details.png, invoice.png)

### Performance Targets (from LANDING_PAGE.md)
- Lighthouse Performance: >90 (desktop), >85 (mobile)
- Lighthouse Accessibility: 100
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1, INP <200ms
- Images: WebP with fallbacks, lazy-loaded, <200KB each

## Code Quality Standards

- **TypeScript Strict Mode**: Enabled; all `.ts`/`.tsx` files must be strict compliant
- **ESLint**: Run `npm run lint` before commits
- **No Console Logs**: Remove or gate behind `NODE_ENV !== 'production'`
- **Imports**: Use named/default exports consistently; avoid wildcard imports where possible
- **Accessibility**: Use semantic HTML; ensure WCAG AA contrast (4.5:1 normal, 3:1 large text)

## Important Files & Dependencies

- **LANDING_PAGE.md**: Source of truth for all product copy, features, and design requirements
- **React 19**: Latest version; uses new JSX transform
- **GSAP 3.14**: Animation library; lazy-load if possible
- **Tailwind CSS 4**: Latest with utility-first approach
- **TypeScript 5.9**: Strict mode enabled across all files
- **Vite 7**: Fast build tool with HMR support

## Common Patterns

### Adding a New Landing Page Section
1. Create component file: `src/pages/landing/components/{SectionName}Section.tsx`
2. Import and add to `LandingPage.tsx`
3. Use translations from `src/i18n/en.json` (structure mirrored in other languages)
4. Apply semantic Tailwind classes (bg-background, text-foreground, etc.)
5. Respect accessibility: semantic HTML, contrast ratios, reduced motion
6. Run `npm run lint` before commit

### Adding Translations
1. Add key/value pairs to all three JSON files: `en.json`, `pt-BR.json`, `es.json`
2. Use `const { t } = useTranslation()` to access in components
3. For nested objects, use dot notation: `t('section.subsection.key')`
4. For arrays, use `t('key', { returnObjects: true })` and type as `string[]`

### Theming
- Add new color variables to `:root` and `.dark` in `index.css`
- Reference in Tailwind config as `hsl(var(--color-name))`
- Always define both light and dark variants

## Implementation Notes

### Phase 1 Completed (Hero & Ready-To Sections)

**HeroSection** - GSAP typewriter animation
- ✅ Implemented with lazy-loaded GSAP (~30KB gzipped)
- ✅ Theme-aware phrase colors (light/dark palettes for WCAG AA compliance)
- ✅ Prefers-reduced-motion fallback with static display
- ✅ Custom `useTypewriter` hook at `src/pages/landing/hooks/useTypewriter.ts`
- Colors cycle through: Green → Dark gray/White → Dark yellow/Bright yellow → Dark red/Bright red

**ReadyToSection** - CSS-driven phrase rotation
- ✅ Pure CSS keyframe animation (8s cycle, 1s per phrase)
- ✅ Drop-in animation from bottom, drop-out from top
- ✅ Staggered delays using `nth-child()` selectors
- ✅ Prefers-reduced-motion fallback with static first phrase

**Animation Patterns**
- GSAP lazy-loading: `import('gsap').then((gsapModule) => { ... })`
- Theme-aware colors: Separate palettes for light/dark modes
- Reduced motion detection: `window.matchMedia('(prefers-reduced-motion: reduce)')`
- All animations respect `prefers-reduced-motion` media query

**Bundle Performance**
- Production build: ~427KB total (119KB gzipped)
- GSAP impact: ~30KB gzipped (as expected)
- Main bundle split: 70KB + 288KB chunks
- CSS: 69KB (11.5KB gzipped)
- Target achieved: <150KB gzipped total

**Accessibility Validated**
- ✅ WCAG AA contrast ratios (4.5:1 minimum)
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Semantic HTML (`<h1>`, `<section>`, `<button>`)
- ✅ Screen reader stable headlines (no character-by-character announcements)

---

### Phase 2 Completed (HowItWorks, Features, Benefits Sections)

**Implementation Date:** 2026-01-09

#### Components Created

**Main Section Components:**
- **HowItWorksSection** (`src/pages/landing/components/HowItWorksSection.tsx`)
  - 4-step workflow visualization with Lucide icons
  - GSAP ScrollTrigger staggered animations (0.2s delay per card)
  - Responsive grid: 1 column (mobile) → 2 columns (tablet+)
  - Integrated with 3 optimized images (agenda, shift-details, invoice)
  - Section ID: `#how-it-works`, Background: `bg-muted/50`

- **FeaturesSection** (`src/pages/landing/components/FeaturesSection.tsx`)
  - Two-column layout: Workers (5 cards) vs Businesses (6 cards)
  - GSAP ScrollTrigger staggered animations (0.15s delay)
  - 11 Lucide icons total
  - Responsive: single column (mobile) → 2-column split (desktop)
  - Section ID: `#features`, Background: `bg-background`

- **BenefitsSection** (`src/pages/landing/components/BenefitsSection.tsx`)
  - 4 outcome cards with animated statistics
  - Number extraction from i18n titles (handles "5 hours/week", "80%", "Zero", etc.)
  - GSAP ScrollTrigger staggered animations (0.2s delay)
  - Responsive grid: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
  - Section ID: `#benefits`, Background: `bg-muted/50`

**Reusable Card Components:**
- **OptimizedImage** (`src/pages/landing/components/OptimizedImage.tsx`)
  - `<picture>` element with WebP/PNG responsive sources
  - Lazy loading: `loading="lazy"`, `decoding="async"`
  - Priority flag to disable lazy loading for above-fold images

- **FeatureCard** (`src/pages/landing/components/FeatureCard.tsx`)
  - Icon + title + description layout
  - Built on shadcn/ui Card component
  - Hover effects: `hover:shadow-lg hover:scale-[1.02]`
  - Theme-aware icon container with `bg-primary/10`

- **BenefitCard** (`src/pages/landing/components/BenefitCard.tsx`)
  - Icon + animated number + description
  - Intersection Observer for scroll-triggered animation
  - 1-second smooth counting animation
  - Respects `prefers-reduced-motion` (shows final value immediately)

**Custom React Hooks:**
- **useScrollAnimation** (`src/pages/landing/hooks/useScrollAnimation.ts`)
  - Reusable GSAP ScrollTrigger wrapper
  - Lazy-loads GSAP + ScrollTrigger (~18KB gzipped)
  - Type-safe with TypeScript interfaces
  - Proper cleanup on unmount (kills all triggers and tweens)
  - Respects `prefers-reduced-motion` with `enabled` flag

- **useCountUpAnimation** (`src/pages/landing/hooks/useCountUpAnimation.ts`)
  - Number interpolation hook for animated statistics
  - Reads `data-target` and `data-suffix` attributes
  - Handles both integer and decimal values with proper snapping
  - 2-second animation with `power2.out` easing
  - Proper cleanup prevents memory leaks

#### Image Optimization

**WebP Conversion Script:**
- Created `scripts/generate-webp.js` (Node.js with sharp library)
- Automated prebuild hook: `npm run generate-webp` runs before `npm run build`
- Quality: 90 (lossless: false) for optimal size/quality balance

**Optimization Results:**
| Image | Original (PNG) | WebP | Savings |
|-------|---------------|------|---------|
| agenda.png | 207KB | 42KB | 79.9% |
| create-shift.png | 138KB | 48KB | 65.5% |
| invoice.png | 175KB | 40KB | 77.0% |
| shift-details.png | 192KB | 53KB | 72.7% |
| **Total** | **712KB** | **183KB** | **74.3%** |

#### Animation Patterns

**GSAP ScrollTrigger Implementation:**
```typescript
// Pattern used across all sections
const gsapModule = await import('gsap');
const ScrollTriggerModule = await import('gsap/ScrollTrigger');

gsap.fromTo(
  cards,
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2, // 0.15s for FeaturesSection
    ease: 'power2.out',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true, // Only animate once
    },
  }
);
```

**Number Animation (BenefitCard):**
- Intersection Observer triggers at 30% visibility
- 1-second animation with 30 steps
- Smooth counting using `setInterval`
- `aria-live="polite"` for screen reader compatibility
- Respects `prefers-reduced-motion` with immediate display

#### Bundle Performance (Phase 2)

**Production Build Sizes:**
```
Total Uncompressed: 496 KB
Total Gzipped: ~154 KB (Target: <200KB) ✅

Breakdown:
- Main bundle:        96.65 KB gzipped
- Secondary bundle:   27.63 KB gzipped
- ScrollTrigger:      18.00 KB gzipped (lazy-loaded)
- CSS:                11.84 KB gzipped
```

**Phase 3 Budget Remaining:** ~46KB gzipped

#### Styling Patterns

**Section Containers:**
```tsx
// Alternating backgrounds for visual separation
className="px-4 py-20 bg-muted/50"      // HowItWorks, Benefits
className="px-4 py-20 bg-background"    // Features

// Inner container (all sections)
className="max-w-7xl mx-auto"  // Wider than Phase 1 (max-w-4xl)
```

**Responsive Grids:**
```tsx
// HowItWorks: 1 col → 2 col
className="grid grid-cols-1 md:grid-cols-2 gap-8"

// Features: Nested grids for workers/businesses
className="grid grid-cols-1 lg:grid-cols-2 gap-12"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"

// Benefits: 1 col → 2 col → 4 col
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
```

**Card Styling:**
```tsx
// Hover effects
className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"

// Icon container (theme-aware)
className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
```

#### Accessibility Compliance (Phase 2)

✅ **WCAG 2.1 AA Standards:**
- Semantic HTML: `<section>`, `<h2>`, `<h3>`, `<article>`
- ARIA attributes: `aria-hidden="true"` on decorative icons, `aria-live="polite"` on animated numbers
- Keyboard navigation: All cards focusable via Tab
- Reduced motion: All animations respect `prefers-reduced-motion` media query
- Color contrast: All text meets 4.5:1 minimum contrast ratio
- Alt text: All images have descriptive alt attributes (under 125 chars)
- Focus management: Visible focus rings on interactive elements

#### Internationalization (Phase 2)

**Translation Structure:**
```json
{
  "howItWorks": {
    "title": "How Shiftra works",
    "steps": [/* 4 steps with title + description */]
  },
  "features": {
    "title": "Powerful features for everyone",
    "workers": { "title": "For Workers", "items": [/* 6 items */] },
    "businesses": { "title": "For Businesses", "items": [/* 6 items */] }
  },
  "benefits": {
    "title": "Benefits",
    "items": [/* 4 items with title + description */]
  }
}
```

**Locales Supported:**
- English (EN) - `src/i18n/en.json`
- Brazilian Portuguese (PT-BR) - `src/i18n/pt-BR.json`
- Spanish (ES) - `src/i18n/es.json`

#### Testing & Validation

✅ **Build Validation:**
- TypeScript compilation: PASS (strict mode)
- ESLint: 0 errors, 0 warnings
- Production build: SUCCESS (1.11s)
- Dev server: Running on http://localhost:5173

✅ **Component Integration:**
- All 3 sections imported in `LandingPage.tsx`
- Proper ordering: HowItWorks → Features → Benefits
- No TypeScript errors
- No runtime errors in console

⏳ **Manual Testing Pending:**
- Visual regression testing (Lighthouse snapshots)
- Responsive testing (375px, 768px, 1024px, 1920px)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Screen reader testing (VoiceOver, NVDA)
- Reduced motion testing
- Lighthouse audit (Performance >90, Accessibility 100)

#### Reusable Patterns for Future Phases

The following components and hooks are available for reuse:

1. **useScrollAnimation hook** - For scroll-triggered animations
2. **usePricingScrollAnimation hook** - For GSAP ScrollTrigger pinning patterns
3. **OptimizedImage component** - For future image assets
4. **Card components** - FeatureCard, BenefitCard, PricingCard patterns
5. **Footer type system** - Discriminated unions for type-safe links

---

### Phase 3 Completed (Conversion & Footer Sections)

**Implementation Date:** 2026-01-09

#### Components Created

**Main Section Components:**
- **PricingSection** (`src/pages/landing/components/PricingSection.tsx`)
  - 3-tier pricing display (Free, Starter, Pro)
  - Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
  - Visual differentiation: badges, border accents, highlighted Pro tier
  - All content from i18n translations
  - Section ID: `#pricing`, Background: `bg-background`

- **CTASection** (`src/pages/landing/components/CTASection.tsx`)
  - Simple call-to-action with button
  - Opens WaitlistDialog modal on click
  - Scroll animation using useScrollAnimation hook
  - Section ID: `#cta`, Background: `bg-muted/30`

- **WaitlistDialog** (`src/pages/landing/components/WaitlistDialog.tsx`)
  - Modal dialog with form (shadcn/ui Dialog)
  - 6 optional feature checkboxes (Shift management, Earnings, etc.)
  - Optional feedback textarea
  - Required email input with validation (RFC 5322 simplified)
  - Form submission logs to console (no backend yet)
  - Success state with submitted email display
  - Focus trap and keyboard navigation (Tab, Enter, Escape)

- **Footer** (`src/pages/landing/components/Footer.tsx`)
  - 4 sections: Product, Company, Legal, Connect
  - Desktop (md:768px+): 4-column grid layout
  - Mobile: Collapsible accordions (first section open by default)
  - Type-safe links using discriminated unions
  - Semantic HTML (`<footer>` outside `<main>`)
  - Dynamic copyright year

**Reusable Components:**
- **PricingCard** (`src/pages/landing/components/PricingCard.tsx`)
  - Tier-based styling (free/starter/pro)
  - Optional badge support
  - Feature lists with checkmarks (included) and X marks (not included)
  - Data attributes for GSAP animation targeting

- **Footer Supporting Files:**
  - `footer/types.ts` - TypeScript discriminated unions (InternalLink | ExternalLink | EmailLink)
  - `footer/config.ts` - Type-safe centralized configuration
  - `footer/FooterColumn.tsx` - Desktop column component
  - `footer/FooterAccordion.tsx` - Mobile accordion component
  - `footer/FooterLink.tsx` - Type-safe link renderer with type guards

**Custom Hooks:**
- **usePricingScrollAnimation** (`src/pages/landing/hooks/usePricingScrollAnimation.ts`)
  - GSAP ScrollTrigger with pinning (desktop only)
  - 3-phase animation timeline (base features → starter → pro)
  - Mobile fallback (no pinning, all features visible)
  - Lazy-loaded GSAP modules
  - Proper cleanup on unmount

#### Form Validation Patterns

**WaitlistDialog Form:**
- Controlled inputs (single source of truth via React state)
- Email validation: RFC 5322 simplified regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Real-time validation on blur
- Inline error messages with ARIA attributes
- Submit button disabled when errors exist
- No external form library (simple 3-field form)

**Form Data Structure:**
```typescript
interface WaitlistFormData {
  email: string;
  selectedFeatures: string[];
  feedback: string;
  timestamp: string;
}
```

#### TypeScript Patterns

**Discriminated Unions for Footer Links:**
```typescript
type FooterLink = InternalLink | ExternalLink | EmailLink;

interface InternalLink {
  type: 'internal';
  labelKey: string;
  href: `#${string}`; // Template literal enforces # prefix
}

interface ExternalLink {
  type: 'external';
  labelKey: string;
  href: `https://${string}` | `http://${string}`;
  rel?: 'noopener noreferrer' | 'noopener noreferrer nofollow';
}

interface EmailLink {
  type: 'email';
  labelKey: string;
  href: `mailto:${string}`;
  displayEmail?: string;
}
```

**Type Guards:**
- `isInternalLink()`, `isExternalLink()`, `isEmailLink()`
- Enable type narrowing for safe rendering

#### Bundle Performance (Phase 3)

**Production Build Sizes:**
```
Total Uncompressed: 532 KB
Total Gzipped: ~176 KB (Target: <200KB) ✅

Breakdown:
- Main bundle:        117.15 KB gzipped
- Secondary bundle:   27.63 KB gzipped
- ScrollTrigger:      18.00 KB gzipped (lazy-loaded)
- CSS:                13.22 KB gzipped
```

**Phase 3 Addition:** ~20KB gzipped
- shadcn/ui Dialog, Checkbox, Accordion: ~4.5KB
- PricingSection, CTASection, WaitlistDialog, Footer: ~15.5KB

**Budget Remaining:** ~24KB gzipped for Phase 4+

#### Internationalization (Phase 3)

**Translation Structure Added:**
```json
{
  "waitlist": {
    "title": "Join the Waitlist",
    "description": "The app is still in development",
    "features": [/* 6 feature checkboxes */],
    "feedback": { "label": "...", "placeholder": "..." },
    "email": { "label": "...", "placeholder": "..." },
    "submit": "Notify me when ready",
    "success": { "title": "...", "message": "..." }
  },
  "footer": {
    "sections": {
      "product": { "title": "Product", "links": { ... } },
      "company": { "title": "Company", "links": { ... } },
      "legal": { "title": "Legal", "links": { ... } },
      "connect": { "title": "Connect", "links": { ... } }
    },
    "copyright": "© {{year}} Shiftra. All rights reserved."
  }
}
```

**Locales:** EN, PT-BR, ES (all updated)

#### Accessibility Compliance (Phase 3)

✅ **WCAG 2.1 AA Standards:**
- Semantic HTML: `<footer>`, `<section>`, proper heading hierarchy
- ARIA attributes: `aria-invalid`, `aria-describedby`, `aria-required`, `role="alert"`
- Keyboard navigation: Tab, Enter, Escape
- Focus management: Dialog focus trap (Radix UI)
- Reduced motion: Respects `prefers-reduced-motion`
- Color contrast: All text meets 4.5:1 minimum
- Screen reader support: Form errors announced, external links indicated

#### Testing & Validation (Phase 3)

✅ **Build Validation:**
- TypeScript compilation: PASS (strict mode)
- ESLint: 0 errors, 0 warnings
- Production build: SUCCESS (1.34s)
- Bundle size: 176 KB gzipped (within 200KB budget)
- Dev server: Running on http://localhost:5173

✅ **Component Integration:**
- All Phase 3 sections imported in `LandingPage.tsx`
- Proper ordering: ...Benefits → Pricing → CTA → Footer
- No TypeScript errors
- No runtime errors in console

⏳ **Manual Testing Recommended:**
- Form validation edge cases (various email formats)
- Modal keyboard navigation (Tab, Enter, Escape)
- Footer accordion behavior on mobile
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Screen reader testing (VoiceOver, NVDA)
- Lighthouse audit (Performance, Accessibility scores)

## What's Next?

**Phase 2: Core Content Sections** ✅ **COMPLETE**
All three core sections have been implemented:
- ✅ HowItWorksSection (4-step workflow with scroll animations)
- ✅ FeaturesSection (Worker/Business feature cards, 11 total)
- ✅ BenefitsSection (Outcome cards with animated statistics)

**Phase 3: Conversion & Footer** ✅ **COMPLETE**
All conversion and footer components have been implemented:
- ✅ PricingSection (3 pricing tiers with responsive layout)
- ✅ CTASection + WaitlistDialog (Modal form with email validation)
- ✅ Footer (Type-safe links, desktop columns, mobile accordions)

**Landing Page Status:** ✅ **FEATURE-COMPLETE**
All 9 sections are now implemented and integrated.

**Future Enhancements** (Phase 4+)
- SEO meta tags, Open Graph, favicon
- Performance optimization (lazy-loading enhancements)
- Analytics integration (scroll depth, CTA clicks, form submissions)
- Waitlist API backend integration
- A/B testing framework
