# UI Plan

## Approved Direction

Use visual direction E as the product baseline: cobalt blue for primary navigation/actions, teal for secondary actions and progress, warm yellow for emphasis, and white or pale-blue surfaces. Use modern, readable typography and a friendly adult-oriented tone. Keep the interface lively without relying on a mascot or childish game styling. This plan is framework-agnostic.

Persistent visual reference: [Approved Direction E dashboard](design/ui-direction-e-approved.svg). This is a saved, standalone reproduction of the **center E column** the user selected from the D/E/F comparison. Keep this image and this plan together as the source of truth when a conversation/session changes. The reference is not production UI or a selected component library.

### Design Tokens

- Primary cobalt: `#1558D6`; dark navigation: `#1249B8`.
- Secondary teal: `#12AFA2`; warm yellow: `#FFC83D`.
- Surface: `#FFFFFF`; soft blue surface: `#F2F7FF`; ink: `#14233D`.
- Use yellow for highlights and emphasis, not long text. Reserve red for errors and destructive actions; green for success and correct answers.
- Use medium corner radii and clear borders/shadows. Avoid parchment textures, heavy gradients, and decorative Japanese motifs that compete with content.

## Information Architecture

- **Home:** today's personal goal and a preview of the user's selected-deck study queue.
- **My Decks:** owned/downloaded decks, per-deck card/due/progress counts, search, filters, create and import actions.
- **Deck detail:** deck metadata, tags, progress, card list, and mode choices available for this deck.
- **Discover:** public shared decks with search, JLPT/type filters, preview, author information, and download-to-library action.
- **Study:** one selected deck and one selected mode per session. Never silently mix cards from other decks into this session.
- **Schedule & reminders:** user-level daily review target, new-card cap, selected decks and their priority, study days, timezone, and reminder channels.
- **Statistics / Settings:** progress by deck and JLPT level; account, language, and notification preferences.

## Core Flows

1. **Study a deck:** My Decks → open a deck → choose an available mode → study only eligible cards from that deck and mode → reveal/check answer → rate Again/Hard/Good/Easy → see one session progress indicator.
2. **Create cards:** open/create a deck → add vocabulary, kanji, or grammar cards with optional fields → save or add another card. CSV import is a separate path into a selected deck.
3. **Download a shared deck:** Discover → preview deck and sample cards → download a personal copy. The copy must not overwrite source content or existing personal scheduling history.
4. **Plan study:** set a user-level daily target → enable decks and adjust priority → preview the proposed distribution of due/new review items → select study days and reminders.

## Practice Mode Rules

- **Remember word:** show Japanese prompt; keep meaning and examples hidden until reveal.
- **Remember meaning:** show meaning; ask for Japanese word/reading.
- **Listen:** play audio without exposing the answer; select or type the matching item.
- **Type answer:** accept configured Japanese input conventions and give clear correct/incorrect feedback.
- **Multiple choice:** show plausible choices, avoid revealing the answer in labels or audio before response.
- **Kanji / grammar:** offer only when the deck has suitable content; use recognition, reading, stroke/canvas, or cloze interactions as appropriate to the card data.
- Mode availability/counts are scoped to the open deck. Modes may share underlying content, but review history must identify the tested direction/mode so the scheduler does not conflate recognition with recall.

## Session UI Invariants

- The front state contains only the prompt and relevant permitted controls; never reveal the answer/example translation before the user responds or asks to reveal it.
- Show one shared progress indicator for the session (for example `8 / 20` and one bar), not duplicate counters on prompt and answer panels.
- The revealed-answer state shows answer, optional example/audio, then Again/Hard/Good/Easy controls. Do not hard-code review intervals into the UI; display scheduler-provided previews only when available.
- Keyboard controls must have visible hints and equivalent accessible buttons. Provide a clear exit action and preserve completed review events if a session ends early.

## Daily Workload Behavior To Implement

- Configure a user-level target for review items and a separate limit for new items.
- The recommended queue can balance due items across enabled decks by due state and user priority. Due items take precedence; new items use only remaining capacity.
- Opening a specific deck starts a deck-scoped session. Show the remaining daily goal, but do not pull cards from another deck to fill it.
- Explain when a target is reached; allow the learner to continue deliberately instead of silently blocking study.
- Treat each recall direction as its own schedulable review unit if it is practiced independently. Confirm data modeling against the chosen FSRS integration before implementation.

## Responsive and Accessibility Notes

- Desktop uses persistent navigation and dense deck tables; mobile uses compact navigation and stacked deck cards/forms.
- Keep the study prompt central, controls reachable by keyboard and touch, and text/audio/meaning distinguishable without color alone.
- Maintain visible focus, semantic labels, useful error messages, and reduced-motion support for any animations.

## Review Boundary

The visual direction and information architecture are approved as the baseline. Detailed copy, exact mode availability, card editor validation, and workload-balancing policy remain product decisions to settle during implementation planning. No frontend framework is implied by this document.
