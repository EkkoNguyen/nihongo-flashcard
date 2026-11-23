# Implementation Plan

## Goal

Deliver a deployed, responsive Japanese study web app that preserves the approved Direction E UI and the core rule: a study session belongs to one user-selected deck and practice mode. Keep the first release small enough to ship, but design data ownership so shared deck copies and private review progress remain separate.

## Phase verification gate

Use [`TEST_STRATEGY.md`](TEST_STRATEGY.md) for the required test matrix. For each phase, map acceptance criteria to checks before implementation, then run the checks and record evidence afterward. A phase is complete only when required checks pass; unavailable external checks must be reported as pending, not inferred as passing.

## Phase 0 — Scaffold and Deployment Foundation

- Create a pnpm workspace: `apps/web` (React/Vite), `apps/api` (Fastify), `packages/shared` (card/API schemas and shared contracts).
- Configure TypeScript, lint/format, environment validation, root `.env` loading, local dev scripts, health endpoint, error handling, and exact-origin CORS. Apply Better Auth secure-cookie and trusted-origin policy in Phase 1 when auth is initialized.
- Set up GitHub Actions for typecheck, unit tests, and builds; connect staging deployment only after provider credentials are configured.
- Add MongoDB connection, development database config, collection validation/index setup, and local seed data.
- **Done when:** web and API run locally from documented commands; Phase 0 checks in `TEST_STRATEGY.md` pass; secrets are absent from the repo; MongoDB setup/schema verification passes; CI and staging health checks pass when their providers are configured. Current state (2026-11-23): local install, static checks, 8 tests, build, Compose validation, API health, web response, MongoDB setup/schema validation, and idempotent seed pass. GitHub Actions CI passed for the initial commit ([run 45138878020](https://github.com/EkkoNguyen/nihongo-flashcard/actions/runs/45138878020)); staging remains pending Render/account configuration.

## Phase 1 — Accounts and Private Data Boundaries

- Integrate Better Auth with MongoDB; configure secure cookies and trusted origins; implement email/password signup, verification, sign-in/out, session expiry/revocation, password reset, and account settings.
- Add authorization helpers and tests proving one user's private decks, cards, review state, and imports cannot be read or changed by another user.
- Decide the email provider and configure verified sender/domain before enabling real verification emails.
- **Done when:** auth journeys work in Playwright and cross-user access tests deny private data access.

## Phase 2 — Decks, Cards, and Import

- Implement owned decks, tags, JLPT/type filters, search by indexed fields, deck detail and card list.
- Add vocabulary/kanji/grammar card editor with optional reading, meaning, examples/translations, audio/image references, and notes.
- Add CSV import with preview, field mapping, validation report, and per-row error handling; keep Excel import out until format needs are confirmed.
- Add R2 upload flow for media with type/size limits and authorization.
- **Done when:** users can create, edit, delete, import, and browse their own decks/cards at desktop and mobile widths.

## Phase 3 — Deck-Scoped Study and FSRS

- Build mode selection from the chosen deck's actual card content: word→meaning, meaning→word, audio, typing, multiple choice, and eligible kanji/grammar modes.
- Implement front/revealed states, keyboard controls, accessible feedback, one shared session progress indicator, and session resume/exit behavior.
- Integrate `ts-fsrs`; store review states and append-only logs per user/card/direction. The API constructs queues and calculates grades/due times; the client never sets scheduling state.
- **Decision required before implementation:** define whether the unit/day cap counts reviewed card-direction attempts, distinct cards, or both. Recommended metric: review units by direction, with new cards capped separately.
- **Done when:** a session cannot cross deck/mode boundaries, ratings update state once, duplicate submissions are idempotent, and scheduler transitions have unit tests.

## Phase 4 — Daily Goal, Queue Allocation, and Reminders

- Add user-level review-item goal, new-card limit, enabled decks, and priority weights.
- Allocate due review units across enabled decks first; use remaining capacity for new cards; display the preview breakdown. Manually opening one deck remains deck-scoped and does not borrow from other decks.
- Add in-app reminders and time-zone-aware email reminders using an idempotent scheduled job. Store IANA timezone and compute due notification instants in UTC.
- Defer Google Calendar OAuth until the email/in-app reminder flow is stable.
- **Done when:** queue cap/fairness/timezone rules are tested and reminder delivery is duplicate-safe.

## Phase 5 — Shared Decks and Discovery

- Add deck publishing controls, public discovery filters, preview/sample cards, download-to-library as an independent copy, and unpublish/report/moderation basics.
- Keep source deck content read-only to downloaders; source edits do not overwrite a downloaded copy or its review progress.
- Add MongoDB Atlas Search for full-text, autocomplete, or typo-tolerant discovery only if basic indexes fail the approved UX. Do not add Elasticsearch in this phase by default.
- **Done when:** user can publish, discover, preview, download, and study a copy; permission and source-update tests pass.

## Phase 6 — Release Hardening and Production

- Configure Render static frontend, always-on API in Singapore, production Atlas region/tier, R2 bucket, domain/TLS, secrets, backups, logging/alerts, rate limits, and upload restrictions.
- Run Playwright critical journeys on staging (Chromium first; add WebKit/Firefox based on audience/support needs), keyboard/accessibility checks, and responsive layouts.
- Verify backup/restore, deployment rollback, and email failure/retry handling before inviting real users.
- **Done when:** production smoke checks pass, restore/rollback procedures are documented, and no credentials/test data are exposed.

## Out of Scope for First Release

- Google Calendar OAuth integration, Elasticsearch, collaborative editing of the same deck, advanced recommendations beyond the chosen FSRS scheduler and deck priorities, and Excel import unless user research makes one a launch requirement.

## Immediate Next Tasks

1. Configure the planned staging host and non-production service credentials; keep staging separate from production.
2. Run staging health checks after deployment and record the result.
3. Define the exact auth collections and secure cookie/trusted-origin settings for Phase 1.
4. Implement Phase 1, then pass its auth and cross-user verification gate before starting deck/card features.
