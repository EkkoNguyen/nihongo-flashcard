# Test Strategy

## Purpose and rules

Use this strategy as the verification gate for every implementation phase. Before coding a phase, map each acceptance criterion to evidence: automated test, static check, or explicit manual check. After implementation, run the applicable checks and record results and any unavailable dependencies in the phase report. A phase is not complete while a required check is failing or unrun; mark external checks as pending when their service or credentials are not configured.

Choose the smallest test layer that gives reliable evidence. Keep most logic tests fast, add integration tests at API and data boundaries, and reserve browser E2E tests for critical user journeys. Cover error handling, authorization, state integrity, and meaningful edge cases; do not chase a numeric coverage target without a risk-based reason.

## Verification matrix by phase

| Phase                   | Required automated coverage                                                                                                                                                             | Browser or operational validation                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0. Foundation           | Frozen dependency install, typecheck, lint, unit/API tests, production build, formatting, and API health smoke check. Database setup/seed checks require a configured isolated MongoDB. | Verify documented local startup and web/API availability. CI and staging health remain pending until configured and run.                                                             |
| 1. Accounts             | Auth logic and API integration for signup, login/logout, expiry/revocation, reset, validation, and authorization. Prove user A cannot read or mutate user B's private data.             | Playwright: signup/login, authenticated session, logout, and a denied cross-user journey.                                                                                            |
| 2. Decks, cards, import | Domain validation, API/database integration for ownership and CRUD, CSV parsing/mapping, malformed rows, and upload authorization/limits.                                               | Playwright: create/edit/delete a deck and card; import a valid file and inspect row errors. Check desktop and mobile layouts.                                                        |
| 3. Study and FSRS       | Table-driven scheduler transitions, due-time boundaries, duplicate grading/idempotency, queue scoping to selected deck/mode, and API persistence.                                       | Playwright: select a deck and mode, answer/reveal/grade a card, and verify session progress and exit/resume behavior.                                                                |
| 4. Goals and reminders  | Queue cap/allocation, deck priority, timezone/DST boundaries, scheduling idempotency, and reminder retry behavior. Stub email/calendar boundaries; never send real messages in tests.   | Playwright: set a goal/reminder and inspect the daily queue. Validate scheduled delivery using a test adapter or sandbox.                                                            |
| 5. Sharing              | Visibility/privacy, publish/unpublish authorization, download-copy independence, source edits, and review-state separation.                                                             | Playwright: discover, preview, download, and study a shared copy; verify private decks stay undiscoverable.                                                                          |
| 6. Release              | Full regression suite, production build, dependency/config checks, and smoke tests.                                                                                                     | Staging Playwright critical journeys, keyboard/accessibility and responsive review, plus documented backup/restore and rollback drills. Never point destructive tests at production. |

## Test design and data safety

- Put unit tests beside the module using `*.test.ts` or `*.test.tsx`; use Vitest for unit and API tests already in the workspace.
- Add Playwright only when browser journeys exist. Its runner, scripts, and CI job are not configured yet; document exact commands after they are added and verified.
- Use isolated test databases and uniquely identified fixtures. Clean up test-owned data; tests must not depend on run order or shared personal data.
- Prefer accessible roles and labels in browser tests. Assert user-visible outcomes and authorization boundaries, not private implementation details. Capture traces/screenshots on CI failures when Playwright is configured.
- Stub external email, calendar, object storage, and other paid/side-effecting services unless an explicitly isolated sandbox is under test.
- For each criterion, include normal behavior, at least one relevant invalid/error case, and a security or data-integrity case where applicable. Use manual checks for visual quality and operational procedures that automation cannot reliably establish.

## Current baseline

Configured root checks: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm format:check`. The API smoke endpoint is `GET /health`. MongoDB-backed checks need a configured test database. Playwright E2E and hosted CI/staging checks are planned, not yet configured or verified.

Last local Phase 0 verification: 2026-11-23. Frozen install, typecheck, lint, Vitest (8 tests across shared/API/web), production build, formatting, Compose configuration validation, API health (`200`), and web response (`200`) passed. Tests cover environment validation, CORS allowlisting, and generic server errors. MongoDB setup and verification passed against local MongoDB: all six collections and validators were confirmed, invalid documents were rejected, setup was idempotent, and seeding twice produced one deck with three cards. Root `.env` loading also passed with a temporary non-secret config file, which was removed afterward. Hosted GitHub Actions CI passed for the initial commit ([run 45138878020](https://github.com/EkkoNguyen/nihongo-flashcard/actions/runs/45138878020)). Staging remains unverified pending hosting account access and configuration.
