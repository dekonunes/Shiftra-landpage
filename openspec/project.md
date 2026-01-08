# OpenSpec Project Configuration

**Project:** Shiftra Landing Page
**Repository:** shiftra-landing-page
**Created:** 2026-01-08

---

## Project Overview

A modern, responsive landing page for Shiftra, a shift management and invoicing platform for Australian workers and businesses. Built with React 19, TypeScript, Vite, Tailwind CSS 4, and internationalization support (EN, PT-BR, ES).

**Product:** Shift management and invoicing platform
**Target Users:** Australian casual workers (primary), employers/crew managers (secondary)
**Core Value:** Replace fragmented WhatsApp scheduling and manual invoicing with one platform

---

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Language:** TypeScript 5.9.3 (strict mode)
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** shadcn/ui (via CLI)
- **Animations:** GSAP 3.14.2

### Internationalization
- **Library:** react-i18next 16.5.1 + i18next 25.7.4
- **Supported Languages:** English (en), Portuguese (pt-BR), Spanish (es)

### State Management
- **Theme:** React Context (`ThemeContext.tsx`)
- **i18n:** i18next global state

### Tooling
- **Linter:** ESLint 9.39.1
- **Package Manager:** npm
- **Version Control:** git

---

## Project Structure

```
shiftra-landing-page/
├── openspec/
│   ├── project.md (this file)
│   ├── changes/
│   │   └── implement-landing-hero-phase/ (Phase 1)
│   └── specs/ (future specs)
├── src/
│   ├── pages/landing/
│   │   ├── components/
│   │   │   └── Navigation.tsx (existing)
│   │   ├── hooks/
│   │   └── LandingPage.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── en.json
│   │   ├── pt-BR.json
│   │   └── es.json
│   ├── lib/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── LANDING_PAGE.md (source of truth for requirements)
├── CLAUDE.md (project instructions)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Development Workflow

### Commands
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (TypeScript check + Vite bundle)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Quality Standards
- **TypeScript:** Strict mode enabled, all files must type-check
- **ESLint:** Zero errors, zero warnings before commit
- **Accessibility:** WCAG 2.1 Level AA minimum, target Level AAA for motion
- **Performance:** Lighthouse >90 (desktop), >85 (mobile)

---

## Change Management Process

### Phases
Landing page implementation is broken into phases to enable iterative feedback:

1. **Phase 1:** HeroSection + ReadyToSection (current)
2. **Phase 2:** HowItWorksSection + FeaturesSection + BenefitsSection
3. **Phase 3:** PricingSection + CTASection + Footer
4. **Phase 4:** SEO, performance optimization, final polish

### Change ID Convention
Use verb-led, hyphenated format: `implement-landing-{phase-name}`

Example: `implement-landing-hero-phase`

---

## Key Design Patterns

### Responsive Design
- **Mobile-first:** Base styles for mobile, progressive enhancement with `sm:`, `lg:` modifiers
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Container:** `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`

### Theme System
- **Semantic tokens:** `bg-background`, `text-foreground`, `text-primary`, etc.
- **CSS variables:** Defined in `index.css` under `:root` and `.dark`
- **Toggle:** `useTheme()` context hook

### Internationalization
- **Translation keys:** `{section}.{element}` (e.g., `hero.prefixText`)
- **Hook:** `useTranslation()` from `react-i18next`
- **Language switch:** Immediate re-render, no component remount

### Animations
- **Complex (GSAP):** Multi-step animations with precise timing
- **Simple (CSS):** Declarative keyframe animations
- **Accessibility:** Always respect `prefers-reduced-motion`

---

## Performance Targets

### Lighthouse Scores
- **Performance:** >90 (desktop), >85 (mobile)
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

### Core Web Vitals
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1
- **INP (Interaction to Next Paint):** <200ms

### Bundle Size
- **Target:** <200KB (gzipped) for entire landing page
- **Phase 1:** ~100-120KB (GSAP + base components)
- **Final:** <200KB (includes all sections, GSAP ScrollTrigger, modal)

---

## Accessibility Standards

### WCAG 2.1 Level AA (Minimum)
- **Contrast:** 4.5:1 (normal text), 3:1 (large text)
- **Keyboard:** All interactive elements Tab-navigable
- **Semantic HTML:** Correct element usage (`<h1>`, `<button>`, etc.)
- **Screen readers:** Stable headings, descriptive labels

### WCAG 2.1 Level AAA (Motion)
- **Guideline 2.3.3:** Animation from interactions optional
- **Implementation:** Detect `prefers-reduced-motion`, render static fallback

---

## Testing Strategy

### Manual Testing
- **Responsive:** 375px, 768px, 1024px, 1920px
- **Themes:** Light and dark mode
- **Languages:** EN, PT-BR, ES
- **Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Devices:** iOS, Android (real devices)

### Automated Testing
- **Lighthouse:** CI check on every PR
- **Bundle size:** Fail if >200KB (gzipped)
- **TypeScript:** `tsc -b` in build step
- **ESLint:** `npm run lint` before commit

### Accessibility Testing
- **Automated:** Lighthouse, axe-core
- **Manual:** Screen readers (VoiceOver, NVDA), keyboard navigation
- **Tools:** WAVE, Chrome DevTools

---

## Documentation

### Source of Truth
- **LANDING_PAGE.md:** Product requirements, copy, design spec
- **CLAUDE.md:** Developer instructions, architecture notes
- **openspec/changes/{id}/:** Change proposals, specs, tasks

### Code Documentation
- **Component headers:** Describe purpose, props, usage
- **Complex logic:** Inline comments explaining "why", not "what"
- **Hooks:** Document inputs, outputs, side effects

---

## Dependencies

### Core Dependencies
- react: ^19.2.0
- react-dom: ^19.2.0
- react-i18next: ^16.5.1
- i18next: ^25.7.4
- gsap: ^3.14.2
- tailwindcss: ^4.1.18

### Dev Dependencies
- vite: ^7.2.4
- typescript: ~5.9.3
- eslint: ^9.39.1
- shadcn: ^3.6.3 (CLI tool)

### Adding New Dependencies
1. Justify: Why is this needed? Can we use existing tools?
2. Evaluate: Bundle size impact, maintenance burden, community support
3. Approve: Document in change proposal
4. Install: `npm install {package}`
5. Lock: Commit `package-lock.json`

---

## Contact & Support

**Project Maintainer:** Shiftra Team
**Repository Issues:** (GitHub issues URL here)
**Documentation:** See LANDING_PAGE.md, CLAUDE.md

---

**Last Updated:** 2026-01-08
**OpenSpec Version:** 1.0
