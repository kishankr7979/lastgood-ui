# Requirements Document

## Introduction

The Correlation Timeline Enhancements feature extends the Rewind page of the LastGood dashboard to surface correlation intelligence that the `/scoring/incident` API already returns but is not yet shown visually. Specifically, this feature introduces four new visual elements:

1. **Role badges on timeline events** — a "PRIMARY TRIGGER" badge on the highest-risk event and "CONTRIBUTING FACTOR" badges on supporting events, derived from the existing `individual_scores` array.
2. **Confidence score display** — a prominent "CONFIDENCE: XX%" indicator on the correlation result panel, drawn from the `correlations` data.
3. **Temporal causal path** — a visual connector or numbered sequence indicator on the timeline that traces the causal chain of events leading to the incident.
4. **Correlation status badge** — a "CORRELATED" or "UNCORRELATED" status indicator on the analysis panel, derived from the presence and strength of correlation data.

All enhancements operate exclusively on data already returned by the API; no new API endpoints are required.

---

## Glossary

- **Rewind_Page**: The `src/pages/Rewind.jsx` page that allows users to submit an incident time and view the scored timeline.
- **Timeline**: The `src/components/Timeline/Timeline.jsx` component that renders the ordered list of `EventCard` items.
- **EventCard**: The `src/components/EventCard/EventCard.jsx` component that renders a single scored event.
- **OverallRiskSummary**: The `src/components/OverallRiskSummary/OverallRiskSummary.jsx` component that shows the aggregate incident risk score.
- **Correlations_Panel**: The `src/components/Correlations/Correlations.jsx` component that shows correlation descriptions.
- **Diagnosis_Panel**: The right-column panel on the Rewind_Page that contains OverallRiskSummary, Recommendations, and Correlations_Panel.
- **API_Response**: The JSON object returned by `GET /scoring/incident`, containing `individual_scores`, `overall_assessment`, and `correlations` fields.
- **Individual_Score**: A single element of `API_Response.individual_scores`, containing an `event` object and a `risk_assessment` object with `score` (0–100 numeric), `level`, and `factors` fields.
- **Primary_Trigger**: The Individual_Score whose `risk_assessment.score` is the highest among all Individual_Scores in a given API_Response.
- **Contributing_Factor**: Any Individual_Score that is not the Primary_Trigger and whose `risk_assessment.level` is `"medium"`, `"high"`, or `"critical"`.
- **Causal_Chain**: The temporally ordered sequence of Individual_Scores, sorted ascending by `event.occurred_at`, that have a `risk_assessment.level` of `"medium"` or above.
- **Confidence_Score**: A numeric value between 0 and 100 inclusive representing the engine's certainty that the identified correlations are causally linked to the incident, sourced from `API_Response.correlations`.
- **Correlation_Status**: A binary classification — `CORRELATED` when one or more correlation entries exist in `API_Response.correlations`, and `UNCORRELATED` otherwise.
- **Role_Badge**: A small pill-shaped label rendered inside an EventCard that identifies the event's causal role (PRIMARY TRIGGER or CONTRIBUTING FACTOR).

---

## Requirements

### Requirement 1: Primary Trigger Badge on Timeline Events

**User Story:** As an on-call engineer reviewing a Rewind analysis, I want to immediately see which timeline event is the primary trigger, so that I can focus my remediation effort on the most causally significant change.

#### Acceptance Criteria

1. WHEN `API_Response.individual_scores` contains at least one entry, THE Timeline SHALL identify the entry with the highest `risk_assessment.score` (on a 0–100 scale) as the Primary_Trigger.
2. WHEN the Primary_Trigger is identified, THE Timeline SHALL render a Role_Badge with the text "PRIMARY TRIGGER" on exactly one EventCard — the EventCard corresponding to the Primary_Trigger entry — using a red-tinted background, red border, and red text consistent with the existing `critical` risk color scheme.
3. WHEN two or more Individual_Scores share the same highest `risk_assessment.score`, THE Timeline SHALL designate the one with the earliest `event.occurred_at` as the Primary_Trigger; IF those tied entries also share the same `occurred_at` timestamp, THE Timeline SHALL designate the one appearing first in the `API_Response.individual_scores` array order as the Primary_Trigger.
4. IF `API_Response.individual_scores` is empty, THEN THE Timeline SHALL render no Role_Badges.
5. THE Role_Badge SHALL be positioned immediately before the service name label on the same header line of the EventCard.

---

### Requirement 2: Contributing Factor Badges on Timeline Events

**User Story:** As an on-call engineer, I want to see which events are contributing factors, so that I can understand the broader causal context beyond the single primary trigger.

#### Acceptance Criteria

1. WHEN `API_Response.individual_scores` contains entries whose `risk_assessment.level` is `"medium"`, `"high"`, or `"critical"` and that are not the Primary_Trigger, THE Timeline SHALL designate each such entry as a Contributing_Factor.
2. WHEN a Contributing_Factor is identified, THE EventCard for that entry SHALL render a Role_Badge with the text "CONTRIBUTING FACTOR" using the yellow/warning color palette associated with the `medium` risk level, regardless of that event's own `risk_assessment.level`.
3. WHEN an Individual_Score has a `risk_assessment.level` of `"low"`, `null`, or a missing/null `risk_assessment` object and is not the Primary_Trigger, THE EventCard for that entry SHALL render no Role_Badge.
4. THE Contributing_Factor Role_Badge SHALL be observable as distinct from the Primary_Trigger Role_Badge by two attributes: its label text ("CONTRIBUTING FACTOR" vs "PRIMARY TRIGGER") and its color palette (yellow vs red/critical).
5. WHILE the EventCard is in its default collapsed state, THE Role_Badge SHALL be fully visible without requiring the user to expand the "Why?" details section.

---

### Requirement 3: Confidence Score Display on the Diagnosis Panel

**User Story:** As an on-call engineer, I want to see a confidence percentage on the diagnosis panel, so that I can gauge how certain the AI engine is about the identified correlations before acting on them.

#### Acceptance Criteria

1. WHEN `API_Response.correlations` contains at least one entry with a numeric `confidence` field whose value is between 0 and 100 inclusive, THE Correlations_Panel SHALL display a "CONFIDENCE: XX%" label, where XX is the `confidence` value of the highest-confidence qualifying entry.
2. WHEN all entries in `API_Response.correlations` lack a `confidence` field or all `confidence` values are outside the 0–100 range, THE Correlations_Panel SHALL not render a confidence label.
3. THE confidence label SHALL be rendered as the first child element within the Correlations_Panel, above all other panel content, in uppercase monospace text.
4. WHEN the `confidence` value is 80 or above, THE confidence label SHALL use the semantic green color token consistent with the application's existing risk-level color conventions.
5. WHEN the `confidence` value is between 50 and 79 inclusive, THE confidence label SHALL use the semantic yellow color token consistent with the application's existing risk-level color conventions.
6. WHEN the `confidence` value is below 50, THE confidence label SHALL use the semantic red color token consistent with the application's existing risk-level color conventions.
7. IF a `confidence` value in `API_Response.correlations` is outside the 0–100 range, THEN THE Correlations_Panel SHALL exclude that entry from the highest-confidence calculation.

---

### Requirement 4: Correlation Status Badge on the Diagnosis Panel

**User Story:** As an on-call engineer, I want a clear CORRELATED / UNCORRELATED status indicator on the diagnosis panel, so that I can know at a glance whether the AI engine found a causal link before reading the details.

#### Acceptance Criteria

1. WHEN `API_Response.correlations` contains one or more entries, THE Correlations_Panel SHALL display a status badge with the text "CORRELATED" using a green color palette from the existing risk-level color conventions.
2. WHEN `API_Response.correlations` is an empty array or absent, THE Correlations_Panel SHALL display a status badge with the text "UNCORRELATED" using a gray color palette from the existing neutral color conventions.
3. THE Correlation_Status badge SHALL be rendered inline in the Correlations_Panel header row, to the right of the heading text (which reads "Correlations" in both states).
4. IF the Correlation_Status is "UNCORRELATED", THEN THE Correlations_Panel SHALL still be rendered, SHALL display the status badge in the header, and SHALL NOT render any correlation list items in the body.
5. THE status badge text SHALL be uppercase and rendered as a pill shape (rounded, padded, font-semibold, text-xs) consistent with the pill badge patterns used elsewhere in the application.
6. WHILE the API query for `/scoring/incident` is in a loading or pending state, THE Correlations_Panel SHALL NOT be rendered.

---

### Requirement 5: Temporal Causal Path Visualization on the Timeline

**User Story:** As an on-call engineer, I want to see a visual causal chain connecting the relevant events in chronological order, so that I can quickly understand the sequence of changes that led to the incident.

#### Acceptance Criteria

1. WHEN the Causal_Chain contains two or more Individual_Scores, THE Timeline SHALL render a numbered sequence indicator on each EventCard belonging to the Causal_Chain, with numbers assigned in ascending order of `event.occurred_at` starting at 1; IF two Causal_Chain entries share the same `occurred_at`, THE Timeline SHALL break the tie using their position in the `API_Response.individual_scores` array.
2. WHEN the Causal_Chain contains fewer than two Individual_Scores, THE Timeline SHALL render no causal path sequence indicators and no "CAUSAL PATH" label.
3. THE sequence indicator SHALL be rendered as a small circular numbered badge (w-5 h-5, text-xs, centered numeral) positioned on the left side of the EventCard, overlapping the timeline vertical connector line at the event's dot position.
4. WHEN the Causal_Chain is rendered, THE Timeline SHALL display a "CAUSAL PATH" label as a section header immediately above the EventCard of the first (sequence number 1) Causal_Chain event.
5. THE causal path sequence numbering SHALL begin at 1 for the temporally earliest Causal_Chain event and increment by 1 for each subsequent Causal_Chain event in ascending `occurred_at` order.
6. IF an Individual_Score's `risk_assessment.level` is `"low"`, absent, or its `risk_assessment` object is null, THEN THE Timeline SHALL exclude that event from the Causal_Chain and SHALL render no sequence indicator on its EventCard.

---

### Requirement 6: Consistent Visual Language Across Enhancements

**User Story:** As a user of the LastGood dashboard, I want all new visual indicators to be consistent with the existing design system, so that the page feels cohesive and the new elements are immediately interpretable.

#### Acceptance Criteria

1. THE Role_Badge, confidence label, Correlation_Status badge, and causal path indicators SHALL use only Tailwind CSS color utility classes from the `red`, `orange`, `yellow`, `green`, and `gray` families already established in the codebase, mapped as follows: `critical` role → red family, `contributing` role → yellow family, `correlated` status → green family, `uncorrelated` status → gray family, `high-confidence` (≥80) → green family, `medium-confidence` (50–79) → yellow family, `low-confidence` (<50) → red family.
2. THE Role_Badge and Correlation_Status badge SHALL share a common pill shape rendered with `text-xs font-semibold uppercase px-2 py-0.5 rounded` Tailwind classes.
3. WHEN the Rewind_Page is rendered on a viewport narrower than 768px, THE Role_Badges SHALL use `truncate` or `flex-wrap` to prevent overflowing their parent EventCard container, and SHALL remain fully readable without horizontal scrolling.
4. WHEN no API response has been fetched (initial pre-query state) or WHEN the API response returns an empty `individual_scores` array, THE Rewind_Page SHALL render no Role_Badges, no confidence label, no Correlation_Status badge, and no causal path indicators.
