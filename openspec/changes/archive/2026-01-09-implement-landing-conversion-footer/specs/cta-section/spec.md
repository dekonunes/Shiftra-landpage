# cta-section Specification (Phase 3)

## ADDED Requirements

### Requirement: CTASection component with waitlist modal

The CTASection component SHALL render a final call-to-action section with a heading, CTA button, and scroll animation. When the CTA button is clicked, a modal dialog (WaitlistDialog) MUST open with proper focus management, allowing users to join the waitlist by selecting features, providing feedback, and entering their email address.

**Context:**

- Component location: `src/pages/landing/components/CTASection.tsx`
- Modal component: `WaitlistDialog.tsx` (custom, using shadcn/ui Dialog)
- Scroll animation: `useScrollAnimation` hook from Phase 2
- CTA content sourced from i18n JSON: `cta.title`, `cta.button`

**Acceptance Criteria:**

- Section renders with centered heading and CTA button
- Section uses fade-in scroll animation (opacity 0 → 1, y: 30 → 0)
- CTA button opens WaitlistDialog on click
- Dialog uses shadcn/ui Dialog component (focus trap, keyboard nav)
- Animation respects `prefers-reduced-motion` (no animation)
- Section background uses `bg-muted/30` (alternating pattern from Phase 2)

#### Scenario: User clicks CTA button to open waitlist modal

**Given** the user scrolls to the CTASection
**When** the section enters the viewport
**Then** the section fades in with upward motion (y: 30 → 0)
**And** the heading "Ready to run shifts without the chaos?" displays
**And** the CTA button "Get started" displays
**When** the user clicks the CTA button
**Then** the WaitlistDialog opens
**And** focus moves to the first interactive element (first checkbox)
**And** the dialog content is announced by screen readers ("Join the Waitlist, dialog")

#### Scenario: User with reduced motion views CTA section

**Given** the user has enabled "reduce motion" in system preferences
**When** the CTASection enters the viewport
**Then** the section displays immediately (no fade-in animation)
**And** the CTA button is clickable
**And** clicking the button opens the WaitlistDialog normally

---

### Requirement: WaitlistDialog form with validation

The WaitlistDialog component SHALL display a modal dialog with a multi-select feature form, optional feedback textarea, and required email input. The form MUST validate the email field on blur and submit, display inline errors, and log form data to console on successful submission (no backend integration yet).

**Context:**

- Dialog location: `src/pages/landing/components/WaitlistDialog.tsx`
- Form fields:
  1. Feature multi-select (6 checkboxes): Shift Management, Earnings Tracking, Invoice Generation, Crew Communication, Multi-language Support, Worker Discovery
  2. Feedback textarea (optional)
  3. Email input (required, validated)
- Validation: Client-side only, RFC 5322 simplified regex for email
- Submit action: `console.log(formData)` (no API call)

**Acceptance Criteria:**

- Dialog displays title "Join the Waitlist" and description "The app is still in development"
- 6 feature checkboxes rendered in responsive grid (1 col mobile, 2 col desktop)
- Feedback textarea is optional (no validation required)
- Email input is required with `aria-required="true"`
- Email validation on blur: Empty → "Email address is required", Invalid → "Please enter a valid email address"
- Submit button triggers validation before logging data
- Validation errors display below email input with `role="alert"`
- Form uses controlled inputs (React state, no external form library)

#### Scenario: User fills and submits waitlist form successfully

**Given** the WaitlistDialog is open
**When** the user selects 2 features (Shift Management, Invoice Generation)
**And** the user enters feedback "Looks great!"
**And** the user enters valid email "test@example.com"
**And** the user clicks "Notify me when ready" button
**Then** the form validates successfully (no errors)
**And** the console logs the form data:
```json
{
  "email": "test@example.com",
  "features": ["shift-management", "invoice-generation"],
  "feedback": "Looks great!",
  "timestamp": "2026-01-09T..."
}
```
**And** the success message displays: "Thanks! We'll notify you at test@example.com when Shiftra is ready to use."

#### Scenario: User submits form with invalid email

**Given** the WaitlistDialog is open
**When** the user enters invalid email "invalid-email"
**And** the user clicks "Notify me when ready" button
**Then** the email field is marked invalid (`aria-invalid="true"`)
**And** the error message displays below the email input: "Please enter a valid email address"
**And** the error message has `role="alert"` for screen reader announcement
**And** the form does NOT submit
**And** no console.log occurs

---

### Requirement: WaitlistDialog accessibility features

The WaitlistDialog component SHALL trap focus within the dialog, support keyboard navigation (Tab, Escape, Enter), announce content to screen readers, and restore focus to the trigger button when closed. All form fields MUST be keyboard accessible with clear focus indicators.

**Context:**

- shadcn/ui Dialog provides built-in focus trap via Radix UI
- Keyboard shortcuts: Tab (next field), Shift+Tab (previous field), Escape (close dialog), Enter (submit when on button)
- ARIA attributes: `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-required`, `role="alert"`

**Acceptance Criteria:**

- Dialog opens with focus on first interactive element (first checkbox or email input)
- Tab cycles through: Checkboxes → Textarea → Email → Submit button → Close button (X) → back to first checkbox
- Escape key closes dialog and restores focus to CTA button
- Enter key on Submit button submits form
- Space key toggles checkboxes when focused
- Click outside dialog closes it (Radix default behavior)
- Screen reader announces dialog title, description, and form labels correctly
- Validation errors announced via `role="alert"`

#### Scenario: User navigates waitlist form with keyboard only

**Given** the WaitlistDialog is open
**And** the user is using keyboard navigation only
**When** the user presses Tab repeatedly
**Then** focus cycles through all interactive elements in order:
1. First feature checkbox (Shift Management)
2. Second feature checkbox (Earnings Tracking)
3. ... (all 6 checkboxes)
4. Feedback textarea
5. Email input
6. Submit button
7. Close button (X)
8. Back to first checkbox (cycle repeats)
**When** the user presses Space on a checkbox
**Then** the checkbox toggles checked/unchecked
**When** the user presses Escape
**Then** the dialog closes
**And** focus returns to the CTA button ("Get started")

#### Scenario: Screen reader user interacts with waitlist form

**Given** a screen reader user opens the WaitlistDialog
**When** the dialog opens
**Then** the screen reader announces "Join the Waitlist, dialog"
**And** the description is announced: "The app is still in development"
**When** the user tabs to a feature checkbox
**Then** the screen reader announces the checkbox label (e.g., "Shift Management, checkbox, not checked")
**When** the user tabs to the email input
**Then** the screen reader announces "Email address, required, edit text"
**When** the user enters invalid email and tabs away
**Then** the error message is announced: "Please enter a valid email address"

---

### Requirement: WaitlistDialog success state and form reset

The WaitlistDialog component SHALL display a success message with the submitted email after successful form submission, provide a close button, and reset the form to empty state when the dialog closes. The success state MUST prevent re-submission and provide visual confirmation to the user.

**Context:**

- Success state managed by `isSubmitted` React state
- Success message: "Thanks! We'll notify you at {email} when Shiftra is ready to use."
- Form reset: Clears all fields (selectedFeatures, feedback, email) when dialog closes after success
- Success icon: Lucide `Check` icon in `bg-primary/10` circle

**Acceptance Criteria:**

- On successful submission, `isSubmitted` state becomes true
- Success message renders with submitted email displayed
- Success icon (Check) displays in circular primary-colored background
- Close button displays below success message
- Clicking close or pressing Escape closes dialog
- After 300ms delay (animation time), form resets to empty state
- Reopening dialog shows fresh empty form (no previous data)
- Success state prevents re-submission (Submit button hidden)

#### Scenario: User submits form and views success message

**Given** the user has filled the waitlist form with valid data
**And** the email is "user@example.com"
**When** the user clicks "Notify me when ready"
**Then** the form content disappears
**And** the success message displays: "Thanks! We'll notify you at user@example.com when Shiftra is ready to use."
**And** the success icon (Check) displays in a circular primary background
**And** the "Close" button displays
**When** the user clicks "Close"
**Then** the dialog closes with animation (200ms fade-out)
**And** after 300ms delay, the form state resets:
- selectedFeatures = []
- feedback = ""
- email = ""
- isSubmitted = false
**When** the user reopens the dialog
**Then** the form is empty (fresh state)

---

### Requirement: WaitlistDialog internationalization support

The WaitlistDialog component SHALL source all dialog content (title, description, form labels, feature options, validation errors, success message) from i18n translation files and update dynamically when the user changes language. Validation error messages MUST display in the selected language without layout shift.

**Context:**

- Translation keys: `waitlist.title`, `waitlist.description`, `waitlist.features.*`, `waitlist.email.*`, `waitlist.success.*`
- Languages: EN, PT-BR, ES
- Dynamic email in success message: `t('waitlist.success.message', { email: formData.email })`

**Acceptance Criteria:**

- All dialog content sourced from i18n JSON (no hardcoded strings)
- Dialog content updates immediately when language changes (no page reload)
- No layout shift when switching languages
- Validation error messages display in selected language
- Success message displays submitted email with translated text
- Feature option labels translate correctly (longest text tested for overflow)

#### Scenario: User switches to Spanish while dialog is open

**Given** the WaitlistDialog is open in English
**When** the user clicks the "ES" language button
**Then** the dialog title updates to "Únete a la lista de espera"
**And** the description updates to "La aplicación aún está en desarrollo"
**And** all feature option labels update to Spanish
**And** the feedback placeholder updates to Spanish
**And** the email label updates to "Dirección de correo electrónico"
**And** the submit button updates to "Notificarme cuando esté listo"
**And** no layout shift occurs (dialog maintains same dimensions)
