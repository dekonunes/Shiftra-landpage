---
name: design-system
description: Shiftra landing page design system with Tailwind CSS 4 tokens, shadcn/ui components, GSAP motion, i18n (en, pt-BR, es), and light/dark theme support.
---

# Design System

**Description**: Shiftra landing page design system with Tailwind CSS 4 tokens, shadcn/ui components, GSAP motion, i18n support (en, pt-BR, es), and light/dark theme support.

**When to use this skill**:

- Need design system reference for the Shiftra landing page
- Building or adjusting sections in `src/pages/landing/`
- Styling with Tailwind CSS semantic tokens
- Using shadcn/ui components from `src/components/ui/`
- Working on i18n strings or theme toggles
- Adding GSAP or scroll-triggered motion

---

## Tailwind CSS Design Tokens

### Color System

**Semantic Colors** (use these for all components, defined in `src/index.css`):

```typescript
// Backgrounds
"bg-background"; // Page background
"bg-card"; // Card surfaces
"bg-muted"; // Subtle section blocks
"bg-primary"; // Brand actions
"bg-secondary"; // Secondary surfaces
"bg-accent"; // Accents
"bg-destructive"; // Error/danger

// Text
"text-foreground"; // Primary text
"text-muted-foreground"; // Secondary text
"text-primary-foreground"; // Text on primary
"text-card-foreground"; // Text on cards
"text-destructive"; // Error text

// Borders + rings
"border-border"; // Default border
"border-input"; // Input border
"ring-ring"; // Focus ring
```

**Theme Support**:

```typescript
// Use semantic tokens; dark mode is handled by CSS variables
className = "bg-background text-foreground";
className = "border-border";
```

### Spacing and Layout

**Section Containers**:

```typescript
// Standard section wrapper
"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Section padding
"py-16 sm:py-20 lg:py-24";
```

**Grid/Gaps**:

```typescript
"grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";
"flex flex-col gap-4 sm:gap-6";
```

### Typography

**Font Family**:

```typescript
// Default font is Inter Variable
className = "font-sans";
```

**Heading Scale**:

```typescript
"text-3xl sm:text-4xl lg:text-5xl font-bold"; // Section titles
"text-4xl sm:text-5xl lg:text-6xl font-bold"; // Hero title
"text-lg sm:text-xl text-muted-foreground"; // Section subtitles
```

### Border Radius

```typescript
"rounded-lg"; // Default cards, buttons
"rounded-xl"; // Highlight cards
"rounded-2xl"; // Modals
"rounded-full"; // Pills and badges
```

### Interactive States

```typescript
// Standard focus ring
"focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Hover and active
"hover:bg-muted";
"hover:text-foreground";
"active:translate-y-px";
```

### Transitions

```typescript
"transition-all duration-200";
"transition-colors duration-200";
"transition-transform duration-200";
```

---

## shadcn/ui Components

### Installed Components (`src/components/ui/`)

```typescript
// Core UI
<Button />
<Card />
<Badge />
<Separator />

// Forms
<Input />
<Textarea />
<Select />
<Checkbox />
<Label />
<Field />
<InputGroup />

// Disclosure / overlays
<Dialog />
<AlertDialog />
<Accordion />
<DropdownMenu />
<Combobox />
```

### Button Patterns

```typescript
import { Button } from '@/components/ui/button';

<Button variant="default">Get started</Button>
<Button variant="outline">See how it works</Button>
<Button variant="secondary" size="icon-sm" aria-label="Toggle">
  <Sun className="size-4" />
</Button>
```

**Available sizes**: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.

### Card Patterns

```typescript
import { Card, CardHeader, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <h3 className="text-xl font-bold">Pro</h3>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">For crews at scale.</p>
  </CardContent>
</Card>;
```

### Dialog Pattern (Waitlist)

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>{t("waitlist.title")}</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>;
```

---

## Landing Page Patterns

### Section Wrapper

```typescript
<section id="features" className="px-4 py-20 bg-background">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
      {title}
    </h2>
  </div>
</section>
```

### Hero Typewriter

Use the `useTypewriter` hook and respect `prefers-reduced-motion`.

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
useTypewriter({
  ref: animatedTextRef,
  phrases,
  theme,
  enabled: !prefersReducedMotion,
});
```

### Ready-To Dropping Texts

Use the `.dropping-texts` keyframes defined in `src/index.css` with `prefers-reduced-motion` fallback.

```html
<div className="dropping-texts">
  <div>ditch WhatsApp shift chaos for good?</div>
  <div>manage shifts without missed messages?</div>
</div>
```

### Pricing Scroll Animation Hooks

The pricing scroll animation relies on data attributes:

```typescript
// Card wrapper
<Card data-pricing-card="starter" />

// Feature rows
<li data-feature-type="base" />
<li data-feature-type="starter-exclusive" />
<li data-feature-type="pro-exclusive" />
```

### Waitlist Form

Use `Dialog`, `Checkbox`, `Input`, `Textarea`, and `Label` with inline validation. Track events with `trackEvent('waitlist_open')` and `trackEvent('waitlist_submit')`.

### Images

Use `OptimizedImage` (and `ZoomableImage` for interactive screenshots) so WebP and PNG fallbacks are handled consistently.

```typescript
<OptimizedImage
  src="/assets/landing/agenda"
  alt="Agenda showing upcoming shifts"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Motion and Performance

- Use dynamic imports for GSAP to keep initial bundle small.
- Respect `prefers-reduced-motion` in every animation hook.
- Prefer `useScrollAnimation`, `usePricingScrollAnimation`, and `useCountUpAnimation` hooks in `src/pages/landing/hooks/`.

---

## Internationalization (i18n)

- All UI strings live in `src/i18n/en.json`, `src/i18n/pt-BR.json`, and `src/i18n/es.json`.
- Always update all locales when copy changes.
- Use `useTranslation()` and keys like `t('hero.subheadline')`.

```typescript
const { t } = useTranslation();
<h2>{t("features.title")}</h2>;
```

---

## Analytics Events

Use `trackEvent` from `src/lib/analytics.ts` for:

- `cta_click`
- `waitlist_open`
- `waitlist_submit`
- `section_view`
- `scroll_depth`
- `pricing_select`
- `footer_link_click`

---

## Accessibility Patterns

- Use semantic elements (`nav`, `section`, `header`, `button`, `form`).
- Provide `aria-label` for icon-only buttons and theme toggle.
- Keep animated headings screen-reader stable (avoid per-character announcements).
- Focus rings should use the standard `ring-ring` styles.

---

## Icon Usage

**Use `lucide-react` only**.

```typescript
import { Sun, Moon, Check, X } from "lucide-react";

<Sun className="size-5" aria-hidden="true" />;
```

---

## Quick Reference

```typescript
// Container
"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Section spacing
"py-16 sm:py-20 lg:py-24";

// Card
"rounded-xl border border-border bg-card text-card-foreground";

// Button (primary)
"bg-primary text-primary-foreground hover:bg-primary/80";

// Input
"rounded-lg border border-input bg-background px-3 py-2";
```

---

This skill provides a design-system snapshot tailored to the Shiftra landing page. Use it whenever you need consistent styling, motion, or component patterns.
