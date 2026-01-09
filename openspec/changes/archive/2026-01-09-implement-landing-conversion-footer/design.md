# Design Document: Landing Page Conversion & Footer (Phase 3)

**Change ID:** `implement-landing-conversion-footer`
**Status:** DRAFT
**Last Updated:** 2026-01-09

---

## Architectural Overview

This document captures the architectural reasoning, design patterns, and trade-off decisions for implementing Phase 3 of the Shiftra landing page. Building on Phase 2's scroll animation foundations, Phase 3 introduces advanced GSAP ScrollTrigger pinning (PricingSection), modal dialog forms (CTASection), and type-safe footer architecture with responsive layouts.

---

## System Architecture

### Component Hierarchy

```
LandingPage (orchestrator)
├── Navigation (Phase 0)
├── main
│   ├── HeroSection (Phase 1)
│   ├── ReadyToSection (Phase 1)
│   ├── HowItWorksSection (Phase 2)
│   ├── FeaturesSection (Phase 2)
│   ├── BenefitsSection (Phase 2)
│   ├── PricingSection (NEW - Phase 3)
│   │   ├── PricingCard × 3 (Free, Starter, Pro)
│   │   └── usePricingScrollAnimation hook
│   └── CTASection (NEW - Phase 3)
│       └── WaitlistDialog
│           └── WaitlistForm (controlled inputs)
└── Footer (NEW - Phase 3, outside main)
    ├── FooterColumn × 4 (desktop)
    └── FooterAccordion (mobile)
        └── FooterLink × many (type-safe)
```

### Data Flow

```
1. Pricing Data Flow:
   FOOTER_CONFIG (static)
   ↓
   PricingSection component
   ↓
   usePricingScrollAnimation hook
   ↓
   GSAP ScrollTrigger (pinning + progressive reveals)
   ↓
   User scrolls → features reveal step-by-step

2. Waitlist Data Flow:
   User clicks CTA button
   ↓
   Dialog opens (focus trapped)
   ↓
   User fills form (controlled inputs)
   ↓
   Client-side validation (email format)
   ↓
   Form submission → console.log data
   ↓
   Success message → auto-close dialog

3. Footer Data Flow:
   FOOTER_CONFIG (static, type-safe)
   ↓
   Footer component
   ↓
   Responsive breakpoint (CSS-based)
   ├─ Desktop: FooterColumn × 4
   └─ Mobile: FooterAccordion
      ↓
      FooterLink (discriminated union rendering)
```

---

## Animation Architecture

### Four-Tiered Animation Strategy (Phase 1 + 2 + 3)

**Tier 1: Complex State Animations (GSAP Timeline)**
- Use case: Multi-step animations requiring precise state management
- Example: HeroSection typewriter (Phase 1)
- Pattern: Lazy-load GSAP, encapsulate in custom hook

**Tier 2: Simple Declarative Animations (CSS Keyframes)**
- Use case: Repeating animations with no state
- Example: ReadyToSection drop-in animation (Phase 1)
- Pattern: Define `@keyframes` in index.css, apply via class

**Tier 3: Scroll-Triggered Animations (GSAP ScrollTrigger)**
- Use case: Animations triggered by scroll position
- Example: HowItWorks/Features/Benefits card reveals (Phase 2)
- Pattern: useScrollAnimation hook wraps ScrollTrigger setup/cleanup

**Tier 4: Pinned Scroll Animations (GSAP ScrollTrigger + Pinning)** ← NEW in Phase 3
- Use case: Section stays fixed while animations progress via scroll
- Example: PricingSection progressive feature reveals
- Pattern: usePricingScrollAnimation hook with `pin: true`
- Performance: GPU-accelerated transforms, 60fps target, mobile fallback

---

## PricingSection Architecture

### GSAP ScrollTrigger Pinning Pattern

**Animation Timeline:**

```
Scroll Position 0px (Section enters viewport)
↓
[Phase 1: 0-1000px scroll]
Base features reveal (all 3 cards)
- Shift management ✓
- Calendar + reminders ✓
- Hours tracking ✓
- Payment status ✓
- Invoice generation ✓
↓
[Phase 2: 1000-2000px scroll]
Section PINS at top of viewport
Starter card highlights (scale 1.05, shadow)
Worker discovery reveals on Starter card ✓
↓
[Phase 3: 2000-3000px scroll]
Starter card resets
Pro card highlights (scale 1.05, shadow)
Crew chat + Translation reveal on Pro card ✓ ✓
↓
[Exit: 3000px+ scroll]
Section UNPINS, continues to next section
```

**usePricingScrollAnimation Hook:**

```typescript
interface UsePricingScrollAnimationOptions {
  sectionRef: RefObject<HTMLElement | null>;
  enabled: boolean; // Respect prefers-reduced-motion
}

export function usePricingScrollAnimation({
  sectionRef,
  enabled,
}: UsePricingScrollAnimationOptions): void {
  useEffect(() => {
    if (!enabled || !sectionRef.current) return;

    // Lazy-load GSAP + ScrollTrigger
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current!;
        const isMobile = window.matchMedia('(max-width: 1023px)').matches;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=3000',
            pin: !isMobile, // Only pin on desktop
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Phase 1: Base features reveal
        timeline.fromTo(
          '[data-feature-type="base"]',
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1 },
          0
        );

        // Phase 2: Starter highlight
        timeline.to('[data-pricing-card="starter"]', {
          scale: 1.05,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          duration: 0.3,
        }, 1);

        timeline.fromTo(
          '[data-feature-type="starter-exclusive"]',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 },
          1.2
        );

        // ... Phase 3: Pro highlight
      });

    return () => {
      ScrollTrigger?.getAll().forEach(st => st.kill());
      gsap?.killTweensOf('*');
    };
  }, [sectionRef, enabled]);
}
```

**Mobile Fallback Strategy:**

```typescript
const isMobile = window.matchMedia('(max-width: 1023px)').matches;

// Disable pinning on mobile
pin: !isMobile,
scrub: !isMobile ? 1 : false,

// Show all features immediately (no progressive reveal)
{isMobile ? (
  <div className="opacity-100">
    {/* All features visible */}
  </div>
) : (
  <div data-feature-type="starter-exclusive" className="opacity-0">
    {/* Animated features */}
  </div>
)}
```

---

## CTASection + WaitlistDialog Architecture

### Form State Management

**Controlled Components Pattern:**

```typescript
interface WaitlistFormData {
  selectedFeatures: string[];
  feedback: string;
  email: string;
}

interface ValidationErrors {
  email?: string;
  selectedFeatures?: string;
}

// Component state
const [formData, setFormData] = useState<WaitlistFormData>({
  selectedFeatures: [],
  feedback: '',
  email: '',
});

const [errors, setErrors] = useState<ValidationErrors>({});
const [isSubmitted, setIsSubmitted] = useState(false);
const [isOpen, setIsOpen] = useState(false);
```

**Why Controlled Inputs?**
- **Predictable state**: Single source of truth (React state)
- **Easy validation**: Access values without DOM queries
- **React 19 compatible**: No need for uncontrolled refs
- **Type-safe**: TypeScript enforces correct field types

### Validation Strategy

**Email Validation (RFC 5322 Simplified):**

```typescript
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email address is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return undefined;
};
```

**When to Validate:**
1. **On blur**: Email field validates when user leaves field (real-time feedback)
2. **On submit**: All fields validated before submission
3. **On type**: Clear error when user starts fixing (immediate feedback)

**No External Form Library:**
- **Rationale**: Simple form (3 fields), controlled inputs sufficient
- **Trade-off**: More manual validation code, but full control and zero bundle impact
- **Performance**: No React Hook Form overhead (~9KB gzipped)

### Dialog Accessibility

**Focus Management (Radix UI Handles):**
- Dialog opens → Focus trapped within dialog
- Tab cycles through: Checkboxes → Textarea → Email → Submit → Close
- Escape closes dialog
- Click outside closes dialog
- Focus returns to trigger button on close

**ARIA Attributes:**

```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen} aria-labelledby="waitlist-title" aria-describedby="waitlist-description">
  <DialogContent>
    <DialogTitle id="waitlist-title">
      {t('waitlist.title')}
    </DialogTitle>
    <DialogDescription id="waitlist-description">
      {t('waitlist.description')}
    </DialogDescription>

    <Input
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? 'email-error' : undefined}
      aria-required="true"
    />

    {errors.email && (
      <p id="email-error" role="alert">
        {errors.email}
      </p>
    )}
  </DialogContent>
</Dialog>
```

### Success State Flow

```
User submits form
↓
Validation passes
↓
console.log(formData) // No backend yet
↓
setIsSubmitted(true)
↓
Success message renders:
"Thanks! We'll notify you at user@example.com when Shiftra is ready to use."
↓
User clicks "Close" or presses Escape
↓
Dialog closes with animation (200ms)
↓
After animation completes:
- Reset form: setFormData({ selectedFeatures: [], feedback: '', email: '' })
- Reset errors: setErrors({})
- Reset submitted: setIsSubmitted(false)
↓
User can open dialog again with fresh form
```

---

## Footer Architecture

### Type-Safe Link System

**Discriminated Unions:**

```typescript
type LinkType = 'internal' | 'external' | 'email';

interface InternalLink {
  type: 'internal';
  labelKey: string;
  href: `#${string}`; // Template literal enforces # prefix
}

interface ExternalLink {
  type: 'external';
  labelKey: string;
  href: `https://${string}` | `http://${string}`; // Enforces protocol
  rel?: 'noopener noreferrer' | 'noopener noreferrer nofollow';
}

interface EmailLink {
  type: 'email';
  labelKey: string;
  href: `mailto:${string}`; // Enforces mailto: prefix
  displayEmail?: string;
}

type FooterLink = InternalLink | ExternalLink | EmailLink;
```

**Type Guards:**

```typescript
function isExternalLink(link: FooterLink): link is ExternalLink {
  return link.type === 'external';
}

// Rendering logic
{isExternalLink(link) ? (
  <a href={link.href} target="_blank" rel={link.rel || 'noopener noreferrer'}>
    {t(link.labelKey)}
    <ExternalLinkIcon className="size-3" aria-hidden="true" />
  </a>
) : isEmailLink(link) ? (
  <a href={link.href}>{link.displayEmail || t(link.labelKey)}</a>
) : (
  <a href={link.href}>{t(link.labelKey)}</a>
)}
```

**Benefits:**
- **Type safety**: Compiler enforces correct properties per link type
- **Security**: External links automatically get `target="_blank"` and `rel="noopener noreferrer"`
- **Maintainability**: Add new link types without breaking existing code
- **Clarity**: Explicit link type in configuration

### Responsive Layout Strategy

**CSS-Only Breakpoint Switching (No JavaScript):**

```typescript
// Desktop: Grid columns visible, accordions hidden
<div className="hidden md:grid md:grid-cols-4 gap-8">
  {sections.map(section => <FooterColumn key={section.id} section={section} />)}
</div>

// Mobile: Accordions visible, columns hidden
<div className="block md:hidden">
  <Accordion type="multiple" defaultValue={['product']}>
    {sections.map(section => (
      <AccordionItem key={section.id} value={section.id}>
        <AccordionTrigger>{t(section.titleKey)}</AccordionTrigger>
        <AccordionContent>
          {section.links.map(link => (
            <FooterLink key={link.href} link={link} />
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</div>
```

**Why CSS-Only?**
- **Performance**: No JavaScript media query listeners
- **SSR-friendly**: Works with server-side rendering (if needed later)
- **No FOUC**: No flash of unstyled content on load
- **Simplicity**: No state management for breakpoint switching

### Footer Placement

**Outside `<main>` Element:**

```typescript
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation /> {/* Outside main */}

      <main>
        <HeroSection />
        {/* ... other sections */}
        <CTASection />
      </main>

      <Footer /> {/* Outside main - site-wide footer */}
    </div>
  );
}
```

**Rationale:**
- **Semantic HTML**: `<footer>` is a landmark element, not main content
- **Accessibility**: Screen readers can skip to footer via landmark navigation
- **SEO**: Search engines understand footer as separate from main content
- **ARIA best practices**: Footer contains site-wide navigation, not page content

---

## Responsive Design Patterns

### PricingSection Breakpoints

| Breakpoint | Layout | Card Width | Features Display | Pinning |
|------------|--------|------------|------------------|---------|
| 0-767px (mobile) | 1 column, stacked | 100% | All visible (no animation) | Disabled |
| 768-1023px (tablet) | 2 columns | ~50% each | All visible (no animation) | Disabled |
| 1024px+ (desktop) | 3 columns | ~33% each | Progressive reveal | Enabled |

**Implementation:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
  {/* Pricing cards */}
</div>
```

### Footer Breakpoints

| Breakpoint | Layout | Sections | Interaction |
|------------|--------|----------|-------------|
| 0-767px (mobile) | Stacked accordions | Collapsible | Tap to expand |
| 768px+ (desktop) | 4-column grid | Always visible | Static |

**Implementation:**

```tsx
{/* Mobile */}
<div className="block md:hidden">
  <Accordion type="multiple">...</Accordion>
</div>

{/* Desktop */}
<div className="hidden md:grid md:grid-cols-4 gap-8">
  {sections.map(...)}
</div>
```

---

## Performance Optimization

### Bundle Size Budget Tracking

**Phase 2 Baseline:** ~154KB gzipped

**Phase 3 Additions:**
- GSAP ScrollTrigger (pinning): Already included (~0KB additional)
- shadcn/ui Dialog: ~2.5KB gzipped
- shadcn/ui Checkbox: ~0.5KB gzipped
- shadcn/ui Accordion: ~1.5KB gzipped
- Phase 3 components (Pricing, CTA, Footer): ~25KB uncompressed, ~6KB gzipped
- **Total Phase 3 addition:** ~10.5KB gzipped

**Total After Phase 3:** ~164.5KB gzipped (within 200KB budget)

**Budget Remaining:** ~35.5KB for Phase 4+ enhancements

### Lazy Loading Strategy

**Phase 3 Lazy Loading:**
1. **GSAP ScrollTrigger**: Already lazy-loaded in usePricingScrollAnimation
2. **Dialog**: Not lazy-loaded (small bundle, needed on CTA click)
3. **Accordion**: Not lazy-loaded (small bundle, part of Footer)

**Future Lazy Loading Opportunities:**
- PricingSection: Code-split as separate chunk (if bundle exceeds budget)
- WaitlistDialog: Lazy-load on CTA button click (save ~3KB initial load)

---

## Testing Strategy

### Animation Testing (PricingSection)

**Pinning Validation:**
- [ ] Section pins at top of viewport on scroll (desktop only)
- [ ] Base features reveal with stagger (0.1s delay per item)
- [ ] Starter card highlights correctly (scale 1.05, shadow increase)
- [ ] Worker discovery reveals on Starter card at correct scroll position
- [ ] Pro card highlights correctly after Starter
- [ ] Chat + Translation reveal on Pro card at correct scroll position
- [ ] Section unpins after scroll range completes
- [ ] Scrub value (1s) creates smooth animation (no jank)

**Mobile Fallback:**
- [ ] Pinning disabled on mobile (<1024px)
- [ ] All features visible immediately (no progressive reveal)
- [ ] No performance issues on low-end devices

**Reduced Motion:**
- [ ] Enable `prefers-reduced-motion` in system preferences
- [ ] Verify all ScrollTrigger animations disabled
- [ ] Verify pricing cards render in final state

### Form Testing (WaitlistDialog)

**Validation:**
- [ ] Empty email → "Email address is required"
- [ ] Invalid email (no @) → "Please enter a valid email address"
- [ ] Invalid email (no domain) → "Please enter a valid email address"
- [ ] Valid email → No error

**Submission Flow:**
- [ ] Fill form → Submit → console.log shows correct data
- [ ] Success message displays submitted email
- [ ] Close dialog → Form resets to empty
- [ ] Reopen dialog → Form is empty (fresh state)

**Keyboard Navigation:**
- [ ] Tab cycles through: Checkboxes → Textarea → Email → Submit
- [ ] Enter on Submit button submits form
- [ ] Escape closes dialog
- [ ] Focus returns to CTA button on close

**Accessibility:**
- [ ] Screen reader announces modal title and description
- [ ] Validation errors announced via `role="alert"`
- [ ] Focus trap works correctly (Tab cycles within dialog)

### Footer Testing

**Link Types:**
- [ ] Internal links scroll to correct section (#features, #pricing)
- [ ] External links open in new tab with `noopener noreferrer`
- [ ] Email links open default email client (mailto:)

**Responsive:**
- [ ] Desktop: 4-column grid visible, accordions hidden
- [ ] Mobile: Accordions visible, grid hidden
- [ ] First accordion section open by default on mobile
- [ ] Multiple sections can be open simultaneously

**i18n:**
- [ ] All footer text updates on language change (EN, PT-BR, ES)
- [ ] No layout shift when switching languages
- [ ] No text overflow in footer links

---

## Accessibility Compliance

### WCAG 2.1 AA Standards

**Perceivable:**
- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text
- [ ] Alternative text: External link icons have `aria-hidden="true"`
- [ ] Timing adjustable: Animations respect `prefers-reduced-motion`

**Operable:**
- [ ] Keyboard accessible: All interactive elements reachable via Tab
- [ ] Focus visible: Clear focus rings on all interactive elements
- [ ] No keyboard traps: Focus cycles correctly within modal
- [ ] Timing: Modal animations complete within 200ms (no excessive delays)

**Understandable:**
- [ ] Consistent navigation: Footer links use consistent patterns
- [ ] Input assistance: Form errors provide clear guidance
- [ ] Error identification: Validation errors displayed inline

**Robust:**
- [ ] Valid HTML: Semantic elements (`<footer>`, `<nav>`, `<section>`)
- [ ] ARIA: Proper labels, descriptions, live regions
- [ ] Compatibility: Works with screen readers (VoiceOver, NVDA)

---

## Trade-Off Analysis

### GSAP Pinning vs. Simple Scroll Reveals

**Decision:** Use GSAP ScrollTrigger with pinning for PricingSection.

**Pros:**
- **Memorable experience**: Pinned scroll creates premium, engaging feel
- **Storytelling**: Guides users through pricing tiers step-by-step
- **Differentiation**: Stands out from static pricing tables
- **Specification alignment**: LANDING_PAGE.md explicitly requires pinned scroll

**Cons:**
- **Complexity**: ~150 lines of code vs ~50 for simple fade-in
- **Mobile fallback**: Requires separate static layout for mobile
- **Performance risk**: Pinning can cause jank on low-end devices

**Mitigation:**
- Disable pinning on mobile (static layout)
- Test on real devices for performance
- Provide reduced-motion fallback

**Conclusion:** Pinned scroll is the right choice for premium experience and specification compliance.

---

### Client-Side Form Validation vs. External Library

**Decision:** Implement validation manually (no React Hook Form, Formik, etc.).

**Pros:**
- **Zero bundle impact**: No external library (~9KB saved)
- **Full control**: Customize validation logic exactly as needed
- **Simplicity**: Only 3 form fields, controlled inputs sufficient

**Cons:**
- **More code**: Manual validation for each field
- **Less tested**: Custom validation may have edge cases
- **Maintenance**: No automatic updates from library

**Mitigation:**
- Use RFC 5322 simplified regex (widely tested)
- Validate on backend (future)
- Test thoroughly with edge cases

**Conclusion:** Manual validation is the right choice for simple form with minimal bundle impact.

---

### shadcn/ui Dialog vs. Custom Modal

**Decision:** Use shadcn/ui Dialog component.

**Pros:**
- **Accessibility**: Built-in focus trap, keyboard handling, ARIA attributes
- **Consistency**: Matches project's component library (Card, Button)
- **Maintenance**: Actively maintained, regular updates
- **Bundle size**: Minimal (~2.5KB gzipped)

**Cons:**
- **External dependency**: Adds another dependency to project
- **Less control**: Limited customization of internal behavior

**Mitigation:**
- shadcn/ui is already used extensively (Card, Button)
- Radix UI primitives are battle-tested
- Customization via className props sufficient

**Conclusion:** shadcn/ui Dialog is the right choice for accessibility and consistency.

---

## Future Enhancements

### Phase 4: SEO & Analytics

**SEO Enhancements:**
- Meta tags (title, description, keywords)
- Open Graph tags (og:title, og:description, og:image)
- Twitter Cards (twitter:card, twitter:title, twitter:image)
- JSON-LD structured data (Organization, WebSite, BreadcrumbList)
- Sitemap.xml generation
- Robots.txt configuration

**Analytics Integration:**
- Google Analytics 4 or Plausible Analytics
- Event tracking (CTA clicks, pricing card clicks, footer link clicks)
- Scroll depth tracking (how far users scroll)
- Conversion funnel tracking (Hero → Pricing → CTA → Waitlist)

### Phase 5: Performance Optimization

**Code-Splitting:**
- PricingSection as separate chunk (load on demand)
- WaitlistDialog lazy-loaded on CTA click
- Further image optimization (WebP → AVIF for modern browsers)

**Caching:**
- Service worker for offline support
- Cache GSAP library for repeat visits
- Prefetch critical resources

### Phase 6: Advanced Features

**Pricing Calculator:**
- Input: Number of workers, shifts per month
- Output: Estimated monthly cost (Starter vs Pro)
- Interactive sliders, live calculation

**Testimonials Section:**
- Social proof from early users
- Photo + name + quote + role
- Carousel or grid layout

**FAQ Section:**
- Address common questions (What is worker discovery? How does billing work?)
- Accordion layout, searchable

---

## Appendix: Key Files Created

### New Files (Phase 3)

**UI Components (shadcn/ui):**
- `src/components/ui/dialog.tsx` (Dialog wrapper)
- `src/components/ui/checkbox.tsx` (Checkbox input)
- `src/components/ui/accordion.tsx` (Accordion container)

**Pricing Components:**
- `src/pages/landing/components/PricingSection.tsx` (Main pricing section)
- `src/pages/landing/components/PricingCard.tsx` (Reusable pricing card)
- `src/pages/landing/hooks/usePricingScrollAnimation.ts` (GSAP pinning hook)

**CTA Components:**
- `src/pages/landing/components/CTASection.tsx` (CTA section with button)
- `src/pages/landing/components/WaitlistDialog.tsx` (Modal dialog with form)

**Footer Components:**
- `src/pages/landing/components/Footer.tsx` (Main footer component)
- `src/pages/landing/components/footer/types.ts` (TypeScript interfaces)
- `src/pages/landing/components/footer/config.ts` (Footer configuration)
- `src/pages/landing/components/footer/FooterColumn.tsx` (Desktop column)
- `src/pages/landing/components/footer/FooterAccordion.tsx` (Mobile accordion)
- `src/pages/landing/components/footer/FooterLink.tsx` (Type-safe link)

### Modified Files (Phase 3)

- `src/pages/landing/LandingPage.tsx` (import Pricing, CTA, Footer)
- `src/i18n/en.json` (add pricing, waitlist, footer translations)
- `src/i18n/pt-BR.json` (add pricing, waitlist, footer translations)
- `src/i18n/es.json` (add pricing, waitlist, footer translations)

### Configuration Files (No Changes)

- `tailwind.config.js` (existing semantic tokens sufficient)
- `tsconfig.json` (strict mode already enabled)
- `vite.config.ts` (no changes needed)

---

**Status:** Ready for spec deltas and implementation
**Next Step:** Create spec deltas for pricing-section, cta-section, footer
