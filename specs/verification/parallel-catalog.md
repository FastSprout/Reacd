# Parallel catalog acceptance

Date: 2026-10-29. Scope: 18 new public components, their closed contracts, generative
bindings, shadcn integration, examples and browser acceptance. The enterprise goal
remains active: 63 public components and 31 individually accepted Nuxt entries do not
complete the required 132-entry inventory.

## Accepted components

- Structure: App, Container, Error, Footer, Header, Main, Separator and Theme.
- Fields: InputNumber, PinInput and InputRating.
- Feedback and data: User, ProgressGroup, Banner, Timeline and ScrollArea.
- Navigation: Breadcrumb and Pagination.

Each has its own schema, named inferred Props, named TSX function, shadcn
implementation, colocated tests, compiled example and public reference page. The adapter
registry and examples exactly cover all 63 current declarations. Accepted behavior
follows the documented closed reacd contracts and adaptations; this does not claim
Nuxt's low-level props or extension APIs are exposed.

## Combined verification

`npm run check` passed. Complete log: `.cache/parallel-check-stable.log`.

| Measurement                            | Result                |
| -------------------------------------- | --------------------- |
| Unit tests                             | 818 across 220 files  |
| Executable files                       | 457 fully covered     |
| Statements                             | 2,651 / 2,651         |
| Branches                               | 1,800 / 1,800         |
| Functions                              | 758 / 758             |
| Lines                                  | 2,461 / 2,461         |
| Chromium                               | 236 passing scenarios |
| TypeScript, lint, source policy        | Passed                |
| Generated schema and example freshness | Passed                |
| Library, CSS, demo and bundle budget   | Passed                |
| Packed consumer and negative fixtures  | Passed                |
| Strict MkDocs                          | Passed                |

Full coverage includes all owned runtime, examples, tooling and nine CLI entry points.
Thresholds and executable-file exclusions were not weakened.

## Behavioral evidence

Generative acceptance checks typed keys, read/write permissions, nullable numeric state,
isolated stores, atomic rejected writes, nested slot action validation and
SSR/hydration. Completion actions run only after accepted PIN writes.

Browser suites exercise both token profiles, narrow containers, enlarged text, long
content, actual scoped RTL, native forms, clipboard paste, scrolling, pointer and
keyboard selection, dialog modes, focus trapping and restoration.

Real URL tests caught synchronous state updates changing a link's destination before
browser activation. Pagination now captures the activated URL, preserves modified-click
behavior and vetoes navigation after rejected state writes. The failing test is recorded
in `.cache/parallel-fixed-browser.log`; the combined passing run includes both accepted
and rejected URL navigation.

Real browser tests also caught vendor form-bridge inputs escaping their containing
blocks in RTL and a CSS optimizer replacing direction selectors with language fallbacks.
Scoped bridge positioning and provider-derived direction attributes fix these behaviors
without global overflow hiding or language assumptions.

Snapshot workers use independent source/output directories and module caches. Their
pending code is reviewed and imported before root acceptance. An earlier shared-cache
ENOENT was infrastructure interference, not an ignored source error.

## Visual delivery gate

Established direction: technical component catalog, ENERGY 1 / RHYTHM 2 / MOTION 1.
Named interactive previews are focal points; spacing separates controls from results.
Existing validated template colors identify actions and selected state.

- R-02 PASS: maintained additions use ordinary punctuation.
- R-03 PASS: browser geometry checks narrow widths, long text and 200% scaling.
- R-17/R-18/R-36/R-38 PASS: examples are named samples; counts come from test logs.
- R-23 PASS: no new visual assets or fictional endorsements were introduced.
- R-24/R-26 PASS: navigation targets and callbacks are exercised by real actions.
- R-25 PASS: colors reuse validated contrast-checked token profiles.
- R-27 PASS: empty, loading, disabled, read-only and rejected-write states pass.
- R-28 PASS: no filler FAQ was introduced.
- R-32/R-39 PASS: native names, keyboard, focus, targets and form behavior pass.
- R-33 PASS: implementation lives in maintained source modules.
- R-34 PASS: both existing token profiles pass the browser suites.
- R-35 PASS: production build, package and 236 browser scenarios passed.
- R-37 PASS: the existing approved technical-catalog direction is retained.
- R-40 PASS: bundle sizes are measured; no transfer-time or startup claim is made.
- PURPOSE PASS: stars encode rating; arrows encode path/disclosure direction; surfaces,
  typography and spacing identify component boundaries and state.
- LIVELINESS PASS: named previews, controlled state and one template action accent
  retain the established hierarchy and interaction rhythm.
- C-1/C-2/C-3 PASS: every added region demonstrates a concrete supported contract.
- C-4 PASS: real containment, focus, state and directional regressions are covered.
- C-5 PASS: all implementation counts and acceptance claims have local evidence.
- R-05/R-11/R-15/R-16 PASS: no marketing filler or promotional copy was added.
- R-20/R-21/R-29/R-30/R-31 PASS: existing identity, profile choice, palette and
  component-system rules remain in use.

Coverage proves execution of measured code, not universal visual correctness. Browser
engines beyond the maintained Chromium configuration remain outside this record. No
commit, push, publication, deployment or DNS change was performed.
