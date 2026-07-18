# Implementation Plan: Correlation Timeline Enhancements

## Overview

Incrementally extend the Rewind page to surface four pieces of correlation intelligence already present in the `/scoring/incident` API response: role badges on timeline events, a confidence score label, a causal path sequence, and a correlation status badge. All derivation logic is pure JavaScript; no new API calls or routes are needed. The implementation follows the dependency order: test infrastructure → Timeline derivation functions → Correlations derivation functions → EventCard visual changes → Timeline render wiring → Correlations JSX restructure.

## Tasks

- [x] 1. Set up Vitest and fast-check test infrastructure
  - Install `vitest` and `fast-check` as dev dependencies: `npm install -D vitest@2 fast-check`
  - Add `"test": "vitest --run"` script to `package.json`
  - Add a minimal `vitest.config.js` at the project root that sets `environment: 'node'` for the derivation unit tests (no DOM needed for pure functions)
  - Create empty placeholder test files `src/components/Timeline/__tests__/derivations.test.js` and `src/components/Correlations/__tests__/derivations.test.js` with a single passing smoke test each so the suite is immediately runnable
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 2. Implement pure derivation functions in Timeline.jsx
  - [x] 2.1 Add `computePrimaryTriggerIndex` to Timeline.jsx
    - Write and export the module-level pure function that finds the highest `risk_assessment.score` (treating null `risk_assessment` as score 0), tie-breaks by earliest `event.occurred_at` (ISO string compare), then by lowest array index
    - Return `null` for empty arrays
    - _Requirements: 1.1, 1.3_

  - [ ]* 2.2 Write property test for `computePrimaryTriggerIndex` (Property 1)
    - **Property 1: Primary trigger has the maximum risk score**
    - **Validates: Requirements 1.1, 1.3**
    - Use `fc.array(arbitraryScoredEvent(), { minLength: 1 })` to assert the returned index always points to the entry with `Math.max` score; also assert the tie-break rules hold when multiple events share the max score

  - [x] 2.3 Add `computeRoleBadges` to Timeline.jsx
    - Write and export the module-level pure function that builds a `Map<eventId, 'primary'|'contributing'>`: the primary index maps to `'primary'`; every other index with `risk_assessment.level` in `['medium','high','critical']` maps to `'contributing'`; events with level `'low'`, null level, or null `risk_assessment` are omitted from the Map
    - _Requirements: 1.2, 2.1, 2.3_

  - [ ]* 2.4 Write property tests for `computeRoleBadges` (Properties 2 & 3)
    - **Property 2: Exactly one primary trigger badge per response**
    - **Validates: Requirements 1.1, 1.2**
    - **Property 3: Contributing factors are non-primary elevated-risk events**
    - **Validates: Requirements 2.1, 2.3**
    - Assert exactly one `'primary'` entry in the Map for any non-empty input; assert every `'contributing'` entry is at a non-primary index with an elevated level; assert every elevated non-primary event appears in the Map

  - [x] 2.5 Add `computeCausalChain` to Timeline.jsx
    - Write and export the module-level pure function that filters events to those with `risk_assessment.level` in `['medium','high','critical']`, sorts ascending by `event.occurred_at` (ISO string, array-index tie-break), annotates with 1-based `position`, and returns `[]` when fewer than 2 qualifying events exist
    - _Requirements: 5.1, 5.2, 5.5, 5.6_

  - [ ]* 2.6 Write property tests for `computeCausalChain` (Properties 4 & 5)
    - **Property 4: Causal chain is ordered ascending by occurred_at and numbered from 1**
    - **Validates: Requirements 5.1, 5.5**
    - **Property 5: Causal chain is empty when fewer than two qualifying events exist**
    - **Validates: Requirements 5.2, 5.6**
    - Assert returned positions are exactly `[1, 2, …, N]`; assert sort order is non-decreasing by `occurred_at`; assert empty return when 0 or 1 qualifying events present

- [x] 3. Checkpoint — ensure Timeline derivation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement pure derivation functions in Correlations.jsx
  - [x] 4.1 Add `getHighestValidConfidence` and `getCorrelationStatus` to Correlations.jsx
    - Write `getHighestValidConfidence`: filter `correlations` entries to those with a numeric `confidence` in `[0, 100]`, return `Math.max` of those values or `null` if none qualify; handle null/undefined `correlations` as `[]`
    - Write `getCorrelationStatus`: return `'CORRELATED'` when `correlations?.length > 0`, else `'UNCORRELATED'`
    - _Requirements: 3.1, 3.2, 3.7, 4.1, 4.2_

  - [ ]* 4.2 Write property tests for `getHighestValidConfidence` (Property 6)
    - **Property 6: Highest valid confidence is always within [0, 100]**
    - **Validates: Requirements 3.1, 3.2, 3.7**
    - Assert return is either `null` or a number in `[0, 100]`; assert it equals the max of all valid entries; assert entries with `confidence` outside `[0, 100]` or non-numeric are excluded

  - [x] 4.3 Add `getConfidenceColor` to Correlations.jsx
    - Write `getConfidenceColor(value)`: return `{ text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }` for `value >= 80`; yellow palette for `50 ≤ value < 80`; red palette for `value < 50`
    - _Requirements: 3.4, 3.5, 3.6_

  - [ ]* 4.4 Write property test for `getConfidenceColor` (Property 7)
    - **Property 7: Confidence color thresholds are exhaustive and non-overlapping**
    - **Validates: Requirements 3.4, 3.5, 3.6**
    - Use `fc.integer({ min: 0, max: 100 })` to assert every integer in `[0, 100]` maps to exactly one color family (green/yellow/red) with no overlap

  - [ ]* 4.5 Write property test for `getCorrelationStatus` (Property 8)
    - **Property 8: Correlation status is determined solely by array length**
    - **Validates: Requirements 4.1, 4.2**
    - Use `fc.array(arbitraryCorrelation())` to assert `'CORRELATED'` when length ≥ 1 and `'UNCORRELATED'` when length is 0; also test null/undefined input → `'UNCORRELATED'`

- [x] 5. Checkpoint — ensure all derivation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add RoleBadge sub-component and new props to EventCard.jsx
  - [x] 6.1 Add the `RoleBadge` sub-component inside EventCard.jsx
    - Define `ROLE_BADGE_STYLES` and `ROLE_BADGE_LABELS` constants as shown in the design
    - Write the local `RoleBadge` functional component: `<span className={text-xs font-semibold uppercase px-2 py-0.5 rounded truncate ${ROLE_BADGE_STYLES[variant]}}>{ROLE_BADGE_LABELS[variant]}</span>`
    - _Requirements: 1.2, 2.2, 6.2_

  - [ ] 6.2 Wire `roleBadge` and `causalChainPosition` props into EventCard render
    - Add `roleBadge` and `causalChainPosition` to the destructured props (both default to `null`)
    - Insert `{roleBadge && <RoleBadge variant={roleBadge} />}` as the first child of the header `flex items-center gap-2 mb-3` row, immediately before the service name `<span>`
    - Replace the plain `w-3 h-3 rounded-full bg-accent` dot in the Timeline Column with a conditional: render the numbered `w-5 h-5` circular badge when `causalChainPosition != null`, otherwise render the original dot
    - _Requirements: 1.5, 2.5, 5.3, 6.1, 6.2, 6.3_

  - [ ]* 6.3 Write unit tests for EventCard RoleBadge rendering
    - Render `EventCard` with `roleBadge="primary"` and verify one element with text "PRIMARY TRIGGER" and red Tailwind class is present
    - Render `EventCard` with `roleBadge="contributing"` and verify element with text "CONTRIBUTING FACTOR" and yellow class is present
    - Render `EventCard` with `roleBadge={null}` and verify no badge element is rendered
    - Render `EventCard` with `causalChainPosition={2}` and verify the numbered badge shows "2"; with `causalChainPosition={null}` verify original dot renders
    - _Requirements: 1.2, 1.5, 2.2, 2.4, 5.3_

- [ ] 7. Update Timeline.jsx render loop to compute and pass new props
  - [ ] 7.1 Call the three derivation functions inside the Timeline render and pass results to each EventCard
    - Compute `primaryIndex`, `roleBadges`, `causalChain`, and `causalMap` before the `items.map` call (using the three functions added in task 2)
    - Derive `firstCausalId` as `causalChain.length >= 2 ? causalChain[0].eventId : null`
    - Wrap each `<EventCard>` in `<React.Fragment key={event.id}>`, inserting a "CAUSAL PATH" section label (e.g., `<div className="text-xs font-semibold uppercase tracking-widest text-accent/60 mb-2 mt-4">Causal Path</div>`) immediately before the `EventCard` when `event.id === firstCausalId`
    - Pass `roleBadge={roleBadges.get(event.id) ?? null}` and `causalChainPosition={causalMap.get(event.id) ?? null}` to each `EventCard`
    - _Requirements: 1.1, 1.2, 2.1, 5.1, 5.4_

  - [ ]* 7.2 Write a unit test for the Timeline render with a known fixture
    - Create a small `eventsWithScores` fixture (3 events: one critical primary, one medium contributing, one low) and render `<Timeline eventsWithScores={fixture} />`
    - Assert "PRIMARY TRIGGER" badge appears in the critical event card
    - Assert "CONTRIBUTING FACTOR" badge appears in the medium event card
    - Assert no badge on the low event card
    - Assert "CAUSAL PATH" label appears above the earliest medium/critical event
    - Assert numbered causal badges (1, 2) appear on the appropriate timeline dots
    - _Requirements: 1.2, 2.2, 5.1, 5.4_

- [ ] 8. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Restructure Correlations.jsx JSX to show confidence label and status badge
  - [ ] 9.1 Remove the early-return null guard and restructure the Correlations component JSX
    - Delete the `if (!correlations || correlations.length === 0) return null;` guard at the top of the component
    - Compute `status`, `highestConf`, and `confColor` using the functions added in task 4
    - Add the confidence label block (`font-mono text-xs uppercase mb-3`) as the first child of the outer container div, rendered only when `highestConf != null`
    - Change the header row to `flex items-center gap-2 mb-3` containing the `Zap` icon, the `<h3>Correlations</h3>` heading (replacing "Risk Amplifiers Detected"), and the status badge `<span>` with `ml-auto` alignment
    - Wrap the correlations list in `{status === 'CORRELATED' && (…)}` guard so the `<ul>` only renders when correlated
    - _Requirements: 3.1, 3.3, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 9.2 Write unit tests for Correlations JSX
    - Render `<Correlations correlations={[]} />` → verify "UNCORRELATED" badge is present, no `<li>` elements, component does not return null
    - Render `<Correlations correlations={[{ description: 'test', confidence: 90 }]} />` → verify "CORRELATED" badge, "CONFIDENCE: 90%" label with green class, one `<li>` item
    - Render `<Correlations correlations={[{ description: 'test', confidence: 60 }]} />` → verify yellow class on confidence label
    - Render `<Correlations correlations={[{ description: 'test', confidence: 30 }]} />` → verify red class on confidence label
    - Render `<Correlations correlations={[{ description: 'bad', confidence: 150 }]} />` → verify no confidence label (out-of-range)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.4_

- [ ] 10. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- The three Timeline derivation functions must be **exported** from `Timeline.jsx` so the test files can import them directly without rendering a component
- Similarly, `getHighestValidConfidence`, `getConfidenceColor`, and `getCorrelationStatus` must be exported from `Correlations.jsx`
- `vitest.config.js` should set `environment: 'jsdom'` if rendering `EventCard` or `Correlations` in unit tests; `node` environment suffices for pure-function property tests
- All Tailwind classes in new code must come from the `red`, `yellow`, `green`, and `gray` families already established in the codebase — no new color tokens
- The `roleBadge` prop uses the value `'primary'` (not `'critical'`) so the `RoleBadge` component maps it to the red palette via `ROLE_BADGE_STYLES`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.5"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.6", "4.1", "4.3"] },
    { "id": 3, "tasks": ["4.2", "4.4", "4.5", "6.1"] },
    { "id": 4, "tasks": ["6.2"] },
    { "id": 5, "tasks": ["6.3", "7.1"] },
    { "id": 6, "tasks": ["7.2", "9.1"] },
    { "id": 7, "tasks": ["9.2"] }
  ]
}
```
