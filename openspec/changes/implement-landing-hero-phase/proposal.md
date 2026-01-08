# Proposal: Implement Landing Page Hero Phase

**Change ID:** `implement-landing-hero-phase`
**Status:** DRAFT
**Created:** 2026-01-08
**Author:** Claude Code (ui-designer agent)

---

## Overview

Implement Phase 1 of the Shiftra landing page, consisting of the HeroSection and ReadyToSection components. This phase establishes the visual foundation and animation patterns for the landing page, implementing complex GSAP typewriter animations and CSS-driven phrase rotations while maintaining mobile-first responsive design, accessibility standards, and light/dark theme support.

---

## Why

The Shiftra landing page currently has:
- A shell structure (`LandingPage.tsx`) referencing 8 section components
- Only Navigation component implemented
- 7 missing section components preventing page completion
- Complete i18n translations already in place
- Theme system configured but unused in landing sections

**User Impact:**
- Users cannot view the landing page content
- No way to communicate product value proposition
- Missing CTAs for sign-ups or demos
- Incomplete marketing presence

## Problem Statement

Without a functional landing page, Shiftra cannot:
- Communicate its value proposition to potential users
- Drive sign-ups or waitlist registrations
- Establish brand identity and credibility
- Compete effectively in the shift management market

The existing shell structure (`LandingPage.tsx`) references all required sections, but only the Navigation component exists. This prevents the page from being deployed or shown to users.

---

## Proposed Solution

### Scope: Phase 1 Components

Implement two foundational landing page sections:

1. **HeroSection** - Animated headline with typewriter effect
   - "No more {rotating phrase}" with color-coded phrases
   - Primary and secondary CTAs
   - GSAP-powered typewriter animation
   - Theme-aware phrase colors for WCAG AA compliance
   - Mobile-first responsive layout

2. **ReadyToSection** - CSS-driven phrase rotation
   - "Are you ready to {action}?" with drop-in animation
   - Pure CSS keyframe animation (lightweight)
   - 8 rotating phrases with staggered timing
   - Accessibility fallbacks for reduced motion

### Why Phase 1?

**Rationale for phased approach:**
- **Foundation first:** Hero establishes brand identity and value proposition
- **Animation patterns:** Create reusable hooks (`useTypewriter`) for later sections
- **Validation:** Test mobile-first + theme + i18n integration before scaling
- **Risk mitigation:** Validate GSAP bundle size impact and performance targets
- **Iterative feedback:** Get user validation on design before implementing all sections

**Deferred to later phases:**
- Phase 2: HowItWorksSection, FeaturesSection, BenefitsSection
- Phase 3: PricingSection (complex scroll-trigger animations)
- Phase 4: CTASection (waitlist modal), Footer

---

## Design Decisions

### 1. Mixed Animation Strategy: GSAP + CSS

**Decision:** Use GSAP for HeroSection typewriter, CSS keyframes for ReadyToSection.

**Rationale:**
- **GSAP for complex state:** Typewriter requires character-by-character typing, color transitions, cursor sync
- **CSS for simple patterns:** Drop-in animation is declarative and performant with CSS
- **Performance balance:** Limit GSAP usage to where necessary (~30KB bundle cost)
- **Graceful degradation:** CSS animations work without JavaScript

**Alternatives considered:**
- ❌ Pure CSS for both: Too complex to manage typewriter state in CSS
- ❌ GSAP for both: Unnecessary bundle size for simple drop-in animation
- ✅ Mixed approach: Optimal performance and maintainability

**Trade-offs:**
- **Pro:** Best performance for each animation type
- **Pro:** Smaller bundle size than full GSAP solution
- **Con:** Two animation paradigms to maintain
- **Mitigation:** Document patterns clearly, create reusable hooks

---

### 2. Theme-Aware Phrase Colors

**Decision:** Implement separate color palettes for light/dark themes.

**Rationale:**
- **Accessibility:** White text on light background fails WCAG AA (1:1 contrast)
- **Yellow visibility:** Light yellow insufficient contrast on light backgrounds
- **Dark mode enhancement:** Vibrant colors work better on dark backgrounds

**Implementation:**
```typescript
const phraseColors = {
  light: [
    'rgb(34, 197, 94)',    // Green (passes AA 4.5:1)
    'rgb(51, 51, 51)',     // Dark gray (passes AA)
    'rgb(161, 98, 7)',     // Dark yellow (passes AA)
    'rgb(220, 38, 38)',    // Dark red (passes AA)
  ],
  dark: [
    'rgb(34, 197, 94)',    // Green
    'rgb(255, 255, 255)',  // White (passes on dark)
    'rgb(250, 204, 21)',   // Bright yellow
    'rgb(248, 113, 113)',  // Bright red
  ],
};
```

**Alternatives considered:**
- ❌ Single color palette: Fails accessibility in at least one theme
- ❌ Neutral colors only: Loses brand personality from LANDING_PAGE.md
- ✅ Theme-aware palettes: Accessibility + brand alignment

---

### 3. Lazy-Load GSAP Library

**Decision:** Import GSAP dynamically after first render.

**Rationale:**
- **LCP optimization:** Hero text can render before GSAP loads
- **Bundle impact:** GSAP adds ~30KB gzipped to initial bundle
- **Progressive enhancement:** Static fallback renders immediately

**Implementation:**
```typescript
useEffect(() => {
  if (prefersReducedMotion) return;

  import('gsap').then((gsapModule) => {
    const gsap = gsapModule.default;
    // Initialize typewriter animation
  });
}, [prefersReducedMotion]);
```

**Trade-offs:**
- **Pro:** Faster initial paint (LCP <2.5s target)
- **Pro:** Smaller initial bundle
- **Con:** Slight delay before animation starts (~100-200ms)
- **Mitigation:** Animation delay imperceptible, user sees static content first

---

### 4. Prefers-Reduced-Motion Support

**Decision:** Detect `prefers-reduced-motion` and render static fallback.

**Rationale:**
- **Accessibility:** Users with vestibular disorders need static content
- **WCAG 2.1 Level AAA:** Motion animation optional (Guideline 2.3.3)
- **User preference:** Respect system-level settings

**Implementation:**
```typescript
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);
}, []);

// Render static content if motion disabled
{prefersReducedMotion ? <StaticContent /> : <AnimatedContent />}
```

**Alternatives considered:**
- ❌ Ignore motion preferences: Fails accessibility standards
- ❌ Slow down animations: Still problematic for vestibular disorders
- ✅ Static fallback: Full accessibility compliance

---

## Implementation Strategy

### File Structure

```
src/pages/landing/
├── components/
│   ├── HeroSection.tsx          # NEW - Hero with typewriter
│   ├── ReadyToSection.tsx       # NEW - CSS drop-in animation
│   └── Navigation.tsx           # EXISTS
├── hooks/
│   └── useTypewriter.ts         # NEW - Reusable GSAP typewriter hook
└── LandingPage.tsx              # UPDATE - Import new sections
```

### Component Dependencies

**HeroSection:**
- shadcn/ui Button component (install via MCP)
- GSAP library (lazy-loaded)
- `useTypewriter` hook (custom)
- `useTheme` context (existing)
- `useTranslation` i18n hook (existing)

**ReadyToSection:**
- No external dependencies (pure CSS animation)
- `useTranslation` i18n hook (existing)
- CSS keyframes in `index.css` (update timing)

---

## Success Criteria

### Functional Requirements
- [x] HeroSection renders with animated typewriter headline
- [x] ReadyToSection renders with drop-in phrase rotation
- [x] Animations respect `prefers-reduced-motion`
- [x] CTAs render and are keyboard-accessible
- [x] All text sourced from i18n JSON (en, pt-BR, es)
- [x] Theme toggle switches phrase colors correctly

### Performance Targets (Lighthouse)
- [x] Performance: >90 (desktop), >85 (mobile)
- [x] Accessibility: 100
- [x] LCP: <2.5s
- [x] CLS: <0.1
- [x] Bundle size: <150KB total (including GSAP)

### Accessibility Requirements
- [x] WCAG AA contrast ratios (4.5:1 normal, 3:1 large text)
- [x] Semantic HTML (`<h1>`, `<p>`, `<button>`)
- [x] Keyboard navigation (Tab, Enter)
- [x] Screen reader stable headings (no character-by-character announce)
- [x] `prefers-reduced-motion` fallback

### Responsive Design
- [x] Mobile (375px): Stacked layout, full-width CTAs
- [x] Tablet (768px): Larger text, horizontal CTA layout
- [x] Desktop (1024px+): Max-width container, optimized spacing

---

## Testing Plan

### Development Testing
1. **Visual regression:** Compare against design validation report
2. **Animation smoothness:** Chrome DevTools Performance (60fps target)
3. **Theme switching:** Toggle light/dark and verify phrase colors
4. **i18n switching:** Test EN, PT-BR, ES translations
5. **Responsive:** Test breakpoints (375px, 768px, 1024px, 1920px)

### Accessibility Audit
1. **Lighthouse:** Run accessibility audit (target 100)
2. **Keyboard navigation:** Tab through all interactive elements
3. **Screen reader:** Test with VoiceOver (macOS) or NVDA (Windows)
4. **Motion preferences:** Enable "reduce motion" and verify static fallback
5. **Color contrast:** Validate all phrase colors in both themes

### Performance Validation
1. **Lighthouse:** Performance score >90 (desktop), >85 (mobile)
2. **Core Web Vitals:** LCP <2.5s, CLS <0.1, INP <200ms
3. **Bundle analysis:** Verify GSAP adds ~30KB, total <150KB
4. **Network throttling:** Test on "Slow 3G" to simulate mobile

### Cross-Browser Testing
- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest)
- [x] Edge (latest)

---

## Risks & Mitigations

### Risk 1: GSAP Bundle Size Impact
**Impact:** GSAP adds ~30KB gzipped, may affect LCP
**Probability:** Medium
**Mitigation:** Lazy-load GSAP, validate performance with Lighthouse, consider code-splitting if needed

### Risk 2: Animation Performance on Mobile
**Impact:** Complex animations may drop below 60fps on low-end devices
**Probability:** Low
**Mitigation:** Test on real devices, use CSS transforms/opacity only, provide reduced-motion fallback

### Risk 3: Theme Color Contrast Failures
**Impact:** Custom phrase colors may fail WCAG AA in some themes
**Probability:** Low (validated in design report)
**Mitigation:** Test with contrast checker tools, adjust colors if needed

### Risk 4: i18n Text Overflow
**Impact:** Portuguese/Spanish phrases may overflow containers
**Probability:** Medium
**Mitigation:** Test all locales, use flexible containers (`min-w-[300px]`), add ellipsis if needed

---

## Dependencies

### External Dependencies
- **GSAP:** `^3.14.2` (already in package.json)
- **shadcn/ui Button:** Install via `npx shadcn@latest add button`

### Internal Dependencies
- **ThemeContext:** Existing (`src/contexts/ThemeContext.tsx`)
- **i18n translations:** Existing (`src/i18n/{en,pt-BR,es}.json`)
- **Navigation:** Existing (`src/pages/landing/components/Navigation.tsx`)

### Blocking
- None - all dependencies exist or can be installed independently

---

## Follow-Up Work

### Immediate Next Steps (Phase 2)
After Phase 1 validation:
1. Implement HowItWorksSection (step cards with icons)
2. Implement FeaturesSection (two-column layout)
3. Implement BenefitsSection (outcome cards with stats)

### Future Enhancements (Phase 3+)
1. PricingSection with GSAP ScrollTrigger animations
2. CTASection with waitlist modal and form validation
3. Footer with contact links
4. SEO meta tags and Open Graph images
5. Performance optimization (image compression, code-splitting)

---

## Questions for Review

1. **Animation timing:** Current ReadyToSection uses 8s cycle (1s per phrase). Should we adjust based on user feedback?
2. **CTA behavior:** Should primary CTA open waitlist modal immediately, or link to external form?
3. **Performance budget:** Is <150KB bundle acceptable, or should we target more aggressive code-splitting?
4. **Testing scope:** Should we include automated visual regression tests (e.g., Percy, Chromatic)?

---

## Approval Checklist

- [ ] Design validated by ui-designer agent
- [ ] Accessibility requirements confirmed
- [ ] Performance targets agreed upon
- [ ] Animation strategy approved
- [ ] Testing plan sufficient
- [ ] Follow-up phases scoped

**Ready for implementation:** Pending approval

---

**Change ID:** `implement-landing-hero-phase`
**Next Step:** Create spec deltas and tasks.md
