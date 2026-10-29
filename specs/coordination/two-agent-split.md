# Two-agent execution split

Date: 2026-10-29. This partition supersedes the earlier three-worker family assignments
for the next resumed implementation. The enterprise goal is paused; preparing this split
does not resume implementation.

## Verified starting point

Read AGENTS.md, specs/index.md and specs/catalog/nuxt-ui.md first. Primary authoring is
closed TSX; JSON is optional generative transport. Do not revive the obsolete JSON-first
prototype or claims that schemas replace browser testing.

The root has 63 public components and 31 accepted entries in the 132-entry Nuxt
inventory. The remaining 101 entries are partitioned below. Required entries may already
have partial implementations; inspect them before creating duplicates.

The last complete root check passed 818 tests across 220 files, 100% coverage in all
four metrics for 457 executable files, and 236 Chromium scenarios. Package, source
policy, strict types, lint, schema freshness and MkDocs also passed. Evidence:
specs/verification/parallel-catalog.md and .cache/parallel-check-stable.log. Root
acceptance is distinct from snapshot work.

## Exact catalog ownership

Assignment applies to Required entries in specs/catalog/nuxt-ui.md at this checkpoint.
Family ownership also covers its component documentation, examples, schemas, private
renderer/adapter helpers and colocated tests.

| Owner | Family     | Remaining entries |
| ----- | ---------- | ----------------- |
| A     | Layout     | 2                 |
| A     | Navigation | 6                 |
| A     | Overlay    | 5                 |
| A     | Page       | 23                |
| A     | Dashboard  | 10                |
| A     | Content    | 5                 |
| B     | Element    | 8                 |
| B     | Form       | 16                |
| B     | Data       | 5                 |
| B     | AI Chat    | 9                 |
| B     | Editor     | 6                 |
| B     | Color Mode | 5                 |
| B     | i18n       | 1                 |

Agent A owns 51 remaining entries. Agent B owns 50. Every remaining inventory entry has
exactly one owner. This balances entry counts; implementation costs differ. A
additionally owns shared integration and the final combined gates.

Calendar, FieldGroup and the shared date/locale foundation belong to B. AuthForm belongs
to A and consumes B's Form/Input contracts. A and B must agree on those interfaces
before introducing breaking changes. Existing verified components remain the
compatibility baseline, regardless of family ownership.

## Agent A: root implementation and integration

Work in the root checkout. Start by importing and accepting the ready five-entry Page
composition batch, then continue Page, Layout and Dashboard work. Complete Navigation,
Overlay and Content contracts and their acceptance requirements.

A is the sole writer of these root-wide files and areas:

- Public component catalog, name list and root export barrels.
- Central shadcn registry composition and exhaustive conformance fixtures.
- Recursive generative unions, visitors, action and binding dispatch.
- Shared state kinds, registry infrastructure and provider contracts.
- Global style imports, template variables and application theme infrastructure.
- Demo family mounts, shared browser configuration and package fixtures.
- MkDocs navigation, general guides, README and verified catalog status.
- Root package manifests/lockfile, tooling, quality gates and CI configuration.

B may propose changes to these files in B's snapshot. A reviews and merges each addition
deliberately; whole-file replacement is prohibited.

## Agent B: independent implementation

Use a fresh isolated snapshot at .cache/workspaces/fork-b, created from the current root
source. Do not use an old worker snapshot as the new baseline. Those snapshots predate
several root RTL and navigation corrections.

Do not edit root source while A integrates. Use explicit command workdirs and absolute
paths for edits: conversation forks can share the same filesystem. Do not copy .git,
node_modules, .cache, build output or virtual environments into the fresh source
snapshot. Install dependencies inside B's own snapshot when needed. Never run npm
install through a node_modules symlink to the root.

B can change local snapshot aggregates to compile and test independently. Root
aggregates remain A-owned. Keep B's test cache and browser ports separate.

Recommended sequence:

1. Reuse the ready InputTags batch and finish Tree's open preflight review.
2. Specify and implement Calendar, InputDate and InputTime together.
3. Complete remaining Form/Element and Data entries, including existing partials.
4. Implement AI Chat, Editor, Color Mode and LocaleSelect with closed APIs.
5. Deliver each completed small batch with its own docs and acceptance evidence.

B owns its public reference pages and compiled examples. A merges MkDocs navigation and
general guides. Neither agent puts internal specs in docs/.

## Preserve and reuse pending work

None of these batches has been imported into the root or marked Verified. Do not delete
.cache/workspaces or assume it contains disposable build output.

### A: Page composition

Source: .cache/workspaces/layout. Detailed path manifest and integration notes:
.cache/workspaces/layout/specs/integration/layout.md.

Ready modules: PageAside, PageBody, PageColumns, PageGrid and PageList. The ledger lists
70 new paths plus modified shared files. Import assigned new modules only. Own coverage
is 100%; root browser/package/combined acceptance remains pending. The next Page
presentation batch was started in that snapshot and is unfinished. Do not include it
accidentally when importing Page composition.

### B: InputTags

Source: .cache/workspaces/forms. Detailed path manifest and integration notes:
.cache/workspaces/forms/specs/integration/forms.md.

The ready InputTags batch passed 46 scoped unit tests, 100% coverage of twelve owned
files, strict types/lint and ten snapshot Chromium scenarios. It uses the existing
selection state kind; no new dependency is needed. Import its listed new paths, not old
InputNumber/PinInput/InputRating or root aggregate copies.

### B: Tree and started chat work

Frozen Tree review copy: .cache/workspaces/feedback/.cache/batches/tree/files/. Its
manifest is .cache/workspaces/feedback/.cache/batches/tree/manifest.txt.

The frozen batch has 19 focused passing tests and 100% owned runtime coverage, but an
open root review must be resolved before acceptance: core/tree-budget.ts enqueues entire
arrays before checking node count, and nested arrays do not advance depth. Bound array
sizes and invalid array nesting before allocation; add failing regressions, then restore
full coverage. This fix was requested but was not present when the workers were
interrupted.

Live feedback snapshot: .cache/workspaces/feedback. AI Chat was started after freezing
Tree. Inspect unfinished files separately; do not treat them as ready.

## Dates: proposals still awaiting implementation review

B's worker proposed date/time single values as canonical ISO strings or null, and range
values as start/end DTOs with incomplete editing allowed. Proposed state kinds are date,
time, dateRange and timeRange. No central kinds were added. Finalize invariants and
partial/committed range rules in specs before coding.

Reference dates must come from the host, locale defaults must be explicit, and SDK
classes must never enter public props or JSON. Avoid ambient clock/timezone defaults
that change SSR markup at hydration.

Dependency proposals, not centrally installed or approved as final choices:
react-day-picker 10.0.2, react-aria-components 1.22.1 and @internationalized/date
3.12.4. Recheck primary sources and compatibility before adoption. B may test locked
changes in its own dependency installation; A merges the final reviewed manifest/lock
changes into the root at a batch boundary.

## Cross-fork delivery protocol

Use single-writer filesystem inboxes if direct agent messaging is unavailable:
.cache/coordination/agent-a/ and .cache/coordination/agent-b/. Each agent writes only
its own status, requests and delivery manifests. Check the other inbox between batches.
Do not edit the other agent's source or status.

For each B delivery, freeze a copy under
.cache/workspaces/fork-b/.cache/batches/<batch>/files/ and supply:

- Exact new paths and separately listed modifications to existing files.
- Exact proposed changes to root aggregates and shared state contracts.
- Requirement IDs, exported API/schema names, dependencies and behavior limits.
- Scoped types, lint, unit coverage and real browser/SSR evidence.
- Any remaining failures or unresolved review findings.

A imports reviewed component-owned paths, merges shared changes, regenerates schemas,
and runs complete root checks. Only A updates root inventory entries to Verified after
the integrated acceptance succeeds. B begins its next batch in its snapshot while A
verifies the frozen delivery.

## Operational cautions

- No commit, push, publication, deployment or DNS changes are authorized.
- Most enterprise source is untracked. Never use git clean/reset as cleanup.
- Obey AGENTS.md: 300 lines, 88 columns, two spaces, English and strict types.
- Do not lower 100% per-file coverage or hide executable runtime code.
- Root browser verification owns 4173. Reserve separate worker dev ports.
- Use isolated Vitest fsModuleCachePath values when sharing installed packages.
- Root App scopes both Base UI and Radix direction providers.
- Use provider-derived direction attributes for physical CSS effects: the CSS optimizer
  rewrites :dir selectors into incorrect language approximations.
- Preserve the captured Pagination URL and false-return navigation veto.
- Keep native form bridges positioned; their RTL translations caused overflow.
- Generic recursive node interfaces must be listed directly in GenerativeNode; wrapping
  the recursion in an intermediate union alias fails under TypeScript 7.

Full project acceptance still requires all 132 inventory entries, complete documentation
and combined checks. Neither this plan nor a ready snapshot means the enterprise goal is
complete. The original goal remains paused until resumed.
