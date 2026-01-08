# Design Document: Landing Page Core Content Sections (Phase 2)

**Change ID:** `implement-landing-core-sections`
**Status:** DRAFT
**Last Updated:** 2026-01-08

---

## Architectural Overview

This document captures the architectural reasoning, design patterns, and trade-off decisions for implementing Phase 2 of the Shiftra landing page. Building on Phase 1's animation and theming foundations, Phase 2 introduces scroll-triggered animations (GSAP ScrollTrigger), optimized image handling (WebP conversion), and reusable card component patterns that will be extended in Phase 3.

---

## System Architecture

### Component Hierarchy

```
LandingPage (orchestrator)
├── Navigation (Phase 0)
├── main
│   ├── HeroSection (Phase 1)
│   ├── ReadyToSection (Phase 1)
│   ├── HowItWorksSection (NEW - Phase 2)
│   │   ├── OptimizedImage × 4 (with responsive sources)
│   │   ├── Step Cards × 4 (with icons)
│   │   └── useScrollAnimation hook
│   ├── FeaturesSection (NEW - Phase 2)
│   │   ├── FeatureCard × 5 (Workers)
│   │   ├── FeatureCard × 5 (Businesses)
│   │   └── useScrollAnimation hook
│   ├── BenefitsSection (NEW - Phase 2)
│   │   ├── BenefitCard × 4 (with animated numbers)
│   │   ├── useCountUpAnimation hook
│   │   └── useScrollAnimation hook
│   └── [Phase 3: Pricing, CTA, Footer...]
```

### Data Flow

```
i18n JSON files (en, pt-BR, es)
    ↓
useTranslation hook
    ↓
Section Components
    ↓
useScrollAnimation hook (GSAP ScrollTrigger)
    ↓
Animate on scroll (opacity, translateY, number interpolation)
    ↓
User scrolls → animations trigger/reverse
```

### State Management

**Global State (React Context):**
- **ThemeContext:** Light/dark mode (existing, from Phase 1)
- **i18next:** Language state (existing, from Phase 1)

**Local State (Component):**
- **HowItWorksSection:**
  - `prefersReducedMotion` (boolean) - Detected from media query
  - ScrollTrigger instances (managed by useScrollAnimation hook)

- **FeaturesSection:**
  - `prefersReducedMotion` (boolean)
  - ScrollTrigger instances

- **BenefitsSection:**
  - `prefersReducedMotion` (boolean)
  - ScrollTrigger instances for cards
  - Number animation state (managed by useCountUpAnimation hook)

**No global scroll state:** Each section independently manages its own scroll animations.

---

## Animation Architecture

### Three-Tiered Animation Strategy (Phase 1 + Phase 2)

**Tier 1: Complex State Animations (GSAP Timeline)**
- Use case: Multi-step animations requiring precise state management
- Example: HeroSection typewriter (Phase 1)
- Pattern: Lazy-load GSAP, encapsulate in custom hook

**Tier 2: Simple Declarative Animations (CSS Keyframes)**
- Use case: Repeating animations with no state
- Example: ReadyToSection drop-in animation (Phase 1)
- Pattern: Define `@keyframes` in index.css, apply via class

**Tier 3: Scroll-Triggered Animations (GSAP ScrollTrigger)** ← NEW in Phase 2
- Use case: Animations triggered by scroll position
- Example: HowItWorksSection card reveals, BenefitsSection number counting
- Pattern: useScrollAnimation hook wraps ScrollTrigger setup/cleanup
- Performance: GPU-accelerated transforms, 60fps target

### ScrollTrigger Architecture

**Decision Matrix:**

| Animation Pattern | Trigger | Complexity | Technology | Example |
|---|---|---|---|---|
| Card fade-in | Scroll | Low | ScrollTrigger | HowItWorksSection cards |
| Staggered reveals | Scroll | Medium | ScrollTrigger | FeaturesSection cards |
| Number counting | Scroll | High | ScrollTrigger + interpolation | BenefitsSection stats |
| Pinned sections | Scroll | Very High | ScrollTrigger + pinning | PricingSection (Phase 3) |

### useScrollAnimation Hook Pattern

**Abstraction:**
```typescript
interface UseScrollAnimationOptions {
  target: string; // CSS selector
  animation: gsap.TweenVars; // GSAP animation config
  triggerConfig?: ScrollTrigger.Vars; // ScrollTrigger config
  enabled?: boolean; // Respect prefers-reduced-motion
}

function useScrollAnimation(options: UseScrollAnimationOptions) {
  useEffect(() => {
    if (!options.enabled) return;

    // Lazy-load ScrollTrigger plugin
    import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
      gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);

      const elements = gsap.utils.toArray(options.target);

      elements.forEach((el, index) => {
        gsap.from(el as HTMLElement, {
          ...options.animation,
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            ...options.triggerConfig,
          },
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [options.enabled]);
}
```

**Benefits:**
- **Reusable:** Same hook for all scroll animations across sections
- **Consistent:** Standardized scroll trigger points and timing
- **Accessible:** Respects `prefers-reduced-motion` automatically
- **Clean:** Handles cleanup on unmount

**Future Applications:**
- Phase 3 PricingSection (pinned scroll animations)
- Phase 3 CTASection (modal entrance animations)
- Any future scroll-triggered effects

---

## Image Optimization Architecture

### WebP Conversion Strategy

**Current State (before Phase 2):**
- 4 PNG images: 138KB-207KB each
- Total: ~712KB unoptimized
- Exceeds 200KB target per image (LANDING_PAGE.md line 325)

**Target State (after Phase 2):**
- 4 PNG images (fallback)
- 4 WebP images (primary): ~90KB-140KB each
- Total WebP: ~480KB (33% reduction)
- Lazy-loaded below-fold images

### Conversion Workflow

**Build-Time Conversion (Preferred):**
```bash
# scripts/generate-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'src/assets/landing';
const outputDir = 'src/assets/landing';

fs.readdirSync(inputDir)
  .filter(file => file.endsWith('.png'))
  .forEach(async (file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

    await sharp(inputPath)
      .webp({ quality: 90, lossless: false })
      .toFile(outputPath);

    console.log(`✓ Converted ${file} → ${path.basename(outputPath)}`);
  });
```

**Add to package.json:**
```json
{
  "scripts": {
    "generate-webp": "node scripts/generate-webp.js",
    "prebuild": "npm run generate-webp"
  }
}
```

**Why Build-Time?**
- **Pro:** Images generated once, committed to repo
- **Pro:** No runtime overhead, no CDN dependencies
- **Pro:** Developers can test locally with optimized images
- **Con:** Requires `sharp` as devDependency (~15MB)

**Alternatives considered:**
- ❌ Runtime conversion (CDN): Adds latency, requires CDN setup
- ❌ Manual conversion: Error-prone, not repeatable
- ✅ Build-time script: Automated, fast, reliable

---

### Responsive Image Strategy

**Mobile vs Desktop Image Selection:**

| Image | Dimensions | Orientation | Viewport | File Size (PNG → WebP) |
|---|---|---|---|---|
| agenda.png | 707×1425 | Portrait | <768px | 207KB → ~140KB |
| invoice.png | 709×1378 | Portrait | <768px | 175KB → ~120KB |
| shift-details.png | 1998×1082 | Landscape | ≥768px | 192KB → ~130KB |
| create-shift.png | 1060×1354 | Tall | ≥768px | 138KB → ~90KB |

**Implementation - OptimizedImage Component:**
```tsx
interface OptimizedImageProps {
  mobileSrc: string; // e.g., 'agenda.png'
  desktopSrc?: string; // e.g., 'shift-details.png'
  alt: string;
  className?: string;
}

export function OptimizedImage({
  mobileSrc,
  desktopSrc,
  alt,
  className
}: OptimizedImageProps) {
  const mobileWebP = mobileSrc.replace('.png', '.webp');
  const desktopWebP = desktopSrc?.replace('.png', '.webp');

  return (
    <picture>
      {desktopSrc && (
        <>
          <source
            media="(min-width: 768px)"
            srcSet={`/src/assets/landing/${desktopWebP}`}
            type="image/webp"
          />
          <source
            media="(min-width: 768px)"
            srcSet={`/src/assets/landing/${desktopSrc}`}
          />
        </>
      )}
      <source
        srcSet={`/src/assets/landing/${mobileWebP}`}
        type="image/webp"
      />
      <img
        src={`/src/assets/landing/${mobileSrc}`}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
```

**Why `<picture>` Element?**
- **Automatic fallback:** Browser selects best format automatically
- **Responsive images:** Different images for mobile vs desktop
- **Accessibility:** Single `alt` attribute, screen-reader friendly
- **Performance:** Browser only downloads 1 image (respects media queries)

---

## Feature Card Architecture

### Card Component Pattern

**Reusable Card Components:**

1. **FeatureCard** (FeaturesSection)
   ```tsx
   interface FeatureCardProps {
     icon: LucideIcon;
     title: string;
     description: string;
   }
   ```

2. **BenefitCard** (BenefitsSection)
   ```tsx
   interface BenefitCardProps {
     icon: LucideIcon;
     title: string;
     value: string; // e.g., "5 hours/week"
     description: string;
   }
   ```

**Design System Integration:**
- Use shadcn/ui Card component as base
- Apply semantic Tailwind classes: `bg-card`, `border-border`, `text-card-foreground`
- Hover states: `hover:shadow-lg transition-shadow`
- Consistent spacing: `p-6` (mobile), `p-8` (desktop)

**Layout Patterns:**

| Section | Mobile (base) | Tablet (md:768px) | Desktop (lg:1024px) |
|---|---|---|---|
| FeaturesSection | 1 column | 2 columns | 2 columns (3 cards each) |
| BenefitsSection | 1 column | 2 columns | 4 columns |

**Grid Implementation:**
```tsx
// FeaturesSection
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
</div>

// BenefitsSection
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {benefits.map(benefit => <BenefitCard key={benefit.title} {...benefit} />)}
</div>
```

---

## Number Animation Architecture

### useCountUpAnimation Hook

**Purpose:** Animate numbers counting up from 0 to target value on scroll.

**Implementation:**
```typescript
interface UseCountUpAnimationOptions {
  target: string; // CSS selector
  enabled?: boolean; // Respect prefers-reduced-motion
}

function useCountUpAnimation(options: UseCountUpAnimationOptions) {
  useEffect(() => {
    if (!options.enabled) return;

    import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
      gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);

      const counters = gsap.utils.toArray(options.target);

      counters.forEach((counter) => {
        const el = counter as HTMLElement;
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || ''; // e.g., '%', ' hours'

        gsap.from(el, {
          innerText: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { innerText: target % 1 === 0 ? 1 : 0.1 }, // Integer or decimal
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none', // Only play once
          },
          onUpdate: function() {
            const value = Math.ceil(this.targets()[0].innerText * 10) / 10;
            el.innerText = `${value}${suffix}`;
          },
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [options.enabled]);
}
```

**Usage:**
```tsx
<BenefitCard
  value={
    <span
      className="stat-number text-4xl font-bold"
      data-target="80"
      data-suffix="%"
    >
      0%
    </span>
  }
  description="Reduce invoicing time by 80%"
/>
```

**Edge Cases:**
- **Decimals:** Use `snap: 0.1` for decimal values (e.g., 4.5 hours)
- **Large numbers:** Add thousands separator (e.g., 1,000 → 1,000)
- **Percentage:** Append `%` suffix via `data-suffix`
- **Currency:** Prepend `$` via custom formatting

---

## Responsive Design Strategy

### Mobile-First Breakpoint Patterns

**Phase 2 Breakpoint Usage:**

| Component | Base (0-767px) | md: (768px+) | lg: (1024px+) |
|---|---|---|---|
| HowItWorksSection | 1 col, stacked cards | 2 col cards | 2 col cards |
| FeaturesSection | 1 col per side | 2 col per side | 3 col per side |
| BenefitsSection | 1 col | 2 col | 4 col |
| Images | Mobile portrait | Desktop landscape | Desktop landscape |

**Container Strategy (consistent with Phase 1):**
```tsx
<section className="py-16 sm:py-24 bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

**Why `max-w-7xl` for Phase 2?**
- Phase 1 used `max-w-4xl` (896px) for hero content
- Phase 2 has wider card grids (3-4 columns) → needs more space
- `max-w-7xl` = 1280px, provides breathing room for cards
- Still constrains content on ultrawide monitors

---

## Accessibility Architecture

### Scroll Animation Accessibility

**Challenge:** Scroll-triggered animations may cause vestibular issues.

**Solution:** Detect and respect `prefers-reduced-motion`.

**Implementation:**
```typescript
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);

  const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);

// Pass to animation hooks
useScrollAnimation({
  target: '.step-card',
  animation: { opacity: 0, y: 50 },
  enabled: !prefersReducedMotion, // Disable if motion reduced
});
```

**Fallback Behavior:**
- When `prefers-reduced-motion` is enabled:
  - All ScrollTrigger animations disabled
  - Elements render in final state (opacity: 1, y: 0)
  - Number animations show final values immediately
  - No GSAP code loaded (performance benefit)

### Image Accessibility

**Requirements (WCAG 2.1 Level AA):**
- **Alt text:** Descriptive, under 125 characters (LANDING_PAGE.md lines 147-154)
- **Loading:** `loading="lazy"` for below-fold images (all Phase 2 images)
- **Decoding:** `decoding="async"` to prevent main thread blocking
- **Dimensions:** Provide `width` and `height` to prevent layout shift (CLS)

**Example:**
```tsx
<OptimizedImage
  mobileSrc="agenda.png"
  desktopSrc="shift-details.png"
  alt="Agenda showing upcoming shifts and reminders"
  className="w-full h-auto"
  width={707}
  height={1425}
/>
```

---

## Performance Optimization Patterns

### Bundle Size Budget Tracking

**Phase 1 Baseline:**
- GSAP core: ~30KB gzipped
- React + deps: ~50KB gzipped
- Phase 1 code: ~40KB gzipped
- **Total Phase 1:** ~120KB gzipped

**Phase 2 Addition:**
- GSAP ScrollTrigger: ~5KB gzipped
- Lucide icons (10 icons): ~10KB gzipped
- shadcn/ui Card: ~2KB gzipped
- Phase 2 components: ~30KB gzipped
- **Total Phase 2 addition:** ~47KB gzipped

**Total After Phase 2:** ~167KB gzipped (within 200KB budget)

**Phase 3 Budget Remaining:** ~33KB gzipped

### Lazy Loading Strategy

**Phase 2 Lazy Loading:**
1. **GSAP ScrollTrigger:** Lazy-load when first section enters viewport
2. **Images:** All use `loading="lazy"` (below-fold)
3. **Lucide Icons:** Tree-shaken, only import used icons

**Future Lazy Loading (Phase 3):**
- PricingSection: Code-split as separate chunk
- CTASection modal: Lazy-load on CTA button click
- Footer: No lazy loading needed (small, static)

---

## Testing Strategy

### Animation Testing Checklist

**ScrollTrigger Validation:**
- [ ] Animations trigger at correct scroll position (top 80%)
- [ ] Animations reverse on scroll up (toggleActions)
- [ ] Staggered delays feel natural (0.2s per card)
- [ ] No animation jank at 60fps (Chrome DevTools Performance)
- [ ] Mobile animations smooth (test on real device)

**Number Animation Validation:**
- [ ] Numbers count from 0 to target value
- [ ] Duration is consistent (2s)
- [ ] Decimal values animate smoothly (snap: 0.1)
- [ ] Suffixes display correctly (%, hours, etc.)
- [ ] Animation triggers once per page load (toggleActions)

**Image Optimization Validation:**
- [ ] WebP images load in modern browsers (Chrome, Firefox, Safari 14+)
- [ ] PNG fallback loads in older browsers
- [ ] Responsive images swap at 768px breakpoint
- [ ] Lazy loading defers below-fold images
- [ ] LCP <2.5s with optimized images

### Accessibility Testing Checklist

**Motion Accessibility:**
- [ ] Enable "reduce motion" in system preferences
- [ ] Verify all ScrollTrigger animations disabled
- [ ] Verify elements render in final state
- [ ] Verify number animations show final values
- [ ] Verify no GSAP loaded (network tab)

**Image Accessibility:**
- [ ] All images have descriptive alt text
- [ ] Alt text under 125 characters
- [ ] Images have width/height attributes
- [ ] No CLS (Cumulative Layout Shift) on image load
- [ ] Screen readers announce alt text correctly

---

## Reusable Patterns for Phase 3

### 1. useScrollAnimation Hook

**Established in Phase 2, reusable for:**
- PricingSection card reveals
- CTASection modal entrance
- Footer fade-in

**Usage:**
```typescript
useScrollAnimation({
  target: '.pricing-card',
  animation: { opacity: 0, scale: 0.95 },
  triggerConfig: { start: 'top 70%' },
  enabled: !prefersReducedMotion,
});
```

### 2. OptimizedImage Component

**Established in Phase 2, reusable for:**
- Any future image assets
- Hero background images (Phase 3+)
- Team photos, logos, etc.

**Usage:**
```tsx
<OptimizedImage
  mobileSrc="hero-mobile.png"
  desktopSrc="hero-desktop.png"
  alt="..."
/>
```

### 3. Card Components (FeatureCard, BenefitCard)

**Established in Phase 2, extendable for:**
- PricingCard (Phase 3)
- TestimonialCard (Phase 4)
- TeamMemberCard (Phase 4)

**Pattern:**
```tsx
<Card className="p-6 hover:shadow-lg transition-shadow">
  <Icon className="h-8 w-8 text-primary mb-4" />
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-sm text-muted-foreground">{description}</p>
</Card>
```

---

## Trade-Off Analysis

### GSAP ScrollTrigger vs. Intersection Observer API

**Decision:** Use GSAP ScrollTrigger for all scroll animations.

**Pros:**
- **Unified API:** Same library as Phase 1 typewriter animation
- **Precise control:** Fine-grained timing, easing, stagger
- **Declarative:** Less boilerplate than Intersection Observer
- **Reversible:** Animations reverse on scroll up automatically
- **Performance:** Hardware-accelerated, optimized for 60fps

**Cons:**
- **Bundle size:** +5KB gzipped (acceptable within budget)
- **JavaScript dependency:** Requires JS execution (but Phase 1 already uses GSAP)

**Alternatives Considered:**
1. **Intersection Observer API:** More verbose, requires manual animation state management
2. **CSS `scroll-timeline`:** Experimental, poor browser support (Safari)
3. **Framer Motion:** Similar bundle size, less precise control

**Conclusion:** ScrollTrigger is the right choice for consistent, performant scroll animations.

---

### Build-Time vs. Runtime Image Optimization

**Decision:** Convert PNG → WebP at build time using Node.js script.

**Pros:**
- **Simple:** Single script, no CDN setup
- **Fast:** Images generated once, committed to repo
- **Repeatable:** Automated, runs on every build
- **Testable:** Developers can test locally with optimized images

**Cons:**
- **Requires sharp:** +15MB devDependency (acceptable)
- **Repo size:** WebP images committed to git (+~480KB)

**Alternatives Considered:**
1. **Runtime CDN:** Adds latency, requires CDN configuration
2. **Manual conversion:** Error-prone, not repeatable
3. **Vite plugin:** Possible, but adds complexity to Vite config

**Conclusion:** Build-time script is simplest and most reliable.

---

### Staggered Card Animation: CSS vs. GSAP

**Decision:** Use GSAP ScrollTrigger for staggered card animations.

**Pros:**
- **Precise control:** Exact 0.2s delay per card
- **Scroll-aware:** Animations trigger only when in viewport
- **Reversible:** Animations reverse on scroll up
- **Consistent:** Same pattern as other scroll animations

**Cons:**
- **JavaScript:** Requires GSAP execution (but already loaded)
- **Complexity:** Slightly more complex than pure CSS

**Alternatives Considered:**
1. **Pure CSS with `animation-delay`:** Animations play immediately, not scroll-aware
2. **CSS `scroll-timeline`:** Experimental, poor browser support

**Conclusion:** GSAP ScrollTrigger provides best UX for scroll-triggered stagger.

---

## Future Enhancements

### Phase 3 Preview (Pricing, CTA, Footer)

**PricingSection:**
- 3 pricing cards with pinned scroll animation
- GSAP ScrollTrigger with `pin: true`
- Step-by-step feature reveals per plan
- Most complex animation in landing page

**CTASection:**
- Waitlist modal with form validation
- Feature multi-select checkboxes
- Email validation
- Success state animation
- Lazy-load modal on button click

**Footer:**
- Simple static content (links, contact)
- No animations (static)

### Phase 4+ (Future Improvements)

**Performance Enhancements:**
- Code-split PricingSection (if bundle >200KB)
- Implement critical CSS inlining
- Add service worker for offline support

**Accessibility Enhancements:**
- Add ARIA live regions for dynamic content
- Implement keyboard shortcuts for navigation
- Add skip-to-content link

**Analytics Integration:**
- Track scroll depth per section
- Monitor CTA click-through rates
- A/B test headline variants

---

## Appendix: Key Files Created

### New Files (Phase 2)

**Components:**
- `src/pages/landing/components/HowItWorksSection.tsx`
- `src/pages/landing/components/FeaturesSection.tsx`
- `src/pages/landing/components/BenefitsSection.tsx`
- `src/pages/landing/components/FeatureCard.tsx`
- `src/pages/landing/components/BenefitCard.tsx`
- `src/pages/landing/components/OptimizedImage.tsx`

**Hooks:**
- `src/pages/landing/hooks/useScrollAnimation.ts`
- `src/pages/landing/hooks/useCountUpAnimation.ts`

**Assets:**
- `src/assets/landing/agenda.webp`
- `src/assets/landing/create-shift.webp`
- `src/assets/landing/invoice.webp`
- `src/assets/landing/shift-details.webp`

**Scripts:**
- `scripts/generate-webp.js`

### Modified Files (Phase 2)

- `src/pages/landing/LandingPage.tsx` (import new sections)
- `src/i18n/en.json` (add section translations)
- `src/i18n/pt-BR.json` (add section translations)
- `src/i18n/es.json` (add section translations)
- `package.json` (add `prebuild` script for WebP generation)

### Configuration Files (No Changes)

- `tailwind.config.js` (existing semantic tokens sufficient)
- `tsconfig.json` (strict mode already enabled)
- `vite.config.ts` (no changes needed)

---

**Status:** Ready for spec deltas and implementation
**Next Step:** Create spec deltas for how-it-works-section, features-section, benefits-section
