# Pricing delivery

Workspace: .cache/workspaces/layout. New inventory scope: PricingPlan, PricingPlans and
PricingTable. Frozen source and SHA-256 path manifest: .cache/batches/pricing/. Earlier
frozen batches remain immutable. No dependency or state-kind change is required.

Requirements: specs/components/pricing.md, PRICING-001 through 006. Reference examples
are explicitly illustrative; no commercial prices or availability claims are invented.

## Contracts

PricingPlan accepts explicit strings for price/discount/billing and safe content slots.
Discount requires an original price. Original price uses semantic strikethrough;
discount is the displayed replacement. Features are labels or uniquely keyed
title/leading records. Button is a safe component slot, never a raw vendor property bag.

PricingPlans accepts keyed plans and safe children. Compact controls template spacing.
Scale is an inherited default with per-plan override and stays in flow, avoiding
transforms or overlapping neighboring controls. Host order is preserved.

PricingTable requires caption, uniquely identified tiers/sections/features, and complete
feature-to-tier matrices. Missing/extra cells are rejected. Values are explicit boolean,
finite number or nonempty string. Boolean cells use Included/Not included words. All
physical limits and prominence factors are named core policies.

## Browser defects found and fixed

The caption originally moved with native table scrolling. The final visible caption
stays above the scroll region while the native accessible caption is visually hidden.
shadcn/styles.css explicitly includes Tailwind's sr-only utility: the vendor-only source
scan did not emit it automatically. Browser tests assert its actual one-pixel geometry
while still resolving the native table's accessible name.

Narrow RTL native keyboard scrolling could leave a focused button partially clipped.
Controls are now bounded to the scroll viewport using container query units and focus
clearance. Shared renderer/scroll helpers reveal the actual focused control after native
focus placement and scroll region-only arrow keys instantly by a core-owned step. Native
keys inside child controls remain untouched. Portals/outside controls and stale focus
are ignored. Tests require complete focused-button bounds, not partial visibility.

The visible caption and focused control were inspected in Compact 320px RTL screenshots.
Other columns intentionally remain in the named horizontal scroll region; document
overflow is forbidden. No application DOM mutation or CSS escape was introduced.

## Shared integration

Merge catalog/exports and pricingEntries; import pricing.css and pricingVariables(). Add
three direct recursive node interfaces and pricingNodeSchemas(). Visitor additions: plan
slots, feature leading arrays, synthesized keyed plans and each tier badge/button array.
PricingNodeView maps those declarations to the same closed TSX components.

To remain under 300 lines, the snapshot now uses the parent's same schema organization:
generative-node.ts owns direct recursive types; visit-nodes.ts owns traversal;
document.schema.ts owns factories and compatibility re-exports. Map only the three new
type/factory/visitor additions to the parent versions. Never replace those aggregates.

PageFamilyNodeView extracts the 22 Page/editorial/pricing cases into a closed type guard
and dispatch. GenerativeNodeView uses that guard before its remaining switch. This is an
optional integration shape: the parent can route its new pricing cases through its own
already-refactored dispatch. Do not include an unused runtime helper in root.

Mount PricingExamples outside SplitView; merge three references and runnable examples.
Preserve parent's pressHandler and zero-argument callback corrections. Pricing's native
key/focus handlers consume DOM events internally and never expose them to host
callbacks.

## Verification

- Full snapshot unit/consumer/SSR/CLI run: 298 test files, 959 passing tests.
- All 31 new/changed executable files in the pricing/infrastructure scope have 100%
  statements/branches/functions/lines; seven type-only/barrel files are empty.
- Covered totals: 265 statements, 248 branches, 83 functions, 253 lines. Report:
  .cache/coverage/pricing/coverage-summary.json.
- Strict types, actual lint, source policy, production build, packed consumer and strict
  MkDocs passed. Logs: .cache/pricing-{types,lint,policy,build,package,docs}.log.
- Final sixteen production Chromium cases pass across both templates, four widths
  (240/320/768/1440), scoped LTR/RTL and 200% text. Actual native keyboard scrolling,
  tab focus, full button containment, in-flow prominence, independent actions and
  retained Jotai values are verified. Log: .cache/pricing-browser.log.
- Visual evidence: .cache/pricing-{plan,table}-Compact-320-rtl.png.
- Preview server on 5176 stops with the tests.

### Separate verification-only delta

An existing Popover documentation journey timed out once under heavy full-suite load.
Its edit/save/close and independent nested/close flows are now separate tests,
preserving the original assertions and adding explicit waits for real popup removal. The
timeout was not raised. All four Popover reference tests and the final full suite pass.
docs/examples/popover.test.tsx is supplied as a separate proposed test-only
modification. No Popover runtime behavior was changed.

Root-wide coverage for all integrated files, generated-schema freshness and all browser
regressions remain the integrating agent's gate. Snapshot verification is not full
enterprise completion or proof of every browser/device combination.
