# Landing Page Generation Prompt (Shiftra)

Use this document as the source of truth to generate the public landing page for the product.

## Product Basics

- Product name: Shiftra
- Domain: shiftra.app
- One-line tagline (draft): No more WhatsApp groups. Book shifts. Track pay. Generate invoices in one click.

## Problem Statement (What Shiftra Fixes)

### For workers

- Finding shifts often happens in noisy WhatsApp groups with little trust or verification.
- Workers don’t know if the employer is reputable, if they’ve worked together before, or if the job has the right compliance requirements.
- Job requirements (e.g., White Card, RSA) are often unclear until the last minute.
- It’s easy to forget shift details, lose messages, or miss schedule changes.
- Workers want to understand expected earnings before and after a shift, and track what is paid vs overdue.

### For businesses / crew managers

- Staffing via WhatsApp creates endless spam, duplicate messages, and confusion.
- Managers spend time chasing details needed for invoices (address, ABN, business details).
- Calculating hours across shifts and totals takes time and is error-prone.
- Communication is fragmented across multiple groups and languages.

## Solution Overview (What Shiftra Does)

Shiftra is a shift + invoicing platform built for Australian workers and businesses:

- Post shifts with clear details and requirements (e.g., White Card, RSA)
- Let workers find and accept shifts (less chaos than group chats)
- Manage shifts in one place so nothing gets lost
- Track earnings and payment status (paid, overdue)
- Generate compliant invoices quickly (one-click generation)
- Keep the whole crew aligned with reminders, group chat, and built-in translation

## Target Audience

- Primary: Australian casual workers who work shifts (construction, hospitality, events, trades)
- Secondary: Employers, crew managers, small businesses that schedule crews and pay invoices

## Core Value Proposition

Shiftra replaces fragmented WhatsApp scheduling and manual invoicing with one platform that:

- Makes staffing more reliable (less noise, more clarity)
- Reduces admin time for managers
- Helps workers stay organized and get paid correctly

## Key Features to Highlight

### Worker features

- Find and accept shifts
- Shift calendar and reminders
- Earnings visibility (estimate and history)
- Payment tracking (paid vs overdue)
- One-click invoice generation and sharing

### Business features

- Post shifts and request specific workers
- Crew-wide shift reminders
- Crew group chat
- One-tap translation for multi-language crews
- Store invoice details once (ABN, address) to avoid repeated back-and-forth
- Accurate hours + totals across shifts

## Landing Page Goals

- Clearly communicate the “before vs after” story (WhatsApp chaos → Shiftra clarity)
- Drive sign-ups (primary CTA) and demos/waitlist (secondary CTA)
- Build trust (Australian compliance, professionalism, reliability)

## Voice & Tone

- Clear, modern, professional, and friendly
- Avoid slang; avoid overpromising (“guaranteed”, “always”)
- Use Australian English spelling where appropriate
- Write for scanning: short sections, strong headings, simple sentences

## Page Structure (Recommended Sections)

1. Top navigation

   - Logo (Shiftra)
   - Links: Features, How it works, For Workers, For Businesses, Pricing (optional)
   - Language selector: EN | PT-BR | ES (internationalization)
   - Theme toggle: Light/Dark mode button
   - CTA button: Get started

2. Hero section

   - Headline (animated): “No more {rotating phrase}”
   - Subheadline: Book shifts, track hours and pay, and generate invoices in one click.
   - Primary CTA: Create account / Get started
   - Secondary CTA: See how it works
   - Optional: “Made for Australia” trust line

   Animation requirements (type + delete loop):

   - Fixed prefix: “No more” (uses primary brand colour; never changes)
   - Rotating phrase: appears after “No more” and loops through the list below
   - Effect: the phrase types in with a blinking cursor, stays visible for 1.5s, then deletes, then the next phrase types
   - Timing: 1.5s after typing completes → start deleting; repeat per phrase
   - Colour per phrase:
     - Green: “WhatsApp group chaos” (typed with fake cursor)
     - White: “invoice forms” (typed with fake cursor)
     - Yellow: “miscommunication” (typed with fake cursor)
     - Red: “unknown employers” (typed with fake cursor)
   - Accessibility:
     - Respect “prefers-reduced-motion”: show a static headline (e.g., “No more WhatsApp group chaos”)
     - Ensure screen readers get a stable heading (avoid announcing every character as it types)

3. Animated prompt section (“Are you ready to…”)

   - Purpose: a fast, energetic “momentum” section that transitions from the hero into the rest of the page.
   - Fixed text: “Are you ready to” (never changes)
   - Animated text: the ending phrase swaps and animates from bottom → top (like the CSS example below)
   - Copy list (animated endings, include the question mark):
     - ditch WhatsApp shift chaos for good?
     - manage shifts without missed messages?
     - keep every shift detail in one place?
     - generate invoices in one click?
     - coordinate crews without endless group chats?
     - send shift reminders automatically?
     - keep your crew aligned across languages?
     - avoid unknown employers and unclear jobs?

   Implementation notes (CSS-driven, similar to provided example):

   - Markup suggestion:
     - Static span: “Are you ready to”
     - Animated container: `.dropping-texts` with one child `div` per phrase ending
   - Animation pattern:
     - Each child uses the same keyframes with staggered delays (`nth-child(n)` + delay)
     - Tune total duration to `phrases * delayStep` so each phrase gets a clean “enter → hold → exit” window
   - Accessibility:
     - Respect `prefers-reduced-motion`: render one static full sentence (e.g., the first phrase) and disable animation
     - Keep the semantic heading stable for screen readers (avoid announcing every swap)

4. Solution section (“How Shiftra works”)

   - Step 1: Post or find a shift
   - Step 2: Confirm details + requirements
   - Step 3: Track hours and pay status
   - Step 4: Generate and send invoices

   Visual placeholders (add real app images here):

   - Image slot A (overview): `[Screenshot: Shifts / Agenda view]`
     - Suggested file: `docs/assets/landing/agenda.png`
     - Alt text: “Agenda showing upcoming shifts and reminders”
   - Image slot B (workflow): `[Screenshot: Shift details + requirements]`
     - Suggested file: `docs/assets/landing/shift-details.png`
     - Alt text: “Shift details with requirements and acceptance flow”
   - Image slot C (finance): `[Screenshot: Invoice generation / preview]`
     - Suggested file: `docs/assets/landing/invoice.png`
     - Alt text: “Invoice preview with totals and one-click generation”

5. Features section (two columns: Workers vs Businesses)

   - Bullet lists from “Key Features to Highlight”

6. Benefits section (outcomes)

   - Less admin, fewer mistakes, clearer schedules, faster invoicing, better communication
   - Concrete outcomes:
     - "Save 5 hours/week on admin"
     - "Reduce invoicing time by 80%"
     - "Zero missed shifts with automatic reminders"
     - "Get paid faster with one-click invoicing"

7. Pricing section

   - Layout: 3 pricing cards (Free, $2, $27), responsive (stack on mobile, 3-up on desktop)
   - Card names:
     - Free: “Free”
     - $2: “Starter”
     - $27: “Pro”
   - “Find employees” wording (use this instead): “Worker discovery” (aka finding/hiring workers)
   - Billing model:
     - Starter: $2 / per hired worker
     - Pro: $27 / month

   Pricing cards (copy + CTAs):

   - Card 1 — Free ($0)
     - Short description: For individuals getting organised.
     - Badge: "No credit card required"
     - CTA: "Get started free"
     - Limits:
       - No Worker discovery (cannot browse/find workers)
   - Card 2 — Starter ($2 / per hired worker)
     - Short description: For small crews with occasional hiring.
     - CTA: “Choose Starter”
     - Includes:
       - Unlimited Worker discovery
   - Card 3 — Pro ($27 / month)
     - Short description: For businesses running shifts at scale.
     - CTA: “Go Pro”
     - Includes:
       - Unlimited Worker discovery
       - Crew chat
       - One-tap translation for multi-language crews

   Feature list structure (how to present the differences):

   - Base features (shown on all 3 cards with green tick):
     - Shift management (post/find/accept shifts)
     - Calendar + reminders
     - Hours tracking + totals
     - Payment status (paid vs overdue)
     - One-click invoice generation + sharing
   - Plan differences (only show where applicable):
     - Worker discovery:
       - Free: not included
       - Starter: included (unlimited)
       - Pro: included (unlimited)
     - Crew chat:
       - Free: not included
       - Starter: not included
       - Pro: included
     - Translation:
       - Free: not included
       - Starter: not included
       - Pro: included

   Scroll + ticker animation requirements:

   - When the pricing section enters the viewport, animate the green tick items (staggered “tick-in” + fade/slide)
   - Progressive reveal on scroll:
     - First moment: show the shared/base features (so users understand the baseline value)
     - As the user scrolls down through the pricing area, shift focus plan-by-plan and show only the “extra / upgraded” feature(s) for the focused plan:
       - Free → Starter: Worker discovery becomes available
       - Starter → Pro: Crew chat + Translation become available
   - Implementation suggestion: GSAP + ScrollTrigger (pin the pricing area briefly and step through the three plans)

8. Final CTA

   - Headline: Ready to run shifts without the chaos?
   - CTA: Get started
   - Modal/Dialog on CTA click:
     - Status message: "The app is still in development"
     - Prompt: "Which features are most important for you?" (allow multi-select)
     - Feature options (checkboxes):
       - Shift Management (post/find/accept shifts)
       - Earnings Tracking (view earnings and payment status)
       - Invoice Generation (one-click invoice creation)
       - Crew Communication (team chat and coordination)
       - Multi-language Support (automatic translation)
       - Worker Discovery (find and hire workers)
     - After feature selection, display text area:
       - Label: "Tell us more (optional)"
       - Placeholder: "Any additional feedback or requirements..."
     - Email input field:
       - Label: "Email address"
       - Placeholder: "your@email.com"
       - Required field
       - Validation: basic email format check
     - Submit button: "Notify me when ready"
     - Success message: "Thanks! We'll notify you at [email] when Shiftra is ready to use."
     - Accessibility:
       - Dialog has proper focus management (focus trap)
       - Screen readers announce modal title and content
       - Keyboard navigation (Tab, Escape to close, Enter to submit)

9. Footer
   - Domain, contact email (placeholder), privacy/terms links (placeholders)

## Copy Deck (Draft Text Snippets)

### Headline options

- Replace WhatsApp shift chaos with one platform.
- Book shifts, track pay, and invoice faster.
- Shifts and invoices—finally in one place.

### Subheadline options

- Shiftra helps workers and businesses manage shifts, hours, payments, and invoices without endless group chats.
- Post shifts, coordinate crews, and generate invoices in minutes—built for Australia.

### CTA labels

- Get started
- Create account
- Join Shiftra
- See how it works

## Visual / UI Notes (Optional Guidance)

- Use a clean, mobile-first layout
- Include 2–3 simple product screenshots or illustrated cards (placeholders acceptable)
- Use clear iconography for: calendar, invoice, chat, translation, payments
- Theme toggle button (light/dark mode) in top navigation
- Color contrast ratios: WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- Lazy-loading for images/animations to improve mobile performance

## Implementation Notes (Tech Stack)

Landing page implementation stack:

- Vite (React + TypeScript)
- Tailwind CSS (use semantic tokens like `bg-background`, `text-foreground`, `bg-primary`)
- shadcn/ui components (compose sections from reusable UI blocks)
- GSAP for animations (hero typing loop, "Are you ready to…" dropping texts)
- i18next + react-i18next (internationalization: en, pt-BR, es)
- Theme provider (light/dark mode support)

MCP tooling workflow (for building + QA):

- shadcn MCP: use `mcp__shadcn__search_items_in_registries`, `mcp__shadcn__view_items_in_registries`, and `mcp__shadcn__get_add_command_for_items` to pick and add components consistently.
- Playwright MCP: use `mcp__playwright__browser_navigate` + `mcp__playwright__browser_snapshot` to validate layout, responsiveness, and animation behaviour on `http://localhost:5173`.

## Performance Metrics

Target performance benchmarks (measure with Lighthouse):

- **Performance score**: >90 (desktop), >85 (mobile)
- **Accessibility score**: 100
- **Best Practices score**: 100
- **SEO score**: 100

Core Web Vitals thresholds:

- **LCP (Largest Contentful Paint)**: <2.5s (good), <4.0s (needs improvement)
- **FID (First Input Delay)**: <100ms (good), <300ms (needs improvement)
- **CLS (Cumulative Layout Shift)**: <0.1 (good), <0.25 (needs improvement)
- **INP (Interaction to Next Paint)**: <200ms (good), <500ms (needs improvement)

Image optimization strategy:

- Use WebP format with PNG/JPG fallbacks
- Implement responsive images with `srcset` and `sizes` attributes
- Lazy-load all images below the fold
- Compress images (target: <200KB per image)
- Use `loading="lazy"` and `decoding="async"` attributes

Animation performance:

- Lazy-load GSAP library (load only when needed)
- Use `will-change` CSS property sparingly
- Respect `prefers-reduced-motion` media query
- Target 60fps for all animations (use `requestAnimationFrame`)

## Technical Debt Prevention

### Responsive Breakpoints Specification

Use Tailwind CSS default breakpoints consistently:

- **sm**: 640px (small devices, landscape phones)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops, small desktops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large desktops)

Mobile-first approach: base styles for mobile, then `md:`, `lg:`, etc. for larger screens.

### Component Naming Conventions

Follow consistent naming patterns:

- **Page sections**: `{Section}Section.tsx` (e.g., `HeroSection.tsx`, `PricingSection.tsx`)
- **Reusable components**: `{ComponentName}.tsx` (e.g., `PricingCard.tsx`, `FeatureList.tsx`)
- **Utility components**: `{utility-name}.tsx` (e.g., `theme-provider.tsx`, `language-switcher.tsx`)
- **CSS modules** (if used): `{component-name}.module.css`

Component file structure within `src/pages/landing/`:

```
landing/
├── components/
│   ├── HeroSection.tsx
│   ├── PricingSection.tsx
│   ├── FeaturesSection.tsx
│   └── ...
├── hooks/
│   ├── useScrollAnimation.ts
│   └── useTypewriter.ts
├── LandingPage.tsx
└── types.ts
```

### Dependency Version Locking

Lock critical dependencies to prevent breaking changes:

- **GSAP**: Lock to specific minor version (e.g., `^3.12.0` → `3.12.5`)
- **React**: Lock to `^19.0.0` (already in project)
- **Tailwind CSS**: Lock to `^4.x.x` (already in project)
- **i18next**: Lock to specific minor version

Use `package-lock.json` and commit it to version control.

### Testing Requirements

Implement comprehensive testing strategy:

- **Visual regression testing**: Use Playwright snapshots to detect UI changes
- **Accessibility audits**: Run axe-core or Lighthouse accessibility checks in CI/CD
- **Responsive testing**: Test on mobile (375px), tablet (768px), desktop (1920px)
- **Cross-browser testing**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Performance budgets**: Fail CI if Lighthouse score drops below thresholds

### Code Quality Standards

- **ESLint**: Enforce project rules (already configured)
- **Prettier**: Auto-format on save (already configured)
- **TypeScript strict mode**: Enable `strict: true` (already enabled)
- **No console logs**: Remove or gate behind `NODE_ENV !== 'production'`
- **Accessibility linting**: Use `eslint-plugin-jsx-a11y` (verify configuration)

## Output Requirements (for the generator)

Generate:

- Landing page section outline (with headings)
- Final marketing copy for each section (ready to paste into UI)
- CTA text and microcopy
- SEO: meta title (≤ 60 chars), meta description (≤ 155 chars), and 5–10 keywords
- A short list of testimonial placeholders (if no real testimonials exist)
