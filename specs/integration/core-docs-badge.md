# Core reference examples and literal Badge transport

Date: 2026-10-29. All work remains local in fork-a. No acceptance metadata changed.

DOCS-014 adds 18 own TSX examples and colocated tests, 15 missing public reference
pages and supplements for Grid, Text and DataTable. Two small live group modules
and three direct family mounts use the exact documented sources. Interactive
values use application-scoped Jotai. Existing APIs and compatibility names remain.

The source audit maps all 132 Nuxt entries and 18 extension APIs in
specs/verification/catalog-traceability.md. It distinguishes integrated source,
eight pending native components and ten optional 0.2 helper transport gaps.
New reference coverage does not implement those ten transport types.

The audit found Badge absent from the 0.2 union despite existing TSX/adapter/docs.
BADGE-002 and GENSTATE-019 now specify literal noninteractive transport. The own
strict Badge node reuses label/intent/leadingIcon/size; its leaf and display route
add no state, callback, style or native attribute feature. The public whole-document
and portable-schema acceptance tests both failed before implementation and pass
afterward, including rejection of styling, native markup and label bindings.

The existing noImplicitReturns compiler option protects closed routers. An isolated
ReactNode-return negative fixture produces TS7030 for an omitted union case. No
router refactor, unreachable runtime branch or coverage suppression was introduced.

## Verification

- All four strict type projects, full typed lint and source policy pass.
- 26 tests across 20 files pass, including existing workbench unit journeys.
- All 21 owned modules are 100% in statements/branches/functions/lines:
  44 statements, 6 branches, 24 functions and 42 lines. No runtime exclusion changed.
- The production build and unchanged bundle budget pass: 13 chunks, 1682178 total
  JavaScript bytes, 1453820 initial static bytes and 432906 largest-chunk bytes.
- Packed TSX, negative fixtures, SSR, state and exports pass; strict MkDocs passes.
- Two complete 360px Chromium journeys pass with one worker, one per template.
  They operate the examples, then render a literal Badge through the live JSON editor.
- The first browser query matched the source editor text and rendered Badge span.
  The corrected exact text query preserves the intended assertion. Runtime code did
  not change between those runs; the original and final logs remain separate.

The initial core group import used hstack/vstack instead of the actual h-stack/
v-stack module paths. Strict types caught this before passing; those imports are
corrected. Example formatting stays within 300 lines/88 columns and two spaces.

The complete combined runtime/browser gate and final independent Standards/Spec
review remain pending. These scoped results do not mark any B inventory row Verified.
