# Repository Guidelines

## Project Context

Build a responsive, multi-user Japanese study web app for learners from beginner through JLPT N1. Learners should be able to create and import their own vocabulary, grammar, and kanji cards, organize them with built-in or custom tags, study through varied practice modes, and share/download decks. The interface should support multiple languages. Product scope and open decisions are in `docs/PRODUCT_BRIEF.md`; the current UI baseline and interaction invariants are in `docs/UI_PLAN.md`, with the approved Direction E visual in `docs/design/ui-direction-e-approved.svg`. The selected stack baseline is documented in `docs/TECH_STACK_DECISION.md`. Treat these documents as the source of truth across sessions; do not replace the approved UI or stack without documenting the reason and reviewing material changes with the user.

## Project Structure & Module Organization

The workspace is a pnpm monorepo. `apps/web` contains the React/Vite client, `apps/api` the Fastify REST API, and `packages/shared` shared contracts and domain utilities. Keep tests next to the code they cover. Static client assets belong in `apps/web/public`; generated output and local dependencies stay out of version control.

## Build, Test, and Development Commands

Use Node.js 24 or newer and pnpm 12.23.0. From the repository root, run `pnpm install`, copy `.env.example` to `.env`, start local MongoDB with `pnpm db:start` (Docker Desktop required), then use `pnpm dev` to start the client and API. Apply and verify the database with `pnpm db:setup` and `pnpm db:verify`; `pnpm db:seed` is development-only. Stop MongoDB with `pnpm db:stop`. Verified checks are `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm format:check`. The API liveness endpoint is `GET /health` on port 3000; Vite serves the client on port 5173.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, ESLint, and Prettier. Name modules for their domain responsibility and tests `*.test.ts` or `*.test.tsx`. Keep changes focused and avoid adding dependencies for functionality already available in the project.

## Testing Guidelines

Follow [`docs/TEST_STRATEGY.md`](docs/TEST_STRATEGY.md) as the required phase-by-phase verification gate. Before implementation, map acceptance criteria to automated or manual evidence; after implementation, run the relevant checks and report results and unavailable dependencies. A phase is not complete while required checks are failing or unrun.

Use Vitest for unit and API tests. Consult the machine-level `testing-strategy` skill when selecting test layers or planning coverage, and `playwright-best-practices` when adding or maintaining browser tests, if those skills are available. Add Playwright for critical browser journeys when the flows exist; it is not configured yet. Keep test data isolated, cover authorization and data integrity, and never send real email or run destructive tests against production.

## Commit & Pull Request Guidelines

No Git history is available in this checkout to establish a commit message convention. Write concise, imperative commit subjects that describe the change (for example, `Add kana review screen`). Pull requests should explain the user-facing or maintenance impact, summarize implementation choices, list verification performed, and include screenshots for visual changes. Link related issues when applicable.

## Security & Configuration

Keep credentials and machine-specific settings out of tracked files. Provide safe examples in any future sample configuration, and document required environment variables without publishing secret values.

## Project Skills

Store project-specific agent skills under `.agents/skills/<skill-name>/`, with one `SKILL.md` per skill. Each skill should state its purpose, when to use it, and clear steps or constraints; keep supporting scripts and references inside that skill's folder. Use short, descriptive, lowercase names. When adding or changing a skill, update this section or add an index at `.agents/skills/README.md` with its name, purpose, and trigger conditions. Apply a skill only when its stated scope matches the task, and keep instructions focused on this project.

### Available Skills

- `project-discovery` (`.agents/skills/project-discovery/SKILL.md`): brainstorm and clarify a project, shape requirements and acceptance criteria, plan milestones and structure, and define verification or automated tests. Use Playwright for browser flows when it fits the project's stack. Keep durable project rules in this root `AGENTS.md` after decisions are agreed.

## Agent Operating Rules

- Read this file and inspect the relevant code, manifests, and tests before proposing or changing project conventions.
- Separate confirmed requirements from assumptions and recommendations; do not record unresolved ideas as rules.
- Before designing or implementing screens, read `docs/UI_PLAN.md` and use its linked reference board. Update those artifacts when the user approves a lasting visual or interaction change.
- Match architecture, dependencies, and test tools to the existing stack and project needs. Add automation for meaningful behavior; use Playwright only for browser-based flows.
- Treat each phase's acceptance criteria and the verification matrix in `docs/TEST_STRATEGY.md` as release gates. Do not report a phase complete if required checks failed or were not run; label unavailable external checks as pending.
- Document verified development and verification commands here. Mark unconfigured commands as proposals rather than facts.
- Keep secrets out of source control and avoid exposing credentials in examples, scripts, logs, or test fixtures.
- Make focused changes, explain key decisions, and report what validation was run and any checks that could not be run.

## Architecture References

- Current architecture is documented in `docs/ARCHITECTURE.md`.
- Current technology direction (React + TypeScript + Vite, Node/Fastify API, MongoDB) is in `docs/TECH_STACK_DECISION.md`; Next.js is not part of the selected direction.
- Read `docs/UI_PLAN.md` and its saved Direction E reference before changing UI.
- Deployment recommendation is in `docs/DEPLOYMENT_PLAN.md`; it is a plan only and does not mean cloud resources have been provisioned.
- The phased product roadmap and completion gates are in `docs/IMPLEMENTATION_PLAN.md`.
