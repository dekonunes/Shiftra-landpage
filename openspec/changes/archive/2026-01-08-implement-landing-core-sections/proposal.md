# Proposal: Implement Landing Page Core Content Sections (Phase 2)

**Change ID:** `implement-landing-core-sections`
**Status:** DRAFT
**Created:** 2026-01-08
**Author:** Claude Code (ui-designer + react-specialist + typescript-pro agents)

---

## Overview

Implement Phase 2 of the Shiftra landing page, consisting of HowItWorksSection, FeaturesSection, and BenefitsSection components. This phase builds on the animation patterns established in Phase 1, implementing GSAP ScrollTrigger animations, optimized image handling (PNG → WebP conversion), and feature card layouts while maintaining mobile-first responsive design, accessibility standards, and light/dark theme support.

---

## What Changes

This change introduces three new landing page sections and supporting infrastructure:

**New Components:**
- `HowItWorksSection` - 4-step workflow visualization with scroll animations
- `FeaturesSection` - Worker and business feature cards in responsive layout
- `BenefitsSection` - Outcome cards with animated statistics
- `OptimizedImage` - Reusable component for WebP/PNG responsive images
- `FeatureCard` - Reusable feature card component
- `BenefitCard` - Reusable benefit card component

**New Hooks:**
- `useScrollAnimation` - Reusable GSAP ScrollTrigger wrapper for scroll-triggered animations
- `useCountUpAnimation` - Number interpolation for animated statistics

**Build System:**
- WebP conversion script (`scripts/generate-webp.js`) for image optimization
- Prebuild hook to generate WebP images from PNG sources

**Assets:**
- 4 WebP images generated from existing PNG files (25-35% smaller file sizes)

**Dependencies:**
- shadcn/ui Card component (via CLI installation)
- sharp package (devDependency for WebP conversion)
- GSAP ScrollTrigger plugin (lazy-loaded, ~5KB gzipped)

**i18n Updates:**
- Translation keys for HowItWorks, Features, and Benefits sections across EN, PT-BR, ES

---

## Why

**Current State:**
- Phase 1 completed: HeroSection and ReadyToSection implemented
- Navigation component functional
- 3 core content sections missing: How It Works, Features, Benefits
- Image assets available but not optimized (PNG format, 138KB-207KB each)
- No scroll-triggered animations yet implemented

**User Impact:**
- Users cannot understand the product workflow (How It Works)
- Workers and businesses don't see relevant features
- No concrete value proposition with outcomes/statistics
- Missing visual hierarchy that guides users through the value proposition

---

## Problem Statement

Without these core content sections, Shiftra's landing page:
- Cannot effectively communicate the 4-step workflow to potential users
- Fails to differentiate features for workers vs. businesses
- Lacks credibility through concrete outcome statistics
- Misses opportunities for scroll-triggered engagement animations
- Has unoptimized images that impact mobile performance

The product has clear workflows and differentiated value propositions (documented in LANDING_PAGE.md), but the landing page doesn't communicate them effectively.

---

## Proposed Solution

### Scope: Phase 2 Components

Implement three core content sections with scroll animations and optimized images:

1. **HowItWorksSection** - 4-step workflow with icons
   - Visual workflow: Post/Find → Confirm → Track → Invoice
   - Step cards with Lucide React icons
   - GSAP ScrollTrigger staggered card reveals
   - Image integration: agenda.png (mobile), shift-details.png (desktop), create-shift.png (desktop), invoice.png (mobile)
   - WebP conversion + PNG fallback for all images

2. **FeaturesSection** - Worker vs Business feature cards
   - Side-by-side card layout (responsive: stacked → columns)
   - Each feature as a card with icon + description
   - Two feature sets: Workers (find shifts, calendar, invoicing) vs Businesses (post shifts, crew chat, translation)
   - GSAP ScrollTrigger fade-in animations per card
   - Lucide React icons for each feature

3. **BenefitsSection** - Outcome cards with animated statistics
   - 4 outcome cards with key metrics
   - Animated number counting: "Save 5 hours/week", "80% faster invoicing", "Zero missed shifts"
   - GSAP-powered number animations (count up from 0)
   - Grid layout (responsive: 1 column → 2 columns → 4 columns)
   - Icon per benefit card

### Why Phase 2 Now?

**Rationale for this grouping:**
- **Content foundation:** These sections form the core value proposition narrative
- **Animation progression:** Introduces ScrollTrigger (required for Phase 3 pricing)
- **Performance validation:** Test image optimization strategy before adding more media
- **Reusable patterns:** Card layouts and scroll animations will be reused in Phase 3
- **User flow:** Establishes the problem → solution → proof structure

**Deferred to Phase 3:**
- PricingSection (complex pinned scroll animations)
- CTASection (waitlist modal with form validation)
- Footer (simple static content)

---

## Design Decisions

### 1. GSAP ScrollTrigger for Scroll Animations

**Decision:** Use GSAP ScrollTrigger for all scroll-triggered animations in Phase 2.

**Rationale:**
- **Consistency:** All sections use the same animation library (GSAP already loaded in Phase 1)
- **Precise control:** ScrollTrigger offers granular control over animation timing and sequencing
- **Performance:** Hardware-accelerated, optimized for 60fps
- **Reusability:** ScrollTrigger patterns established here will be used in Phase 3 PricingSection
- **Bundle size:** ScrollTrigger is part of GSAP core (~5KB additional gzipped)

**Implementation:**
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useEffect(() => {
  const cards = gsap.utils.toArray('.step-card');

  cards.forEach((card, index) => {
    gsap.from(card as HTMLElement, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: card as HTMLElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}, []);
```

**Alternatives considered:**
- ❌ Intersection Observer API: Less control, requires manual animation state management
- ❌ Pure CSS `scroll-timeline`: Experimental, poor browser support (Safari)
- ✅ GSAP ScrollTrigger: Industry standard, battle-tested, excellent browser support

**Trade-offs:**
- **Pro:** Smooth, performant animations with precise control
- **Pro:** Reusable pattern for all future sections
- **Con:** Adds ~5KB gzipped to bundle (acceptable within budget)
- **Mitigation:** Lazy-load ScrollTrigger plugin only when sections enter viewport

---

### 2. Image Optimization: PNG → WebP with Fallback

**Decision:** Convert all PNG images to WebP format with PNG fallback using `<picture>` element.

**Rationale:**
- **Performance:** WebP provides 25-35% smaller file sizes vs. PNG (critical for mobile)
- **Quality:** Lossless compression maintains visual fidelity
- **Accessibility:** `<picture>` provides automatic fallback for older browsers
- **Current state:** Images are 138KB-207KB PNG (exceeds 200KB target from LANDING_PAGE.md line 325)

**Current Image Sizes:**
- agenda.png: 207KB (mobile) → Target: ~140KB WebP
- create-shift.png: 138KB (desktop) → Target: ~90KB WebP
- invoice.png: 175KB (mobile) → Target: ~120KB WebP
- shift-details.png: 192KB (desktop) → Target: ~130KB WebP

**Implementation:**
```tsx
<picture>
  <source srcSet="/assets/landing/agenda.webp" type="image/webp" />
  <img
    src="/assets/landing/agenda.png"
    alt="Agenda showing upcoming shifts and reminders"
    loading="lazy"
    decoding="async"
    className="..."
  />
</picture>
```

**Conversion Tool:** Use `sharp` library (Node.js) or Vite plugin for build-time conversion.

**Alternatives considered:**
- ❌ Keep PNG only: Fails performance budget, slow mobile load
- ❌ Use AVIF: Better compression but poorer browser support (Safari <16)
- ✅ WebP + PNG fallback: Best balance of performance and compatibility

---

### 3. Feature Card Layout Strategy

**Decision:** Implement feature cards as individual components with icon + title + description.

**Rationale:**
- **Scanability:** Card format easier to scan than plain bullet lists (aligns with LANDING_PAGE.md line 82)
- **Visual hierarchy:** Icons provide immediate visual anchors
- **Responsive:** Cards naturally reflow in grid layouts
- **Reusability:** Card component can be reused in BenefitsSection

**Card Structure:**
```tsx
<Card className="p-6 hover:shadow-lg transition-shadow">
  <Icon className="h-8 w-8 text-primary mb-4" />
  <h3 className="text-lg font-semibold mb-2">Feature Title</h3>
  <p className="text-sm text-muted-foreground">Feature description</p>
</Card>
```

**Layout:**
- Mobile (base): 1 column, stacked cards
- Tablet (md:768px): 2 columns per side (Workers | Businesses)
- Desktop (lg:1024px): 3 columns per side

**Alternatives considered:**
- ❌ Plain bullet lists: Less engaging, harder to scan
- ❌ Accordion/collapsible: Adds interaction complexity, hides content
- ✅ Feature cards: Visual, scannable, responsive

---

### 4. Animated Statistics in BenefitsSection

**Decision:** Animate numbers counting up from 0 using GSAP.

**Rationale:**
- **Engagement:** Animated numbers draw attention to key metrics
- **Credibility:** Counting animation emphasizes concrete outcomes
- **Performance:** GSAP handles number interpolation efficiently
- **User feedback:** Requested by user (question 4 answer)

**Implementation:**
```typescript
useEffect(() => {
  const counters = gsap.utils.toArray('.stat-number');

  counters.forEach((counter) => {
    const target = parseFloat((counter as HTMLElement).dataset.target || '0');

    gsap.from(counter, {
      innerText: 0,
      duration: 2,
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter as HTMLElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: function() {
        (counter as HTMLElement).innerText = Math.ceil(this.targets()[0].innerText);
      },
    });
  });
}, []);
```

**Alternatives considered:**
- ❌ Static numbers: Less engaging, misses opportunity for visual interest
- ❌ CSS counter animations: Limited browser support, poor control
- ✅ GSAP number interpolation: Smooth, controllable, performant

---

### 5. Lucide React for Icons

**Decision:** Use Lucide React for all icons (already installed: v0.562.0).

**Rationale:**
- **Already installed:** Zero additional bundle size
- **Tree-shakeable:** Only imports used icons (~1-2KB per icon)
- **Consistent:** Matches shadcn/ui ecosystem (used in Phase 1 Button)
- **TypeScript support:** Excellent type definitions
- **Accessibility:** Built-in `aria-label` support

**Icon Selection (HowItWorksSection):**
1. Step 1 (Post/Find): `CalendarPlus` or `Search`
2. Step 2 (Confirm): `CheckCircle` or `ClipboardCheck`
3. Step 3 (Track): `Clock` or `TrendingUp`
4. Step 4 (Invoice): `FileText` or `DollarSign`

**Icon Selection (FeaturesSection):**
- Workers: `Briefcase`, `Calendar`, `DollarSign`, `FileText`, `Bell`
- Businesses: `Users`, `MessageSquare`, `Globe`, `UserPlus`, `BarChart`

**Icon Selection (BenefitsSection):**
1. Save time: `Clock` or `Zap`
2. Faster invoicing: `FileCheck` or `Gauge`
3. Zero missed shifts: `CheckCircle` or `Shield`
4. Get paid faster: `TrendingUp` or `Wallet`

---

### 6. Responsive Image Strategy

**Decision:** Use mobile images (agenda.png, invoice.png) for viewport <768px, desktop images (shift-details.png, create-shift.png) for ≥768px.

**Rationale:**
- **Mobile dimensions:** agenda.png (707x1425), invoice.png (709x1378) - portrait, optimized for mobile screens
- **Desktop dimensions:** shift-details.png (1998x1082), create-shift.png (1060x1354) - landscape/tall, optimized for desktops
- **Performance:** Avoid loading large desktop images on mobile
- **User experience:** Appropriate image aspect ratios per device

**Implementation:**
```tsx
<picture>
  <source
    media="(min-width: 768px)"
    srcSet="/assets/landing/shift-details.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 768px)"
    srcSet="/assets/landing/shift-details.png"
  />
  <source srcSet="/assets/landing/agenda.webp" type="image/webp" />
  <img
    src="/assets/landing/agenda.png"
    alt="..."
    loading="lazy"
    className="..."
  />
</picture>
```

---

## Implementation Strategy

### File Structure

```
src/
├── assets/landing/
│   ├── agenda.png (existing)
│   ├── agenda.webp (NEW - generated)
│   ├── create-shift.png (existing)
│   ├── create-shift.webp (NEW - generated)
│   ├── invoice.png (existing)
│   ├── invoice.webp (NEW - generated)
│   ├── shift-details.png (existing)
│   └── shift-details.webp (NEW - generated)
├── pages/landing/
│   ├── components/
│   │   ├── HowItWorksSection.tsx (NEW)
│   │   ├── FeaturesSection.tsx (NEW)
│   │   ├── BenefitsSection.tsx (NEW)
│   │   ├── FeatureCard.tsx (NEW - reusable)
│   │   ├── BenefitCard.tsx (NEW - reusable)
│   │   └── OptimizedImage.tsx (NEW - picture wrapper)
│   ├── hooks/
│   │   ├── useScrollAnimation.ts (NEW - ScrollTrigger wrapper)
│   │   └── useCountUpAnimation.ts (NEW - number counter)
│   └── LandingPage.tsx (UPDATE - import new sections)
└── scripts/
    └── generate-webp.js (NEW - image conversion script)
```

### Component Dependencies

**All Sections:**
- GSAP + ScrollTrigger (already in package.json: ^3.14.2)
- Lucide React (already installed: v0.562.0)
- shadcn/ui Card component (install via MCP if missing)

**HowItWorksSection:**
- OptimizedImage component (custom)
- useScrollAnimation hook (custom)
- 4 Lucide icons (CalendarPlus, CheckCircle, Clock, FileText)

**FeaturesSection:**
- FeatureCard component (custom)
- useScrollAnimation hook (custom)
- 10+ Lucide icons (Briefcase, Calendar, Users, MessageSquare, etc.)

**BenefitsSection:**
- BenefitCard component (custom)
- useCountUpAnimation hook (custom)
- 4 Lucide icons (Clock, FileCheck, CheckCircle, TrendingUp)

---

## Success Criteria

### Functional Requirements
- [ ] HowItWorksSection renders with 4 step cards and images
- [ ] FeaturesSection renders with worker/business feature cards
- [ ] BenefitsSection renders with 4 outcome cards and animated numbers
- [ ] All images load as WebP with PNG fallback
- [ ] ScrollTrigger animations trigger at correct scroll positions
- [ ] Number animations count up smoothly in BenefitsSection
- [ ] All sections responsive (mobile → tablet → desktop)
- [ ] All text sourced from i18n JSON (en, pt-BR, es)
- [ ] Theme toggle works correctly in all sections

### Performance Targets (Lighthouse)
- [ ] Performance: >90 (desktop), >85 (mobile)
- [ ] Accessibility: 100
- [ ] LCP: <2.5s (with optimized WebP images)
- [ ] CLS: <0.1 (stable layouts, no layout shift on image load)
- [ ] Bundle size: <200KB total (including ScrollTrigger)

### Image Optimization Targets
- [ ] All images <150KB (WebP format)
- [ ] PNG fallbacks remain available
- [ ] `loading="lazy"` on all below-fold images
- [ ] Responsive images load appropriate size per viewport
- [ ] Images have proper `alt` text (WCAG AA)

### Accessibility Requirements
- [ ] WCAG AA contrast ratios (4.5:1 normal, 3:1 large text)
- [ ] Semantic HTML (`<section>`, `<h2>`, `<article>`, `<figure>`)
- [ ] Keyboard navigation (Tab through all cards)
- [ ] Screen reader stable content (no animation announcement)
- [ ] `prefers-reduced-motion` respected (disable ScrollTrigger)

### Animation Requirements
- [ ] ScrollTrigger animations run at 60fps
- [ ] Staggered card reveals feel natural (0.2s delay per card)
- [ ] Number animations complete in 2s
- [ ] Animations reverse on scroll up (toggleActions)
- [ ] No animation jank or dropped frames on mobile

---

## Testing Plan

### Development Testing
1. **Visual regression:** Compare against LANDING_PAGE.md requirements
2. **Animation smoothness:** Chrome DevTools Performance (60fps target)
3. **Image loading:** Verify WebP loads in modern browsers, PNG in older
4. **Responsive images:** Test mobile vs desktop image loading at 768px breakpoint
5. **Theme switching:** Toggle light/dark and verify all sections adapt
6. **i18n switching:** Test EN, PT-BR, ES translations (check for text overflow)
7. **Scroll animations:** Verify ScrollTrigger animations at various scroll speeds

### Accessibility Audit
1. **Lighthouse:** Run accessibility audit (target 100)
2. **Keyboard navigation:** Tab through all cards and verify focus rings
3. **Screen reader:** Test with VoiceOver/NVDA (verify stable content)
4. **Motion preferences:** Enable "reduce motion" and verify animations disable
5. **Color contrast:** Validate all text colors in both themes
6. **Image alt text:** Verify all images have descriptive alt attributes

### Performance Validation
1. **Lighthouse:** Performance score >90 (desktop), >85 (mobile)
2. **Core Web Vitals:** LCP <2.5s, CLS <0.1, INP <200ms
3. **Bundle analysis:** Verify ScrollTrigger adds ~5KB, total <200KB
4. **Network throttling:** Test on "Slow 3G" to simulate mobile
5. **Image optimization:** Verify WebP images load and are smaller than PNG

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest - WebP support since 14+)
- [ ] Edge (latest)

---

## Risks & Mitigations

### Risk 1: ScrollTrigger Bundle Size Impact
**Impact:** ScrollTrigger adds ~5KB gzipped, may push total over budget
**Probability:** Low
**Mitigation:** Lazy-load ScrollTrigger, validate bundle size with build analysis, acceptable within 200KB target

### Risk 2: Image Optimization Build Complexity
**Impact:** WebP conversion adds build step complexity
**Probability:** Medium
**Mitigation:** Use simple Node.js script with `sharp` library, run as prebuild script in package.json

### Risk 3: Animation Performance on Low-End Mobile
**Impact:** Complex scroll animations may drop below 60fps
**Probability:** Medium
**Mitigation:** Test on real devices, use CSS transforms/opacity only (GPU-accelerated), provide reduced-motion fallback

### Risk 4: i18n Text Overflow in Feature Cards
**Impact:** Portuguese/Spanish feature descriptions may overflow card containers
**Probability:** Medium
**Mitigation:** Test all locales, use flexible card heights, add ellipsis or "Read more" if needed

### Risk 5: WebP Browser Support
**Impact:** Safari <14 doesn't support WebP (released 2020, very low usage)
**Probability:** Very Low
**Mitigation:** PNG fallback provided, WebP supported in all modern browsers (>95% global support)

---

## Dependencies

### External Dependencies
- **GSAP:** `^3.14.2` (existing)
- **GSAP ScrollTrigger:** Included in GSAP core
- **Lucide React:** `^0.562.0` (existing)
- **shadcn/ui Card:** Install via `npx shadcn@latest add card`
- **sharp:** `^0.33.0` (install for WebP conversion)

### Internal Dependencies
- **ThemeContext:** Existing (`src/contexts/ThemeContext.tsx`)
- **i18n translations:** Existing (`src/i18n/{en,pt-BR,es}.json`)
- **Phase 1 components:** Existing (HeroSection, ReadyToSection)

### Blocking
- None - all dependencies exist or can be installed independently

---

## Follow-Up Work

### Immediate Next Steps (Phase 3)
After Phase 2 validation:
1. Implement PricingSection with pinned scroll animations
2. Implement CTASection with waitlist modal and form validation
3. Implement Footer with contact links and social media

### Future Enhancements (Phase 4+)
1. SEO meta tags and Open Graph images
2. Performance optimization (further image compression, code-splitting)
3. Accessibility enhancements (ARIA labels, live regions)
4. Analytics integration (track scroll depth, CTA clicks)
5. A/B testing framework for headline variants

---

## Questions for Review

1. **Icon selection:** Are the proposed Lucide icons appropriate for each feature/benefit, or should we use different ones?
2. **Animation timing:** Is 0.2s delay per card appropriate for staggered reveals, or should it be faster/slower?
3. **Number animation:** Should numbers count up every time they enter viewport, or only once per page load?
4. **Image placement:** Which images should go with which steps in HowItWorksSection (agenda, shift-details, create-shift, invoice)?

---

## Approval Checklist

- [ ] Design validated by ui-designer agent
- [ ] Accessibility requirements confirmed
- [ ] Performance targets agreed upon
- [ ] Animation strategy approved
- [ ] Image optimization strategy approved
- [ ] Testing plan sufficient
- [ ] Follow-up phases scoped

**Ready for implementation:** Pending approval

---

**Change ID:** `implement-landing-core-sections`
**Next Step:** Create spec deltas (how-it-works-section, features-section, benefits-section) and tasks.md
