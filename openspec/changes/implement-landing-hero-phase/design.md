# Design Document: Landing Page Hero Phase

**Change ID:** `implement-landing-hero-phase`
**Status:** DRAFT
**Last Updated:** 2026-01-08

---

## Architectural Overview

This document captures the architectural reasoning, design patterns, and trade-off decisions for implementing Phase 1 of the Shiftra landing page. The implementation establishes foundational patterns for animations, theming, responsiveness, and i18n that will be reused across all future landing page sections.

---

## System Architecture

### Component Hierarchy

```
LandingPage (orchestrator)
├── Navigation (existing)
├── main
│   ├── HeroSection (new)
│   │   ├── Animated Headline (GSAP)
│   │   ├── Subheadline
│   │   ├── CTAs (shadcn Button)
│   │   └── Trust Line
│   ├── ReadyToSection (new)
│   │   ├── Static Prefix
│   │   └── Animated Phrases (CSS)
│   ├── [Future sections...]
│   └── Footer (future)
```

### Data Flow

```
i18n JSON files
    ↓
useTranslation hook
    ↓
Component (HeroSection / ReadyToSection)
    ↓
Render with theme-aware styles
    ↓
User interaction (theme toggle, language switch)
    ↓
Re-render with updated context
```

### State Management

**Global State (React Context):**
- **ThemeContext:** Manages light/dark mode
  - Persisted to localStorage
  - System preference fallback
  - Exposes: `theme`, `toggleTheme()`

- **i18next:** Manages language state
  - Persisted to localStorage
  - Browser language fallback
  - Exposes: `t()`, `i18n.changeLanguage()`

**Local State (Component):**
- **HeroSection:**
  - `prefersReducedMotion` (boolean) - Detected from media query
  - `animatedTextRef` (ref) - Target for GSAP animation

- **ReadyToSection:**
  - None (pure functional, no local state)

---

## Animation Architecture

### Two-Tiered Animation Strategy

**Tier 1: Complex Animations (GSAP)**
- Use case: Multi-step animations requiring precise state management
- Example: HeroSection typewriter (character-by-character, color changes, cursor)
- Pattern: Lazy-load GSAP, encapsulate in custom hook (`useTypewriter`)
- Performance: ~30KB bundle cost, but necessary for complex behavior

**Tier 2: Simple Animations (CSS Keyframes)**
- Use case: Declarative, repeating animations with no state
- Example: ReadyToSection drop-in animation
- Pattern: Define `@keyframes` in index.css, apply via class
- Performance: Zero JS overhead, GPU-accelerated by default

**Decision Matrix:**

| Animation Type | Complexity | State Required | Technology | Example |
|---|---|---|---|---|
| Character typing | High | Yes (char index, phrase index) | GSAP | HeroSection |
| Drop in/out | Low | No | CSS keyframes | ReadyToSection |
| Scroll-triggered | High | Yes (scroll position) | GSAP + ScrollTrigger | PricingSection (Phase 3) |
| Fade in | Low | No | CSS keyframes | Future sections |

---

## Theme System Architecture

### Color Token Strategy

**Semantic Tokens (Preferred):**
- Use Tailwind CSS semantic classes: `bg-background`, `text-foreground`, `text-primary`
- Automatically adapt to light/dark mode via CSS variables
- Defined in `index.css` under `:root` and `.dark`

**Custom Colors (When Necessary):**
- Use inline styles or theme-conditional logic for brand-specific colors
- Example: Hero phrase colors (green, yellow, red) with theme variants
- Pattern: Define color palettes in component, select based on `theme` context

**Why Both?**
- Semantic tokens: Cover 90% of use cases, automatic theme switching
- Custom colors: Brand requirements (LANDING_PAGE.md specifies exact colors per phrase)
- Trade-off: Slight code complexity, but maintains brand consistency + accessibility

### Accessibility-First Color Selection

**Process:**
1. Designer specifies colors (LANDING_PAGE.md)
2. Validate WCAG AA contrast (4.5:1 normal text, 3:1 large text)
3. Adjust colors if needed:
   - Light mode: Darken bright colors (yellow, white → dark variants)
   - Dark mode: Brighten dark colors (use original spec)
4. Implement theme-conditional palettes

**Example - Hero Phrase Colors:**

| Phrase | LANDING_PAGE.md Spec | Light Mode (Adjusted) | Dark Mode (Original) | Contrast Ratio |
|---|---|---|---|---|
| "WhatsApp chaos" | Green | rgb(34, 197, 94) | rgb(34, 197, 94) | 4.6:1 ✓ |
| "invoice forms" | White | rgb(51, 51, 51) | rgb(255, 255, 255) | 12.6:1 ✓ |
| "miscommunication" | Yellow | rgb(161, 98, 7) | rgb(250, 204, 21) | 4.5:1 ✓ |
| "unknown employers" | Red | rgb(220, 38, 38) | rgb(248, 113, 113) | 5.3:1 ✓ |

---

## Responsive Design Architecture

### Mobile-First Breakpoint Strategy

**Philosophy:** Start with mobile constraints, progressively enhance for larger screens.

**Tailwind Breakpoints Used:**
- **Base (0-639px):** Mobile phones
  - Single column layout
  - Compact spacing (`py-16`, `gap-4`)
  - Full-width buttons (`w-full`)
  - Smaller text (`text-2xl`, `text-4xl`)

- **sm (640px+):** Large phones, small tablets
  - Horizontal CTA layout (`sm:flex-row`)
  - Auto-width buttons (`sm:w-auto`)
  - Medium text (`sm:text-3xl`, `sm:text-5xl`)

- **lg (1024px+):** Desktops
  - Maximum text size (`lg:text-4xl`, `lg:text-6xl`)
  - Increased spacing (`lg:py-24`)
  - Container max-width constrains content (`max-w-4xl`)

**Why Skip md: (768px)?**
- **Decision:** Use `sm:` for tablets, reserve granular control for critical layouts only
- **Rationale:** Reduces class verbosity, covers most use cases with two breakpoints (mobile, desktop)
- **Exception:** Use `md:` in complex layouts like PricingSection (Phase 3)

### Container Strategy

**Pattern:**
```tsx
<section className="py-16 sm:py-24 bg-background">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

**Rationale:**
- Outer `<section>`: Full-width background color/pattern
- Inner `<div>`: Constrained content width (896px = `max-w-4xl`)
- Progressive padding: `px-4` (mobile) → `sm:px-6` (tablet) → `lg:px-8` (desktop)
- Prevents content from touching viewport edges on mobile
- Prevents content from becoming unreadably wide on ultrawide monitors

---

## Internationalization (i18n) Architecture

### Translation Key Structure

**Pattern:** `{section}.{element}.{variant}?`

**Examples:**
- `hero.prefixText` → "No more"
- `hero.phrases` → Array of 4 phrases
- `hero.primaryCta` → "Create account"
- `readyTo.prefix` → "Are you ready to"
- `readyTo.phrases` → Array of 8 phrases

**Design Decisions:**
1. **Flat structure:** Avoid deep nesting (max 2 levels: `section.key`)
   - Pro: Easy to find keys, simple to maintain
   - Con: Key names must be unique within section

2. **Plural forms:** Use arrays for multiple items (`phrases`)
   - Retrieve with: `t('hero.phrases', { returnObjects: true }) as string[]`
   - TypeScript enforces correct type casting

3. **No embedded HTML:** All strings are plain text
   - Pro: Safe, no XSS risk, easier to translate
   - Con: Limited formatting (use Tailwind for styling)

### Language Switching UX

**Flow:**
1. User clicks language button (EN | PT | ES) in Navigation
2. `i18n.changeLanguage(code)` called
3. All components using `useTranslation()` re-render immediately
4. Animations continue (HeroSection updates phrases on next cycle)

**No Remounting:**
- Components stay mounted during language change
- React reconciliation updates text nodes only
- Animations persist (GSAP timeline continues, CSS keyframes uninterrupted)

**Text Overflow Handling:**
- Portuguese/Spanish phrases may be longer than English
- Solution: Use flexible containers (`min-w-[300px]`, `w-full`)
- Test: Manually validate longest phrases in each language

---

## Performance Optimization Architecture

### Bundle Size Strategy

**GSAP Lazy Loading:**
```typescript
useEffect(() => {
  if (!enabled) return;

  import('gsap').then((gsapModule) => {
    const gsap = gsapModule.default;
    // Initialize animation
  });
}, [enabled]);
```

**Benefits:**
- GSAP (~30KB gzipped) only loaded when animation is enabled
- Users with `prefers-reduced-motion` never download GSAP
- Defers GSAP loading until after initial paint (improves LCP)

**Trade-offs:**
- Pro: Faster initial load, smaller initial bundle
- Pro: Better LCP (Largest Contentful Paint)
- Con: Slight delay (~100-200ms) before animation starts
- Mitigation: Users see static content immediately, delay is imperceptible

### Code Splitting (Future)

**Current:** Single bundle (landing page only)

**Future (if needed):**
- Split by route: Landing page vs. App pages
- Split by section: Lazy-load pricing modal, footer
- Split by library: Separate GSAP, i18n chunks

**Threshold for code-splitting:** >200KB total bundle (gzipped)

---

## Accessibility Architecture

### WCAG 2.1 Level AA Compliance Strategy

**Semantic HTML:**
- Always use correct element: `<h1>` for main headline, `<button>` for CTAs
- Avoid `<div>` with `onClick` (use `<button>` instead)
- Structure: `<section>` → `<div>` (container) → `<h2>` → `<p>` → `<button>`

**Keyboard Navigation:**
- All interactive elements must be focusable with Tab
- Focus order must be logical (left-to-right, top-to-bottom)
- Visible focus ring (`:focus-visible` or custom `ring-*` classes)

**Screen Reader Support:**
- Stable headings: Don't announce character-by-character typing
  - Solution: Use `aria-live="off"` on animated text, stable text elsewhere
- Descriptive labels: Use `aria-label` for animated regions
- Language: Set `lang` attribute on `<html>` element (handled by i18n)

**Motion Accessibility:**
- Detect `prefers-reduced-motion` media query
- Render static fallback (first phrase only, no animation)
- WCAG 2.1 Guideline 2.3.3 (Level AAA): Animation from interactions optional

**Color Contrast:**
- All text must meet WCAG AA minimum:
  - Normal text: 4.5:1 contrast
  - Large text (18px+ or 14px+ bold): 3:1 contrast
- Validate with tools: Chrome DevTools, WAVE, axe

### Reduced Motion Implementation

**Pattern:**
```typescript
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);

  const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);

// Conditional rendering
{prefersReducedMotion ? <StaticContent /> : <AnimatedContent />}
```

**CSS Fallback (for ReadyToSection):**
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

---

## Reusable Patterns for Future Sections

### Custom Hook Pattern: useTypewriter

**Abstraction:**
- Encapsulates GSAP animation logic
- Exposes simple API: `{ ref, phrases, theme, enabled }`
- Handles cleanup automatically
- Reusable for any character-by-character animation

**Future Applications:**
- Typewriter effect in CTASection modal
- Animated stats in BenefitsSection (numbers counting up)
- Any text animation requiring precise timing

**Pattern Template:**
```typescript
interface UseCustomAnimationOptions {
  ref: RefObject<HTMLElement>;
  enabled: boolean;
  // ... other options
}

export function useCustomAnimation(options: UseCustomAnimationOptions) {
  useEffect(() => {
    if (!options.enabled || !options.ref.current) return;

    // Lazy-load library if needed
    import('library').then((lib) => {
      // Initialize animation
    });

    return () => {
      // Cleanup
    };
  }, [options.enabled, /* other deps */]);
}
```

### CSS Animation Pattern: Staggered Keyframes

**Abstraction:**
- Define `@keyframes` in `index.css`
- Apply to elements with staggered delays via `nth-child`
- Control timing with CSS variables (future enhancement)

**Future Applications:**
- HowItWorksSection step cards fading in
- FeaturesSection feature list items sliding in
- BenefitsSection stat cards appearing on scroll

**Pattern Template:**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-list > li {
  animation: fadeInUp 0.6s ease-out both;
}

.animated-list > li:nth-child(1) { animation-delay: 0s; }
.animated-list > li:nth-child(2) { animation-delay: 0.1s; }
.animated-list > li:nth-child(3) { animation-delay: 0.2s; }
/* ... */
```

---

## Testing Strategy

### Layers of Testing

**1. Visual Testing (Manual)**
- Chrome DevTools device emulation
- Real device testing (iOS, Android)
- Theme switching (light/dark)
- Language switching (EN, PT-BR, ES)

**2. Performance Testing (Automated)**
- Lighthouse CI (run on every PR)
- Bundle size monitoring (CI check if >150KB)
- Animation FPS profiling (Chrome DevTools Performance tab)

**3. Accessibility Testing (Automated + Manual)**
- Lighthouse accessibility audit (target 100)
- axe-core (automated)
- Screen reader testing (VoiceOver, NVDA) - manual
- Keyboard navigation testing - manual

**4. Cross-Browser Testing (Manual)**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Minimum 2 versions back for each browser

### Testing Checklist (Per Section)

- [ ] Responsive (375px, 768px, 1024px, 1920px)
- [ ] Theme toggle (light/dark)
- [ ] Language switching (EN, PT-BR, ES)
- [ ] Keyboard navigation
- [ ] Screen reader (VoiceOver/NVDA)
- [ ] Reduced motion fallback
- [ ] WCAG AA contrast ratios
- [ ] Lighthouse scores (Perf >90, A11y 100)
- [ ] Real device testing (iOS, Android)
- [ ] Bundle size impact

---

## Trade-Off Analysis

### GSAP vs. Pure CSS (HeroSection)

**Decision:** Use GSAP for typewriter effect

**Pros:**
- Precise character-by-character control
- Easy to sync cursor blink
- Color transitions per phrase
- Pause/resume capability

**Cons:**
- 30KB bundle size increase
- JavaScript dependency
- Slightly delayed start (lazy-load)

**Alternatives Considered:**
1. **Pure CSS:** Too complex for character-by-character typing + state management
2. **React state + setTimeout:** Possible, but reinventing GSAP poorly
3. **Framer Motion:** Similar bundle size, less precise timing control

**Conclusion:** GSAP is the right tool for this specific use case.

---

### Lazy-Load GSAP vs. Eager Load

**Decision:** Lazy-load GSAP after component mount

**Pros:**
- Faster initial paint (LCP improvement)
- Users with reduced motion never download GSAP
- Smaller initial bundle

**Cons:**
- Animation starts ~100-200ms after page load
- More complex code (dynamic import)

**Alternatives Considered:**
1. **Eager load:** Simpler code, but slower LCP
2. **Code-split by route:** Overkill for single-page landing

**Conclusion:** Lazy-load is worth the complexity for LCP gains.

---

### Two Breakpoints (sm, lg) vs. Three (sm, md, lg)

**Decision:** Use two breakpoints for most sections

**Pros:**
- Simpler Tailwind classes (less verbosity)
- Covers most use cases (mobile vs. desktop)
- Faster development

**Cons:**
- Less granular control for tablets (768px-1024px)
- May need `md:` for complex layouts

**Alternatives Considered:**
1. **Three breakpoints:** More control, but verbose
2. **One breakpoint:** Too coarse, poor mobile experience

**Conclusion:** Two breakpoints for Phase 1, add `md:` as needed in future phases.

---

### Theme-Aware Colors: Inline Styles vs. CSS Variables

**Decision:** Use inline styles for phrase colors (set dynamically in `useTypewriter`)

**Pros:**
- Simple to implement
- Easy to test (no CSS file changes)
- Color values centralized in one place

**Cons:**
- Inline styles (React sets `style` attribute)
- Not cacheable by CSS parser

**Alternatives Considered:**
1. **CSS variables:** Define `--phrase-1-color-light`, `--phrase-1-color-dark`, toggle via theme class
   - Pro: More "CSS-native"
   - Con: 8 new CSS variables (4 phrases × 2 themes), harder to maintain
2. **Tailwind classes:** Define custom colors in `tailwind.config.js`
   - Pro: Type-safe, autocomplete
   - Con: Can't dynamically select based on theme in GSAP animation

**Conclusion:** Inline styles are simpler and sufficient for this use case.

---

## Future Enhancements

### Phase 2 Preview

**HowItWorksSection:**
- 4 step cards with icons
- Fade-in animation on scroll (GSAP ScrollTrigger or Intersection Observer)
- Reuse animation patterns from ReadyToSection

**FeaturesSection:**
- Two-column layout (Workers | Businesses)
- Feature list items with checkmarks
- Staggered fade-in (CSS animation pattern)

**BenefitsSection:**
- 4 outcome cards with statistics
- Animate numbers counting up (GSAP or custom hook)
- Grid layout (responsive: 1 column → 2 columns → 4 columns)

### Phase 3 Preview

**PricingSection:**
- 3 pricing cards (Free, Starter, Pro)
- Complex scroll-triggered animation (GSAP ScrollTrigger)
  - Pin pricing section
  - Step through feature reveals per plan
  - Ticker animation for green checkmarks
- Most complex animation in the landing page

**CTASection:**
- Waitlist modal with form
- Feature multi-select checkboxes
- Email validation
- Success state animation

**Footer:**
- Simple static content (links, contact)
- No animations

### Performance Budget for Future Phases

**Current (Phase 1):**
- GSAP: ~30KB
- Total bundle: ~100-120KB (estimated)

**Budget:**
- Phase 2: +30-40KB (HowItWorks, Features, Benefits)
- Phase 3: +50-60KB (GSAP ScrollTrigger, pricing logic, modal)
- **Total target:** <200KB (gzipped)

**Contingency if exceeded:**
- Code-split PricingSection
- Lazy-load modal (only when CTA clicked)
- Tree-shake unused GSAP modules

---

## Appendix: Key Files Modified/Created

### New Files
- `src/pages/landing/components/HeroSection.tsx`
- `src/pages/landing/components/ReadyToSection.tsx`
- `src/pages/landing/hooks/useTypewriter.ts`
- `src/components/ui/button.tsx` (via shadcn CLI)

### Modified Files
- `src/pages/landing/LandingPage.tsx` (imports)
- `src/index.css` (animation timing, reduced motion)

### Configuration Files (No Changes)
- `tailwind.config.js` (already configured)
- `tsconfig.json` (strict mode already enabled)
- `vite.config.ts` (no changes needed)

---

**Status:** Ready for review and implementation
**Next Step:** Implementation following tasks.md sequence
