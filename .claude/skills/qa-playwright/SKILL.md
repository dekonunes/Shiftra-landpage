---
name: qa-playwright
description: Run QA smoke tests for InvoiceManager using Playwright MCP against the local dev server (http://localhost:5173). Use when asked to validate UI flows, especially sign-up/login where a new user must be created to access authenticated pages.
---

# QA Playwright

## Overview

Use Playwright MCP tools to perform QA checks in InvoiceManager. Always start at http://localhost:5173 and create a new user through the sign-up flow before accessing authenticated pages.

## QA Smoke Workflow

1. Navigate to http://localhost:5173.
   - Use `mcp__playwright__browser_navigate` and wait for the page to render.
   - If the page does not load, ask the user to start the dev server.
   - **Check if already authenticated**: If the URL is `/agenda` and there is no alert about missing profile/company, skip steps 2-5 and go directly to step 6.

2. Switch to sign up.
   - Click the link labeled "Sign up" in the auth header copy to reveal the sign-up form.

3. Create a new user.
   - Fill "Full name", "Email", "Password", and "Confirm password".
   - Generate a unique email each run (example: `qa+<timestamp>@example.com`) to avoid collisions.
   - Use a stable password that meets minimum requirements (example: `Test1234!`).
   - Submit with the "Create account" button.

4. Confirm access.
   - Expect a redirect to `/agenda` or a visible Agenda landing view.
   - If a verification notice appears, record it and continue; access should still be granted in local dev.

5. Create new profile and company.
   - Navigate to the profile settings or onboarding flow.
   - Fill in all profile form fields with valid test data (name, contact info, etc.).
   - Create a company with all required information (company name, ABN, address, contact details).
   - Save and confirm the profile and company are created successfully.

6. Continue with any additional QA tasks now that the session is authenticated.
   - Prefer label- or role-based selectors to keep actions stable across UI changes.
   - Use `mcp__playwright__browser_snapshot` to capture element refs before interacting.
   - Use `mcp__playwright__browser_take_screenshot` for failures or visual evidence.
