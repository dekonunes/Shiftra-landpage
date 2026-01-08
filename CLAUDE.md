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

## What's Next?

Remaining landing page sections to implement (based on LANDING_PAGE.md structure):
- Complete section components: ReadyToSection, HowItWorksSection, FeaturesSection, BenefitsSection, PricingSection, CTASection, Footer
- Add custom hooks: useScrollAnimation, useTypewriter
- Add placeholder images to `public/assets/landing/`
- Setup SEO meta tags, Open Graph, favicon
- Implement pricing table with scroll-triggered animations (GSAP + ScrollTrigger)
- Test accessibility with axe-core or Lighthouse
- Performance optimization: image compression, lazy loading, code splitting
