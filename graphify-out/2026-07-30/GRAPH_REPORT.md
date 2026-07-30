# Graph Report - lastgood-ui  (2026-07-30)

## Corpus Check
- 65 files · ~28,640 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 316 nodes · 396 edges · 34 communities (28 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `676b2662`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Correctness Properties
- devDependencies
- dependencies
- App.jsx
- Settings.jsx
- What You Must Do When Invoked
- Requirements
- Rewind.jsx
- Events.jsx
- package.json
- EventCard.jsx
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- Implementation Plan: Correlation Timeline Enhancements
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- React + Vite
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- workflows/graphify.md
- extraction-spec.md
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 12 edges
2. `/graphify` - 10 edges
3. `useOrganization()` - 9 edges
4. `Design Document` - 9 edges
5. `Correctness Properties` - 9 edges
6. `useOrgStore` - 8 edges
7. `graphify reference: extra exports and benchmark` - 8 edges
8. `api` - 7 edges
9. `useApiKeys()` - 7 edges
10. `getAPIKeyByOrg()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `GitHubWebhookModal()` --calls--> `useOrgStore`  [EXTRACTED]
  src/components/GitHubWebhookModal/GitHubWebhookModal.jsx → src/stores/useOrgStore.js
- `useEvents()` --calls--> `useApiKeys()`  [EXTRACTED]
  src/hooks/useEvents.js → src/hooks/useApiKeys.js
- `useOrganization()` --indirect_call--> `getOrganization()`  [INFERRED]
  src/hooks/useOrganization.js → src/service/organization.js
- `ProtectedRoute()` --calls--> `setTokenFetcher()`  [EXTRACTED]
  src/App.jsx → src/api/index.js
- `App()` --calls--> `setTokenFetcher()`  [EXTRACTED]
  src/App.jsx → src/api/index.js

## Import Cycles
- None detected.

## Communities (34 total, 6 thin omitted)

### Community 0 - "Correctness Properties"
Cohesion: 0.05
Nodes (38): Architecture, Components and Interfaces, Correctness Properties, Correlation (existing shape, documented for reference), Correlation Timeline Enhancements, `correlations` absent / null, Correlations.jsx — changes, Data Models (+30 more)

### Community 1 - "devDependencies"
Cohesion: 0.07
Nodes (29): autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, devDependencies (+21 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (29): @auth0/auth0-react, axios, class-variance-authority, clsx, date-fns, dayjs, lucide-react, dependencies (+21 more)

### Community 3 - "App.jsx"
Cohesion: 0.13
Nodes (14): api, setTokenFetcher(), App(), ProtectedRoute(), toast, ToastContainer(), useHelpLoom(), queryClient (+6 more)

### Community 4 - "Settings.jsx"
Cohesion: 0.18
Nodes (14): CreateAPIKey(), GitHubWebhookModal(), LogoutConfirmationModal(), OnboardingModal(), useApiKeys(), useOrganization(), MainLayout(), Integrations() (+6 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 6 - "Requirements"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Glossary, Introduction (+8 more)

### Community 7 - "Rewind.jsx"
Cohesion: 0.20
Nodes (10): Correlations(), getConfidenceColor(), STATUS_STYLES, LoadingState(), getRiskStyles(), OverallRiskSummary(), Recommendations(), normaliseItem() (+2 more)

### Community 8 - "Events.jsx"
Cohesion: 0.23
Nodes (10): SimpleBarChart(), SimpleLineChart(), StatsCard(), DateRangeFilter(), MultiSelectFilter(), SearchBar(), SimpleSelectFilter(), fetchEvents() (+2 more)

### Community 9 - "package.json"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, dev, lint, preview, test (+2 more)

### Community 10 - "EventCard.jsx"
Cohesion: 0.27
Nodes (6): EventCard(), getRiskColor(), ROLE_BADGE_LABELS, ROLE_BADGE_STYLES, RiskFactorDetails(), RiskScoreRing()

### Community 11 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 14 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 15 - "Implementation Plan: Correlation Timeline Enhancements"
Cohesion: 0.33
Nodes (5): Implementation Plan: Correlation Timeline Enhancements, Notes, Overview, Task Dependency Graph, Tasks

### Community 16 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 17 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 18 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 19 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **129 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Correctness Properties` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1339031339031339 - nodes in this community are weakly interconnected._