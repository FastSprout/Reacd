# Demo loading and bundle acceptance

Date: 2026-10-29. Scope: BUNDLE-001 through BUNDLE-007 and CLI-007. This closes
the tracked demo chunk warning and adds production artifact/loading acceptance.
The current public catalog remains 45 components, with 13 individually accepted
Nuxt entries. The full 132-entry enterprise inventory remains outstanding.

## Requirements and evidence

| Requirement | Evidence |
| ----------- | -------- |
| BUNDLE-001 | Module-level literal lazy imports; synchronous packed SSR still passes |
| BUNDLE-002 | Named loading state, isolated error boundary and real reload link |
| BUNDLE-003 | One outer store; fields, JSON source and registry values survive tabs |
| BUNDLE-004 | Manifest parser, recursive JS inventory and 500,000-byte chunk gate |
| BUNDLE-005 | Separate static/full graph walks; dynamic entry and reachability tests |
| BUNDLE-006 | Four production request/lifecycle tests across both profiles |
| BUNDLE-007 | Full source/CLI coverage, package, browser and documentation checks |
| CLI-007 | Parse/read/stat/budget failures propagate; build stops on stage failure |

Tests are colocated with `demo/loading/`, `tooling/build/`, and the CLI runners.
Artifact cases cover malformed values, unsafe paths, missing entries/assets,
prototype-name references, broken edges, cycles/shared dependencies, static aliases
of deferred files, orphan assets, nested output and exact byte-limit acceptance.

`demo/e2e/module-loading.spec.ts` checks actual built asset URLs from the generated
manifest. Initial Layout rendering does not request unvisited families/playground.
A deliberately held Fields request exposes loading while appearance remains usable.
Fields and generated notes/source persist across navigation, with one module request
per visited view. An aborted Data request shows an isolated error; Fields still works.
The explicit reload resets unsaved state and recovers the once-failed module.

## Artifact measurements

The previous build reported a single demo JavaScript chunk of approximately
735.06 kB in `.cache/skeleton-empty-check.log`. The accepted build reports:

| Measurement | Uncompressed bytes |
| ----------- | ------------------ |
| Largest JavaScript chunk | 218754 |
| Initial static JavaScript graph | 687034 |
| Total emitted JavaScript | 739794 |
| JavaScript file count | 11 |

The artifact gate checks each file against 500,000 bytes without increasing Vite's
warning limit. Shared dependencies form named runtime/validation/control chunks;
five feature views are dynamic entries. The default Layout chunk loads on first
render after the shell; it is not part of the static graph measurement above.

Total emitted code includes split-module overhead. These numbers measure raw
artifacts, not compressed transfer, first paint, FPS or startup time. Shared adapter
dependencies remain in the initial graph to retain the existing synchronous host
contract. The observed improvement is bounded chunks and deferred feature modules.

## Complete local check

Evidence: `.cache/bundle-check.log`, terminal exit 0.

- Source limits, architecture, application boundaries, strict types and lint pass.
- Both portable schemas and generated examples remain current.
- 552 tests in 118 files pass.
- All four coverage categories are 100% per measured file across 323 files.
- Totals: 2012 statements, 1238 branches, 560 functions and 1861 lines.
- All nine CLI runners remain included in the unchanged coverage scope.
- Production CSS, declarations, JavaScript and demo build without a chunk warning.
- Bundle manifest and every recursively discovered JavaScript asset pass the gate.
- Packed TSX, negative compile fixtures, SSR, state and public exports pass.
- All 138 Chromium scenarios pass, including the four new loading/error flows.
- Strict MkDocs passes; the public getting-started guide explains local recovery.

No coverage ignore, timeout increase, assertion retry, warning-limit increase or
scope exclusion was introduced. Package exports and synchronous SSR are unchanged.

## UI direction and delivery gate

Established technical catalog for application developers. ENERGY 1 / RHYTHM 2 /
MOTION 1. Existing component previews remain the focal point. Loading uses the
accepted finite Skeleton pulse; errors use the existing Alert and Link. The shell,
navigation and appearance controls stay available. No new visual identity is added.

- R-02 PASS: new English loading/error copy uses plain punctuation.
- R-03 PASS: full browser geometry passes; inspected fallback frames also have no
  horizontal overflow at 1440/100% and 375/200% text.
- R-17 PASS: bundle figures come from actual artifact bytes and identify their scope.
- R-18 PASS: no testimonials or invented customers were introduced.
- R-23 PASS: existing catalog identity and navigation remain in place.
- R-24 PASS: reload points to the actual workspace root; MkDocs links still build.
- R-25 PASS: fallback UI uses existing contrast-validated Skeleton/Alert/Link tokens.
- R-26 PASS: appearance, navigation and reload recovery are exercised in Chromium.
- R-27 PASS: deliberately held and failed imports exercise loading and error states.
- R-28 PASS: no filler FAQ was added.
- R-32 PASS: existing keyboard/focus conformance remains in the full browser suite.
- R-33 PASS: changes are maintained TSX and build-tooling source.
- R-34 PASS: both profiles pass loading, state retention and reload flows.
- R-35 PASS: production build, bundle gate and all 138 browser scenarios pass.
- R-36 PASS: no unmeasured runtime-performance or certification claims are made.
- R-37 PASS: work extends the established technical catalog direction above.
- R-38 PASS: no fabricated product content or social proof was introduced.
- R-39 PASS: loading is named, errors are announced and recovery uses a real link.
- R-40 PASS: no media or remote scripts were added; artifact measurements are explicit.
- R-01 PASS: no decorative gradient or glow was added.
- R-04 PASS: no icon set or unrelated decorative icon was introduced.
- R-06 PASS: typography retains the existing technical/source hierarchy.
- R-07 PASS: no decorative background grid or blueprint was added.
- R-08 PASS: the recovery label has no decorative arrow.
- R-09 PASS: no promotional badge or duplicate title pill was introduced.
- R-10 PASS: fallback surfaces remain solid rather than glass effects.
- R-12 PASS: no large decorative shadow was added.
- R-13 PASS: no decorative glow was introduced.
- R-14 PASS: the error/loading layout follows its actual content.
- R-19 PASS: loading reuses the finite, optional, reduced-motion-safe pulse.
- R-22 PASS: no stock illustration was introduced.
- DIALS PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 retained.
- FOCUS PASS: the selected view's loading/error state remains the focal content.
- SPACE PASS: existing stack/token gaps separate navigation, feedback and recovery.
- ACCENT PASS: established action/error colors communicate their actual purpose.
- IDENTITY PASS: component declarations, previews and the workspace shell remain.
- READ PASS: the technical-catalog design read is recorded above.
- C-1 PASS: lazy boundaries follow independent catalog/playground modules.
- C-2 PASS: recovery performs real navigation; it does not promise a false retry.
- C-3 PASS: no section was added only to fill a page template.
- C-4 PASS: field/registry retention, error isolation and fallback bounds are checked.
- C-5 PASS: all reported measurements are reproducible artifact values.
- R-05 PASS: no marketing page template or filler layout was added.
- R-11 PASS: existing component radii remain unchanged.
- R-15 PASS: Reload workspace describes the operation and its data-loss consequence.
- R-16 PASS: copy describes loading/recovery without promotional AI language.
- R-20 PASS: the executable catalog/workbench retains its product-specific purpose.
- R-21 PASS: both existing profiles remain explicit choices.
- R-29 PASS: fallback colors use the existing validated template tokens.
- R-30 PASS: no external website design was cloned.
- R-31 PASS: typography, surfaces and spacing reuse the established component system.

Inspected `.cache/deferred-{loading,error}-{desktop,mobile}.png` frames. Their measured
viewport/scroll widths match exactly in `.cache/bundle-visual.log`. A temporary local
production preview was stopped after inspection. Primary API references are listed in
`specs/demo-bundles.md`; no source from those pages is copied into application markup.

No commit, push, publication, deployment, hosting or DNS change was performed.
