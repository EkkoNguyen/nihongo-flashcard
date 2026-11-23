# Product Brief: Japanese Flashcard Web App

## Confirmed Direction

- Serve Japanese beginners and JLPT learners across N5–N1.
- Build a responsive web app for desktop and mobile, with accounts and per-user study data.
- Support vocabulary, grammar, and kanji study cards with optional readings, meanings, examples/translations, audio, images, and notes.
- Let users create cards, import decks, access curated content, and share/download decks from other users.
- Organize cards with built-in tags and user-defined topics.
- Offer several engaging study modes, configurable daily goals, review scheduling, and a switchable interface language.
- UI direction E is selected as the baseline: energetic cobalt blue, teal, and warm yellow accents; modern, mainstream-friendly typography and components. See `docs/UI_PLAN.md` for the screen flows and interaction rules to carry into implementation.

### Deck and Practice Model

- Users create and own multiple decks; each deck contains its own vocabulary, grammar, or kanji cards. Shared/community decks are discovered separately and downloaded/copied into a user's library.
- The core learning journey is **My Decks → open one deck → choose a practice mode available for that deck → study cards from that deck only**. Do not present a system-wide vocabulary queue as the default practice flow.
- A learner-level daily target and limit apply across the user's chosen decks. A recommended daily queue may distribute due review items across enabled decks according to due status and user priority, while a manually opened deck remains scoped to that deck and mode.

## Product Recommendations To Review

- Start the scheduler with FSRS rather than hand-written fixed intervals. Store a review history and a card scheduling state per learner; set a conservative default desired retention and daily new-card limit, then let users adjust workload. FSRS bases scheduling on recall probability and desired retention; Anki documents 90% as a balance of retention and review load. [Anki FSRS guidance](https://docs.ankiweb.net/manual/deck-options#fsrs)
- Use four clear answer ratings in review: Again (forgot/incorrect), Hard (correct with major difficulty), Good (correct with hesitation), Easy (effortless). Teach the distinction in the UI so incorrect recall is not marked Hard.
- Prioritize due reviews before introducing new cards, cap new cards by the user goal, and provide a short same-session relearning step for missed cards. Avoid promising a universal “best” schedule; tune from review history and user workload.
- Ship in-app scheduling and email reminders first. Treat Google Calendar integration as a later opt-in integration because it requires account linking, permissions, and decisions about calendar edits.
- Separate public shared decks from a user's downloaded copy so edits to the original do not unexpectedly overwrite personal study progress.

## Open Decisions

- Exact review modes and which card types support each mode.
- Initial curated JLPT content, its source/licensing, and moderation rules for shared decks.
- Languages supported at launch and translation ownership.
- Reminder cadence, timezone handling, and whether email reminders are in the first release.
- Whether imports support CSV only initially or Excel formats as well.
- Hosting provider, Supabase region, and budget constraints.
- Final copy/content details for each UI screen.

## Initial Verification Strategy

- Unit-test scheduling transitions, due-date boundaries, timezones, and daily goal limits.
- Integration-test account isolation, deck import/export, shared-deck download, and review history persistence.
- Use Playwright for critical browser flows: sign up/sign in, create/import a deck, review a card, download a shared deck, configure a reminder, and switch interface language. Cover responsive desktop/mobile layouts and keyboard-accessible study controls.

## Current Technical Direction

The product owner prefers React + JavaScript/TypeScript, does not want Next.js, and is open to MongoDB. The recommended direction is React + TypeScript + Vite, a Node/Fastify API, and MongoDB Atlas; architecture and modeling details are in `docs/ARCHITECTURE.md` and `docs/TECH_STACK_DECISION.md`. Hosting, database region, authentication, and object storage are still open.
