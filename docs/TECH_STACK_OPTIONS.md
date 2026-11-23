# Technology Stack Decision

> This comparison is retained for context. The selected baseline is recorded in [`TECH_STACK_DECISION.md`](TECH_STACK_DECISION.md); use that document as current unless new infrastructure constraints are raised.

## Requirements Driving The Choice

The app needs a responsive multi-user web UI, account-level data isolation, user-owned and shared decks, card/media storage, per-user scheduling history, import/export, reminders, and browser end-to-end testing. The UI plan is framework-agnostic; this is a technical recommendation, not an implementation authorization.

## Recommended Starting Stack

- **App:** Next.js App Router + React + TypeScript. Use server components for data-heavy pages and client components for interactive study/card-editor flows. Official docs describe this server/client split and built-in routing. [Next.js App Router](https://nextjs.org/docs/app), [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- **Database and identity:** Supabase Postgres + Supabase Auth + Row Level Security. Relational tables fit decks, cards, memberships/copies, review logs, and due state. RLS can enforce per-user ownership and access rules at the database boundary; every exposed table needs reviewed policies. [Supabase Auth](https://supabase.com/docs/guides/auth), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- **Files:** Supabase Storage for audio and images, with explicit owner/deck visibility rules.
- **Styling:** Tailwind CSS with project-owned design tokens/components for direction E. Keep components accessible and avoid making a component library determine the product UI.
- **Review scheduling:** TypeScript `ts-fsrs`, with a pinned compatible version and scheduler state/review log stored per user and review direction. The current v6 package documents Node.js >=24; confirm the project runtime before choosing the version. [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)
- **Tests:** unit tests for scheduling and queue distribution; integration tests for ownership/sharing/import; Playwright for browser flows and responsive layouts. Playwright supports Chromium, Firefox, and WebKit plus device emulation. [Playwright](https://playwright.dev/docs/intro)
- **Package manager/runtime:** Node.js 24 LTS and pnpm are a reasonable candidate if using current `ts-fsrs` v6. Pin exact versions after checking the deployment host and local environment.

## Trade-offs And Alternatives

- Next.js + Supabase minimizes separate backend setup and has a coherent TypeScript path, but introduces provider coupling and requires careful RLS design. Keep scheduling rules in a domain/service layer rather than in page components or broad database policies.
- A separate API/backend (for example, NestJS) gives clearer service boundaries and may suit a larger team, but adds deployment, authentication, and operations work that is not yet justified by the project scope.
- Firebase is a viable alternative for auth and media, but this product's deck/card/review relationships and sharing queries are naturally relational; Postgres is the stronger default.
- Google Calendar and email reminders should be added after core review flows. They require secure OAuth/token handling and scheduled jobs; choose a job/email provider once delivery and hosting needs are known.

## Decisions Still Needed Before Scaffold

1. Is the team comfortable building with React/TypeScript and maintaining a hosted Postgres service?
2. Is Supabase acceptable for auth, database, and media, or is self-hosting/provider independence a requirement?
3. Which deployment target and budget constraints apply?
4. Should Google Calendar/email be in the first release, or later?

If those assumptions are acceptable, use the recommended stack for the first scaffold and revisit provider-specific choices behind small adapters where practical.
