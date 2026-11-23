# Tech Stack Direction

## Finalized Baseline

This is the selected implementation baseline for the first release. It supersedes earlier alternatives in `TECH_STACK_OPTIONS.md`; exact provider account/tier details can be finalized during deployment setup.

| Layer | Selected technology |
|---|---|
| Frontend | React + TypeScript + Vite SPA |
| Client routing/data | React Router + TanStack Query |
| Backend framework | Fastify REST API on Node.js 24 LTS + TypeScript |
| API validation | Fastify JSON Schema + TypeBox type provider, keeping request validation and inferred TypeScript types aligned |
| Authentication | Better Auth with its MongoDB adapter; secure HttpOnly cookie sessions |
| Database | MongoDB Atlas; MongoDB Node.js driver, explicit collection validators and indexes |
| Search | MongoDB indexes for exact filters initially; Atlas Search only when full-text/autocomplete is needed. No Elasticsearch in release 1. |
| File storage | Cloudflare R2 for audio and images, with private objects and server-issued access |
| Study scheduling | `ts-fsrs` v6 on the API; state per user/card/practice direction |
| Styling | Tailwind CSS and project-owned components/design tokens matching approved Direction E |
| Testing | Vitest + API integration tests + Playwright; `tsc --noEmit` separately from the Vite build |
| Package manager | pnpm workspace for `apps/web`, `apps/api`, and shared TypeScript contracts/domain |
| Code quality | ESLint + Prettier; TypeScript check with `tsc --noEmit` |
| Deployment | Render Static Site for the frontend; Render paid Web Service in Singapore for API; MongoDB Atlas in AWS Singapore; Render Cron for scheduled email reminders |

Email verification and app reminders use a transactional email provider, to be selected before enabling outbound email. Google Calendar is an optional later integration through the Google Calendar API and user OAuth; MCP Calendar is not a production app dependency.

## Current Direction

The product owner's preference is React with JavaScript/TypeScript and MongoDB; Next.js is not wanted. Recommended implementation baseline:

- **Frontend:** React + TypeScript + Vite SPA; React Router for navigation; TanStack Query for API/server state.
- **Backend:** Node.js + Fastify + TypeScript REST API. React is the frontend and does not replace the server needed for accounts, authorization, imports, sharing, and scheduling.
- **Database:** MongoDB Atlas. Model cards and per-user review state in separate collections with references, schema validation, and indexes. MongoDB is suitable for flexible vocabulary/grammar/kanji payloads; use transactions only when multiple document writes must commit atomically, and deploy on a replica set/Atlas.
- **Media:** object storage for audio and images; keep binaries out of MongoDB documents.
- **Scheduling:** `ts-fsrs` v6 on Node.js 24 LTS. Store state and logs per learner and practice direction, not on a public source card.
- **UI:** Tailwind CSS with project-owned components following Direction E.
- **Quality:** Vitest for domain logic, API integration tests for authorization and data flows, Playwright for browser journeys; run `tsc --noEmit` because Vite transpiles TypeScript but does not type-check it.
- **Package manager:** pnpm.

Vite documents an official `react-ts` template and separate TypeScript checking guidance. Fastify documents TypeScript support and request-schema patterns. `ts-fsrs` v6 requires Node >=24, and Node 24 is LTS. [Vite](https://vite.dev/guide/), [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/), [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs), [Node releases](https://nodejs.org/en/about/previous-releases)

## Authentication and Email

- Use Better Auth with its MongoDB adapter for email/password accounts, sessions, and email verification. Keep authentication routes inside the Fastify API.
- Use a transactional email provider (for example, Resend or Postmark) for verification, password reset, and app-generated study reminders. Do not send app mail through each learner's personal Gmail account.
- The current Better Auth docs provide an official MongoDB adapter and email/password verification flow. Configure secure HttpOnly cookies, trusted origins, rate limits, and session revocation before production. [MongoDB adapter](https://better-auth.com/docs/adapters/mongo), [email/password](https://better-auth.com/docs/authentication/email-password), [Fastify integration](https://better-auth.com/docs/integrations/fastify)

## Search Strategy

- Do not add Elasticsearch in the first release. Use normal MongoDB indexes for exact filters/sorts (owner, visibility, JLPT, tags, due date).
- If users need full-text search, autocomplete, typo tolerance, facets, or ranked search across deck/card content, start with MongoDB Atlas Search on the existing collections. It supports these search patterns and language analyzers including Japanese/Kuromoji. [Search features](https://www.mongodb.com/docs/atlas/performance-advisor/recommend-search-text/), [autocomplete](https://www.mongodb.com/docs/search/query/operators-collectors/autocomplete/), [language analyzers](https://www.mongodb.com/docs/search/indexes/analyzers/language/)
- Reconsider Elasticsearch only if measured requirements exceed Atlas Search (for example, advanced custom analyzers/ranking, independent search scaling, or search workloads significantly affecting database performance). It would add a second index to synchronize, reindex and monitor, plus authorization consistency risks for private decks.

## MongoDB Modeling Rules

- One document per deck and one document per card; do not place a growing card array inside a deck document.
- Separate shared deck source content from user-owned downloaded copies and from learner review progress.
- Suggested collections: `users`, `decks`, `cards`, `deckCopies`, `reviewStates`, `reviewLogs`, and `studySessions`.
- Index decks by owner/visibility; cards by deck and position; review states by `(userId, deckId, dueAt)` and uniquely by `(userId, cardId, practiceDirection)`; logs by learner and review time.
- Validate card `content` by card type at the API boundary and with MongoDB collection validation.
- Use transactions for atomic grading updates only where needed; transactions require replica set or sharded deployments and can affect performance. [MongoDB transaction guidance](https://www.mongodb.com/docs/manual/data-modeling/enforce-consistency/transactions/)

## Not Yet Chosen

Hosting provider, MongoDB Atlas region/tier, auth/session implementation, object storage, email provider, and Google Calendar timing remain open. These do not require changing the selected frontend/backend/database direction. Keep auth behind an API module; prefer secure HttpOnly browser cookies with CSRF protection if cookie sessions are chosen.

## Next Step

Before scaffolding, check local Node/pnpm versions and choose host, database region, and authentication/session approach. Then create the React client and API structure described in `docs/ARCHITECTURE.md`.
