---
name: qa
description: Run full QA workflow - start dev server, log in via Chrome, test feature in browser, run unit tests
disable-model-invocation: true
argument-hint: "[feature description or area to test]"
---

# QA Workflow: $ARGUMENTS

Run a full QA pass on the running application using Chrome MCP for browser testing.

## Prerequisites

- Chrome MCP must be connected (run `/chrome` if not already enabled)
- Dev server must be running on localhost:3000 (start with `yarn dev` if needed)
- Test credentials must exist in `.env.test` (CLERK_TEST_EMAIL and CLERK_TEST_PASSWORD)

## Step 1: Environment Setup

1. Check if the dev server is already running on port 3000. If not, start it with `yarn dev` in the background.
2. Read test credentials from `.env.test` in the project root.
3. Wait for the server to be ready before proceeding.

## Step 2: Authentication

1. Navigate to http://localhost:3000 in Chrome.
2. Take a screenshot to confirm the page loaded.
3. Click "Sign In" and authenticate using the test credentials from `.env.test`.
4. Wait for the redirect after login and take a screenshot to confirm you are authenticated.

## Step 3: Feature Testing — $ARGUMENTS

Test the feature or area described above. For each test:

1. Navigate to the relevant page.
2. Interact with UI elements (click buttons, fill forms, trigger actions).
3. Take screenshots at key points to document what you see.
4. Check the browser console for JavaScript errors or warnings.
5. Check network requests for failed API calls (especially `/api/tts/*` endpoints).

### Standard checks to always perform:

- Page loads without errors
- Interactive elements respond to clicks
- Forms validate input correctly
- Data displays as expected
- No console errors or warnings
- Responsive layout works at mobile viewport (375x667)

## Step 4: Run Automated Tests

Run the full quality gate checks:

```bash
yarn ci-checks
```

This runs lint, type-check, and tests (with 80% coverage threshold). All must pass.

## Step 5: Report

Provide a summary:

- **Browser QA**: Pass/Fail — list any issues found with screenshots
- **Console errors**: List any JS errors or warnings seen
- **Network issues**: List any failed API calls
- **CI checks**: Pass/Fail for lint, type-check, and tests
- **Overall**: Ready for PR or needs fixes
