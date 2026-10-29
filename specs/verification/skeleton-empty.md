# Skeleton and Empty acceptance

Date: 2026-10-29. Scope: SKELETON-001 through SKELETON-005, EMPTY-001 through
EMPTY-006 and RENDER-014 loading-status semantics. These two entries are accepted.
The public catalog now has 45 components, with 13 individually accepted Nuxt
entries. Full acceptance of the 132-entry inventory remains outstanding.

## Requirements and evidence

| Requirement | Evidence |
| ----------- | -------- |
| SKELETON-001 | Own strict schema, Props/function, closed negative type tests |
| SKELETON-002 | Decorative/status distinction, visibility and no focus target |
| SKELETON-003 | Three shapes/sizes, line limits, finite and reduced motion |
| SKELETON-004 | shadcn recipe, read binding, constrained host state, hydration |
| SKELETON-005 | Exact adapter mapping, portable/packed/docs/browser checks |
| EMPTY-001 | Own strict contract and safe leading/body/actions/footer |
| EMPTY-002 | Named region, description, busy content and real action callbacks |
| EMPTY-003 | Five surfaces, three sizes, long content, RTL and 200% text |
| EMPTY-004 | Header/media/content recipe, child state retention, hydration |
| EMPTY-005 | Every slot visited, missing actions rejected, boolean read state |
| EMPTY-006 | Complete adapter, types, coverage, package, docs and browser matrix |
| RENDER-014 | Live loading messages remain outside permanently busy subtrees |

Schemas, negative type assertions, adapters, generative bindings, hydration and
documentation examples have colocated tests. Independent JSON Schema validation
checks the portable shape; semantic validation checks references, permissions and
shape/line relationships. Both components render through the existing adapter.

`demo/e2e/skeleton-empty.spec.ts` adds 20 Chromium cases. Sixteen geometry cases
cover both templates at 240, 320, 375, 600, 768, 1024, 1440 and 1920 widths.
They exercise all shapes/sizes, five Empty surfaces, long messages, RTL, 200% text
and visibility. Two flows exercise keyboard recovery actions and state retention
across loading/appearance changes. Two cases measure finite animation duration,
reduced-motion preference and decorative/status switching.

## Complete local check

Evidence: `.cache/skeleton-empty-check.log`, terminal exit 0.

- Source policy, architecture and application boundaries pass.
- Strict TypeScript 7 and typed lint pass.
- Both portable schemas and generated examples are current.
- 540 tests in 115 files pass.
- 317 measured executable files have per-file 100% coverage in all four categories.
- Totals: 1934 statements, 1203 branches, 538 functions and 1795 lines.
- Production library CSS, declarations, JavaScript and demo build.
- Packed TSX/negative fixtures, Node SSR, state and public exports pass.
- All 134 Chromium scenarios pass.
- Strict MkDocs passes; both new local reference pages return HTTP 200.

Coverage scope and thresholds remain unchanged. Empty declaration/barrel files
are reported separately by the coverage tool. The existing demo bundle-size warning
remains tracked in the enterprise acceptance list; this work does not claim to fix it.

## Reproduced corrections

- Existing workbench checks assumed only one status anywhere on the content page.
  Adding a separately named Skeleton exposed that broad query. Assertions now
  identify the table's own exact message while still requiring status semantics.
- A long Popover example test covered configuration, editing and retained-dialog
  lifecycle in one case. It now has three behavior-focused cases with unchanged
  assertions and timeouts. Unit and browser checks run sequentially in the full gate.
- The initial loading status was itself aria-busy, and Empty's region marked its
  live message busy through an ancestor. Focused regressions failed before correction
  in `.cache/loading-status-before.log`. Skeleton no longer defers its own status.
  Empty marks only its body busy, keeping the loading message outside that subtree.
  The shared Spinner renderer also no longer marks its own message permanently busy.

The semantic correction follows WAI-ARIA 1.2's aria-busy guidance: assistive
technology may defer owned changes until busy becomes false. This is markup and
browser evidence, not a claim that every screen reader combination was exercised.
Reference: https://www.w3.org/TR/wai-aria-1.2/#aria-busy

Nuxt references are cached with SHA-256 values:

- Skeleton: `30a32ec754eca81e4c9946516d9a65a62cd383eab30e19c9049016d3efe97a9f`.
- Empty: `2193047e120214ab9ffd774100e49083bfede43795b05227642b74a2e854ae21`.

Recipe URLs, owned adapter paths and shadcn hashes are recorded in
`catalog/shadcn-provenance.json`. The source placeholders never expose arbitrary
HTML, CSS, icon values or vendor slots to applications.

## UI direction and delivery gate

Established technical component catalog for application developers. ENERGY 1 /
RHYTHM 2 / MOTION 1. The placeholder and recovery region are the focal points.
Existing green identifies actions; token spacing groups fields and results. Motion
only communicates loading and stops within 4.5 seconds. Monospace remains for source.

- R-02 PASS: English interface copy uses plain punctuation.
- R-03 PASS: 16 geometry cases check long content, eight widths, RTL and 200% text.
- R-17 PASS: sample action counts derive from local state, not promotional claims.
- R-18 PASS: no testimonials or invented customers were introduced.
- R-23 PASS: existing catalog navigation, name and templates remain in place.
- R-24 PASS: new MkDocs navigation and snippets build; local pages return 200.
- R-25 PASS: surfaces and text use validated template pairs in every variant.
- R-26 PASS: controls, recovery actions, help, fields and visibility are exercised.
- R-27 PASS: the additions directly demonstrate loading and empty states.
- R-28 PASS: no filler FAQ was introduced.
- R-32 PASS: keyboard recovery actions and existing focus handling pass.
- R-33 PASS: all changes live in maintained TSX, schema, renderer and adapter source.
- R-34 PASS: both template profiles pass the matrix and retain edited state.
- R-35 PASS: production build and all 134 browser scenarios pass locally.
- R-36 PASS: no certification or unmeasured performance claims were introduced.
- R-37 PASS: work extends the established technical catalog direction above.
- R-38 PASS: identities and action counts are explicitly local example content.
- R-39 PASS: named controls, visible labels, status semantics and motion are checked.
- R-40 PASS: no media assets, remote scripts or performance figures were added.
- R-01 PASS: no decorative gradients or glows were introduced.
- R-04 PASS: the sample uses an explicitly labeled Avatar fallback, no new icon set.
- R-06 PASS: monospace retains its source-code purpose.
- R-07 PASS: no decorative background grid or blueprint was added.
- R-08 PASS: action labels describe operations without decorative arrows.
- R-09 PASS: no promotional badge or duplicate title pill was added.
- R-10 PASS: surfaces are solid; no glass effect was introduced.
- R-12 PASS: the empty region uses a border rather than a large decorative shadow.
- R-13 PASS: no decorative glow was added.
- R-14 PASS: fields and recovery content determine each preview's structure.
- R-19 PASS: loading pulse is finite, optional and disabled by reduced motion.
- R-22 PASS: no stock illustration was introduced.
- DIALS PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 retained.
- FOCUS PASS: current placeholder and empty recovery region are clear focal points.
- SPACE PASS: design-token gaps separate settings, content and actions.
- ACCENT PASS: existing primary action color is retained.
- IDENTITY PASS: editable settings and executable previews define the catalog.
- READ PASS: the technical-catalog design read is recorded above.
- C-1 PASS: placeholder shapes and recovery slots follow component purposes.
- C-2 PASS: every enabled preview action changes actual local state.
- C-3 PASS: sections demonstrate the requested component contracts.
- C-4 PASS: data retention, keyboard, viewport and motion checks pass.
- C-5 PASS: no fictional customer or compliance evidence appears.
- R-05 PASS: additions are component references, with no marketing filler layout.
- R-11 PASS: component radii use established tokens; only avatar placeholders circle.
- R-15 PASS: actions name recovery operations and local examples.
- R-16 PASS: copy describes behavior without promotional AI language.
- R-20 PASS: executable declarations and previews have a product-specific purpose.
- R-21 PASS: both existing light profiles remain explicit choices.
- R-29 PASS: colors come from validated template tokens.
- R-30 PASS: additions extend the existing catalog rather than cloning a site.
- R-31 PASS: typography, spacing and surfaces reuse the established design system.

Inspected screenshots: `.cache/skeleton-desktop.png`, `.cache/skeleton-mobile.png`,
`.cache/empty-desktop.png`, `.cache/empty-mobile.png`. Mobile uses 200% text.
No text escapes or overlaps; recovery controls remain visible and wrap in their panel.

No commit, push, package publication, deployment, hosting or DNS change was performed.
