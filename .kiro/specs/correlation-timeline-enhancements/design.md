# Design Document

## Correlation Timeline Enhancements

---

## Overview

This design extends the Rewind page to surface four pieces of correlation intelligence already present in the `/scoring/incident` API response but not yet visualised:

1. **Role badges** — "PRIMARY TRIGGER" and "CONTRIBUTING FACTOR" pills on `EventCard` items.
2. **Confidence score** — a "CONFIDENCE: XX%" label at the top of the `Correlations` panel.
3. **Correlation status badge** — a "CORRELATED" / "UNCORRELATED" pill in the panel header.
4. **Temporal causal path** — numbered badges on timeline connector dots marking the causal chain.

All four enhancements are pure UI additions that derive their data from the existing `individual_scores` and `correlations` fields returned by the API. No API changes, no new routes, no new pages, and no new top-level components are introduced.

---

## Architecture

The feature fits cleanly into the existing component hierarchy. Data flows downward from `Rewind.jsx` through `Timeline` and `Correlations` exactly as today; the only new information travelling through that hierarchy is a `roleBadge` prop and a `causalChainPosition` prop on each `EventCard`, plus a richer prop surface on `Correlations`.

```
Rewind.jsx
  ├── Timeline (eventsWithScores)
  │     └── EventCard × N
  │           new props: roleBadge, causalChainPosition
  └── Correlations (correlations)
        new derived values: highestConfidence, correlationStatus
```

All derivation logic lives inside `Timeline.jsx` as **pure functions** that receive `eventsWithScores` and return derived data structures. These functions have no side-effects and are trivially unit-testable.

```
Timeline.jsx
  computePrimaryTriggerIndex(eventsWithScores) → number | null
  computeRoleBadges(eventsWithScores, primaryIndex) → Map<eventId, 'primary'|'contributing'>
  computeCausalChain(eventsWithScores) → CausalChainEntry[]
```

`Correlations.jsx` gains two internal derivations:

```
Correlations.jsx
  getHighestValidConfidence(correlations) → number | null
  getConfidenceColor(value) → { text, bg, border }
  getCorrelationStatus(correlations) → 'CORRELATED' | 'UNCORRELATED'
```

---

## Components and Interfaces

### Timeline.jsx — changes

#### New derivation functions (module-level pure functions)

```js
/**
 * Returns the index of the Primary Trigger in eventsWithScores.
 * Tie-break 1: earliest occurred_at. Tie-break 2: lowest array index.
 * Returns null when the array is empty.
 */
function computePrimaryTriggerIndex(eventsWithScores: ScoredEvent[]): number | null

/**
 * Returns a Map from event.id → role for every event that should display a badge.
 * primaryIndex is the result of computePrimaryTriggerIndex.
 */
function computeRoleBadges(
  eventsWithScores: ScoredEvent[],
  primaryIndex: number | null
): Map<string, 'primary' | 'contributing'>

/**
 * Returns the ordered causal chain: items whose level is medium/high/critical,
 * sorted ascending by occurred_at (tie-broken by original array position),
 * annotated with their 1-based sequence number.
 * Returns [] when fewer than 2 qualifying events exist.
 */
function computeCausalChain(
  eventsWithScores: ScoredEvent[]
): Array<{ eventId: string; position: number }>
```

#### Updated render loop

```jsx
// inside Timeline render
const primaryIndex = computePrimaryTriggerIndex(items);
const roleBadges   = computeRoleBadges(items, primaryIndex);
const causalChain  = computeCausalChain(items);
const causalMap    = new Map(causalChain.map(e => [e.eventId, e.position]));

const firstCausalId = causalChain.length >= 2 ? causalChain[0].eventId : null;

return (
  <div className="max-w-3xl mx-auto py-8">
    {causalChain.length >= 2 && /* render CAUSAL PATH label before first causal event */}
    {items.map((item, index) => {
      const event = item.event;
      const riskAssessment = item.risk_assessment;
      const roleBadge = roleBadges.get(event.id) ?? null;
      const causalChainPosition = causalMap.get(event.id) ?? null;
      const showCausalLabel = event.id === firstCausalId;

      return (
        <React.Fragment key={event.id}>
          {showCausalLabel && <CausalPathLabel />}
          <EventCard
            event={event}
            riskAssessment={riskAssessment}
            isLast={index === items.length - 1}
            roleBadge={roleBadge}
            causalChainPosition={causalChainPosition}
          />
        </React.Fragment>
      );
    })}
  </div>
);
```

### EventCard.jsx — changes

Two new optional props:

| Prop | Type | Description |
|------|------|-------------|
| `roleBadge` | `'primary' \| 'contributing' \| null` | Badge variant to render in the card header |
| `causalChainPosition` | `number \| null` | 1-based number to render on the timeline dot; null = no badge |

**Role badge placement** — inserted as the first child of the `flex items-center gap-2 mb-3` header row, immediately before the `<span>` that currently renders the service name:

```jsx
{roleBadge && <RoleBadge variant={roleBadge} />}
<span className="font-semibold uppercase tracking-wide text-accent text-xs">{service}</span>
```

**Causal chain badge** — replaces the plain `w-3 h-3 rounded-full bg-accent` dot in the timeline column when `causalChainPosition` is non-null:

```jsx
{causalChainPosition != null ? (
  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-background mt-6 z-10 shadow-[0_0_10px_rgba(45,212,191,0.5)]">
    {causalChainPosition}
  </div>
) : (
  <div className="w-3 h-3 rounded-full bg-accent mt-6 shadow-[0_0_10px_rgba(45,212,191,0.5)] z-10" />
)}
```

#### RoleBadge sub-component (local to EventCard.jsx)

```jsx
const ROLE_BADGE_STYLES = {
  primary:     'bg-red-500/20 border border-red-500/40 text-red-400',
  contributing:'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400',
};

const ROLE_BADGE_LABELS = {
  primary:     'PRIMARY TRIGGER',
  contributing:'CONTRIBUTING FACTOR',
};

const RoleBadge = ({ variant }) => (
  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded truncate
                    ${ROLE_BADGE_STYLES[variant]}`}>
    {ROLE_BADGE_LABELS[variant]}
  </span>
);
```

### Correlations.jsx — changes

The component gains these responsibilities:

1. Derive `highestConfidence` from the correlations array (filter to `[0,100]`, take max).
2. Derive `correlationStatus` (`'CORRELATED'` when array length > 0, `'UNCORRELATED'` otherwise).
3. Render the panel **always** (not returning null when empty) so the status badge is always visible.
4. Show the confidence label as first child of the panel when `highestConfidence` is non-null.
5. Show the status badge inline in the header row.

```jsx
const getHighestValidConfidence = (correlations) => {
  if (!correlations || correlations.length === 0) return null;
  const valid = correlations
    .map(c => c.confidence)
    .filter(v => typeof v === 'number' && v >= 0 && v <= 100);
  return valid.length > 0 ? Math.max(...valid) : null;
};

const getConfidenceColor = (value) => {
  if (value >= 80) return { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' };
  if (value >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  return              { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' };
};

const STATUS_STYLES = {
  CORRELATED:   'bg-green-500/20 border-green-500/40 text-green-400',
  UNCORRELATED: 'bg-gray-500/20 border-gray-500/40 text-gray-400',
};
```

Updated JSX structure:

```jsx
export const Correlations = ({ correlations }) => {
  const status = correlations?.length > 0 ? 'CORRELATED' : 'UNCORRELATED';
  const highestConf = getHighestValidConfidence(correlations);
  const confColor   = highestConf != null ? getConfidenceColor(highestConf) : null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
      {/* Confidence label — first child */}
      {highestConf != null && (
        <div className={`font-mono text-xs uppercase mb-3 ${confColor.text}`}>
          CONFIDENCE: {highestConf}%
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-yellow-400">Correlations</h3>
        <span className={`ml-auto text-xs font-semibold uppercase px-2 py-0.5 rounded border
                          ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      {/* Correlation list — only when CORRELATED */}
      {status === 'CORRELATED' && (
        <ul className="space-y-1 text-yellow-300/80 text-sm">
          {correlations.map((corr, i) => (
            <li key={i}>- {corr.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Rewind.jsx — changes

`Correlations` must now be rendered even when `correlations` is empty or absent (to show the UNCORRELATED badge). The existing condition `isFetched && result` already guards the panel, so the only change is removing the `correlations.length === 0 → null` guard from `Correlations.jsx` itself (done above).

No props or imports in `Rewind.jsx` need to change.

---

## Data Models

### ScoredEvent (existing shape, documented for reference)

```ts
interface ScoredEvent {
  event: {
    id: string;
    summary: string;
    occurred_at: string;   // ISO-8601
    service: string;
    environment: string;
    meta: { author: string; commit: string };
    time_before_incident?: string;
  };
  risk_assessment: {
    score: number;         // 0–100
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{ name: string; score: number; description: string; evidence: string[] }>;
  } | null;
}
```

### Correlation (existing shape, documented for reference)

```ts
interface Correlation {
  description: string;
  confidence?: number;   // 0–100 (optional)
}
```

### Derived: CausalChainEntry (new, internal to Timeline)

```ts
interface CausalChainEntry {
  eventId: string;
  position: number;   // 1-based
}
```

### Derived: RoleBadgeVariant (new, internal)

```ts
type RoleBadgeVariant = 'primary' | 'contributing';
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Primary trigger has the maximum risk score

*For any* non-empty array of scored events, `computePrimaryTriggerIndex` must return an index `i` such that `eventsWithScores[i].risk_assessment.score` equals the maximum score across the entire array, and no other index `j < i` has the same score with an earlier or equal `occurred_at`.

**Validates: Requirements 1.1, 1.3**

---

### Property 2: Exactly one primary trigger badge per response

*For any* non-empty `eventsWithScores` array, `computeRoleBadges` must return a Map containing exactly one entry with value `'primary'`, and that entry's key must equal `eventsWithScores[computePrimaryTriggerIndex(eventsWithScores)].event.id`.

**Validates: Requirements 1.1, 1.2**

---

### Property 3: Contributing factors are non-primary events with elevated risk

*For any* `eventsWithScores` array and the computed `primaryIndex`, every entry in `computeRoleBadges` with value `'contributing'` must be at an index that is not `primaryIndex` and whose `risk_assessment.level` is `'medium'`, `'high'`, or `'critical'`; and every entry with level in that set that is not the primary must appear in the Map as `'contributing'`.

**Validates: Requirements 2.1, 2.3**

---

### Property 4: Causal chain is ordered ascending by occurred_at and numbered from 1

*For any* `eventsWithScores` array, `computeCausalChain` must return a sequence where:
- each entry has `risk_assessment.level` in `{'medium', 'high', 'critical'}`,
- entries are sorted in non-decreasing `occurred_at` order (ISO string ascending, array-index tie-break),
- positions are exactly `1, 2, 3, …, N` without gaps.

**Validates: Requirements 5.1, 5.5**

---

### Property 5: Causal chain is empty when fewer than two qualifying events exist

*For any* `eventsWithScores` array with zero or one entries whose `risk_assessment.level` is `'medium'`, `'high'`, or `'critical'`, `computeCausalChain` must return an empty array.

**Validates: Requirements 5.2, 5.6**

---

### Property 6: Highest valid confidence is always within [0, 100]

*For any* correlations array, `getHighestValidConfidence` must return either `null` (when no valid confidence exists) or a number `v` such that `0 ≤ v ≤ 100` and `v` equals `Math.max` of all `correlation.confidence` values in the array that are numbers within `[0, 100]`.

**Validates: Requirements 3.1, 3.2, 3.7**

---

### Property 7: Confidence color thresholds are exhaustive and non-overlapping

*For any* integer `v` in `[0, 100]`, `getConfidenceColor(v)` must return the green palette when `v ≥ 80`, the yellow palette when `50 ≤ v < 80`, and the red palette when `v < 50`; and every integer in `[0, 100]` maps to exactly one palette.

**Validates: Requirements 3.4, 3.5, 3.6**

---

### Property 8: Correlation status is determined solely by array length

*For any* correlations value, `getCorrelationStatus` must return `'CORRELATED'` when the array has length ≥ 1, and `'UNCORRELATED'` when the array is null, undefined, or has length 0.

**Validates: Requirements 4.1, 4.2**

---

## Error Handling

### Missing or null `risk_assessment`

All derivation functions treat `risk_assessment === null` as equivalent to `level: 'low'` and `score: 0`. This means:
- Such events are never the Primary Trigger (unless all scores are 0; tie-break by `occurred_at` then array index still applies).
- Such events are never Contributing Factors.
- Such events are excluded from the Causal Chain.

### Empty `individual_scores`

`computePrimaryTriggerIndex` returns `null`; `computeRoleBadges` returns an empty Map; `computeCausalChain` returns `[]`. No badges are rendered.

### Missing `confidence` on correlations

`getHighestValidConfidence` filters by `typeof v === 'number' && v >= 0 && v <= 100`, so missing or out-of-range values are silently excluded. If all entries are invalid, the function returns `null` and no confidence label is rendered.

### `correlations` absent / null

Treated as `[]`. Status is `'UNCORRELATED'`; no list items; confidence label absent. The panel still renders to show the status badge.

### Non-ISO `occurred_at` values

The sort in `computeCausalChain` uses standard string lexicographic comparison on ISO-8601 strings, which is chronologically correct. Any non-ISO value would sort unpredictably; the requirements do not define handling for malformed timestamps, so no special error path is needed — sorting will still be deterministic.

---

## Testing Strategy

The testing strategy is split into two complementary layers.

### Unit / Property tests

No test framework is currently configured in `package.json`. The recommended setup is **Vitest** (native Vite integration, zero config) with **fast-check** for property-based tests.

Install:
```
npm install -D vitest @vitest/ui fast-check
```

Add to `package.json`:
```json
"test": "vitest --run"
```

#### Files to create

- `src/components/Timeline/__tests__/derivations.test.js` — tests for all three pure functions exported from `Timeline.jsx`
- `src/components/Correlations/__tests__/derivations.test.js` — tests for the two pure functions in `Correlations.jsx`

#### Property-based tests (minimum 100 iterations each)

Each property test maps directly to a Correctness Property above.

**Property 1 — Primary trigger has the maximum risk score**
```
// Feature: correlation-timeline-enhancements, Property 1: primary trigger has the maximum risk score
fc.assert(
  fc.property(fc.array(arbitraryScoredEvent(), { minLength: 1 }), (events) => {
    const idx = computePrimaryTriggerIndex(events);
    const maxScore = Math.max(...events.map(e => e.risk_assessment?.score ?? 0));
    return events[idx].risk_assessment?.score === maxScore;
  }),
  { numRuns: 100 }
)
```

**Property 2 — Exactly one primary badge**
```
// Feature: correlation-timeline-enhancements, Property 2: exactly one primary trigger badge per response
fc.assert(
  fc.property(fc.array(arbitraryScoredEvent(), { minLength: 1 }), (events) => {
    const idx   = computePrimaryTriggerIndex(events);
    const badges = computeRoleBadges(events, idx);
    const primaries = [...badges.values()].filter(v => v === 'primary');
    return primaries.length === 1 && badges.get(events[idx].event.id) === 'primary';
  }),
  { numRuns: 100 }
)
```

**Property 3 — Contributing factors are non-primary elevated events**
```
// Feature: correlation-timeline-enhancements, Property 3: contributing factors are non-primary elevated-risk events
```

**Property 4 — Causal chain order and numbering**
```
// Feature: correlation-timeline-enhancements, Property 4: causal chain is ordered ascending by occurred_at and numbered from 1
```

**Property 5 — Causal chain empty when < 2 qualifying events**
```
// Feature: correlation-timeline-enhancements, Property 5: causal chain is empty when fewer than two qualifying events exist
```

**Property 6 — Highest valid confidence in [0, 100]**
```
// Feature: correlation-timeline-enhancements, Property 6: highest valid confidence is always within [0, 100]
```

**Property 7 — Confidence color thresholds exhaustive**
```
// Feature: correlation-timeline-enhancements, Property 7: confidence color thresholds are exhaustive and non-overlapping
fc.assert(
  fc.property(fc.integer({ min: 0, max: 100 }), (v) => {
    const color = getConfidenceColor(v);
    if (v >= 80) return color.text.includes('green');
    if (v >= 50) return color.text.includes('yellow');
    return color.text.includes('red');
  }),
  { numRuns: 100 }
)
```

**Property 8 — Correlation status by array length**
```
// Feature: correlation-timeline-enhancements, Property 8: correlation status is determined solely by array length
fc.assert(
  fc.property(fc.array(arbitraryCorrelation()), (correlations) => {
    const status = getCorrelationStatus(correlations);
    return correlations.length > 0 ? status === 'CORRELATED' : status === 'UNCORRELATED';
  }),
  { numRuns: 100 }
)
```

#### Unit / example tests

- Render `EventCard` with `roleBadge="primary"` → verify one element with text "PRIMARY TRIGGER" and red color classes.
- Render `EventCard` with `roleBadge="contributing"` → verify element with text "CONTRIBUTING FACTOR" and yellow color classes.
- Render `Correlations` with empty array → verify "UNCORRELATED" badge present, no `<li>` items.
- Render `Correlations` with non-empty array → verify "CORRELATED" badge, list items rendered.
- Render `Correlations` with all out-of-range confidence → verify no confidence label.
- Render `Timeline` with known fixture → verify "CAUSAL PATH" label appears above first causal event.

### Integration / smoke tests

- Run a full Rewind flow (mocked API response) end-to-end in a browser environment to confirm all four enhancements render together coherently.
