# Kotoba Loop

Responsive Japanese study app organized around learner-owned decks. Study sessions stay within the deck and practice mode the learner selected.

## Requirements

- Node.js 24 or newer (the project is currently checked with Node 26.13)
- pnpm 12.23.0 (pinned in `package.json`)
- MongoDB is optional for the initial app shell; features that persist accounts and decks require a local or Atlas database.

## Local development

```powershell
pnpm install
Copy-Item .env.example .env
pnpm db:start
pnpm dev
```

The web client runs at `http://localhost:5173`; the Fastify API runs at `http://localhost:3000`. The API liveness endpoint is `GET /health`.

`pnpm db:start` starts a local MongoDB container bound only to `127.0.0.1:27017`; Docker Desktop must be running. The API and Vite load the root `.env` file, and Vite exposes only variables prefixed with `VITE_` to browser code.

Run `pnpm db:setup` to apply collection validators and indexes. Run `pnpm db:verify` to check setup idempotency, required collections/indexes, and validator enforcement against a database named with `_dev` or `_test`. Use `pnpm db:seed` only with a development database whose name ends in `_dev`; the script refuses other database names and production mode. Stop the local database with `pnpm db:stop`.

## Verification

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm format:check
```

See `docs/IMPLEMENTATION_PLAN.md` for phase gates and `docs/ARCHITECTURE.md` for system boundaries. Do not put credentials in `.env.example`; keep local secrets in the ignored `.env` file.
