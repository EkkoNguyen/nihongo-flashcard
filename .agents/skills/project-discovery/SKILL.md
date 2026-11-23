---
name: project-discovery
description: Turn an early or unclear software project idea into validated requirements, an implementation plan, a maintainable project structure, and a practical verification strategy. Use for project brainstorming, product analysis, BA work, technical planning, or setting up automated tests for this project.
---

# Project Discovery and Planning

Help the user make an early project concrete, then carry agreed decisions into useful repository artifacts. Adapt the depth to the request; do not force every phase for a narrow task. Distinguish confirmed decisions, assumptions, open questions, and recommendations. Ask only questions that materially affect scope or architecture, and continue independent discovery while waiting.

## Workflow

1. **Understand the project.** Inspect the repository, existing `AGENTS.md` instructions, manifests, code, and tests before recommending a direction. Summarize the problem, intended users, desired outcome, constraints, and what is already present. For brainstorming, offer a few distinct options with trade-offs, then help the user choose.
2. **Clarify product requirements.** Identify user roles, core workflows, in-scope and out-of-scope behavior, acceptance criteria, dependencies, and risks. For BA work, express requirements as testable outcomes (for example, user stories and acceptance criteria). Do not silently turn suggestions into approved requirements.
3. **Plan delivery.** Break the agreed scope into milestones and small implementation tasks with dependencies and completion criteria. Call out decisions that block implementation. Keep estimates qualitative unless the user requests estimates and provides a basis.
4. **Propose architecture and structure.** Fit the design to the actual stack and project size. Describe key modules, data boundaries, and a representative directory tree. Explain material trade-offs; do not add technologies or folders without a concrete need.
5. **Define validation.** Map each acceptance criterion to suitable checks: static analysis, unit, integration, API, accessibility, or end-to-end tests. Include manual checks for behavior that is difficult to automate. State commands only when verified from the repository's configuration; otherwise label them as proposed.
6. **Add automation when requested or needed.** Prefer the project's existing test tools. For browser-based user flows, use Playwright where it fits the stack: configure stable base URLs, isolated test data, resilient role/label selectors, and screenshots/traces on failure where supported. Cover critical paths and meaningful edge cases; avoid brittle checks tied to implementation details. Do not add Playwright to a non-browser project or duplicate an existing capable framework without a reason. Keep setup and run commands documented.
7. **Gate implementation phases.** Before a phase, map its acceptance criteria to the project test strategy and identify required environment/services. Implement one phase at a time, then run its checks and report actual evidence. Do not mark a phase complete when required checks fail or remain unrun; distinguish pending external checks from locally verified checks.
8. **Record durable decisions.** After requirements and conventions are agreed, update the root `AGENTS.md` with concise, project-specific rules agents need across future tasks (architecture boundaries, naming, commands, test expectations, and security/configuration constraints). Keep discussion, temporary plans, and unresolved choices out of permanent rules. Save detailed requirements, approved UI decisions, verification matrices, and visual reference assets in focused project documents under `docs/`, then link them from `AGENTS.md` so later sessions can recover the approved context without relying on chat history.

## Deliverables

Choose only what the task needs. A project kickoff can include: problem statement and goals; users and key journeys; requirements with acceptance criteria; assumptions, decisions, and open questions; phased implementation plan; proposed architecture/tree; verification matrix; automation plan and runnable test scripts/configuration; and updated `AGENTS.md`. Use concise tables for requirement-to-test mapping when helpful. Do not implement product features unless asked.

## Skill Boundaries and Decomposition

Treat brainstorming, product analysis/BA, technical planning, and test strategy as related modes of this skill because they share project context and feed the same kickoff decisions. Recommend separate skills only when the repository develops a repeated, independently invoked workflow with distinct inputs or artifacts (for example, a dedicated test maintenance workflow). Avoid creating overlapping skills for labels alone; keep project-specific rules in `AGENTS.md` and reusable workflow guidance here.
