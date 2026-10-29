# Agent B Element foundations

Status: owned implementation and focused acceptance complete. Browser matrix and full
combined acceptance remain pending. No root inventory status was changed.

## Contracts and integration

Requirements: ICON-001/002, BUTTON-001/002, BADGE-001, CARD-001/002, ALERT-001/002/003,
PROGRESS-001/002/003 and ELEMENT-001 in specs/components/element-foundations.md.
Existing named Props and function signatures remain compatible. No dependency was added.

- Add Icon/IconProps from components/icon/index.ts to catalog/name list/public exports.
- Spread elementEntries from adapter/shadcn/registry/element.ts into the adapter and
  ELEMENT_EXAMPLES from **tests**/element-examples.tsx into conformance fixtures.
- Spread elementVariables() into template variables; import styles/elements.css.
- Mount ElementFoundationsExample from docs/examples/element-foundations.tsx in Actions.
  It contains six compiled examples and an editable long-content stress preview.
- Add the six component reference pages to MkDocs navigation.
- Add iconNodeSchema and alertNodeSchema as transport leaves. Replace the old inline
  Progress leaf with schema/progress/generative.schema.ts's progressNodeSchema.
- Declare CardNode<GenerativeNode> directly in the recursive union and use
  cardNodeSchema(child). Remove Card from the simple Stack alias. Traverse header,
  children and footer for validation, actions, state and rendering.
- Delegate Alert action discovery to alertNodeActionReferences. Register boolean
  read/readWrite visibility bindings. GenerativeAlert({node, registry, actions}) handles
  visibility/actions; GenerativeIcon({node}) enforces image alternatives.
- Preserve Button loading/icons in its generative state view.
- Bound Progress accepts number/nullableNumber readers with
  boundedProgressValueSchema(max). Preserve max/description/showValue and distinguish
  null from object bindings in every dispatcher and validator.

The parent integrated these shared proposals in B's snapshot. This worker edited no
shared aggregate or obsolete 0.1 transport. Never replace newer aggregates wholesale.

## Exact paths

Machine-readable .cache/elements-owned.json lists 98 owned paths. The exact changed
paths, separate new/modified status and SHA-256 values are in
.cache/elements-changes.json: 72 new and 11 modified paths at this checkpoint, excluding
this additional internal metadata note. Unchanged owned paths are not delivery changes.

Modified owned paths:

```text
docs/components/button.md
src/adapter/shadcn/alert/alert.adapter.tsx
src/adapter/shadcn/badge/badge.adapter.tsx
src/adapter/shadcn/button/button.adapter.tsx
src/adapter/shadcn/card/card.adapter.tsx
src/adapter/shadcn/progress/progress.adapter.tsx
src/schema/alert/alert.schema.ts
src/schema/badge/badge.schema.ts
src/schema/button/button.schema.ts
src/schema/card/card.schema.ts
src/schema/progress/progress.schema.ts
```

New production modules cover Icon, named core policies, Progress state derivation,
recursive Card transport, Alert/Icon/Progress transport, guarded Alert actions and
bindings, and trusted icon/element styling. Every new module, test, reference page,
compiled example and browser file is enumerated in the machine-readable manifest.

## Evidence

2026-10-29:

- .cache/elements-before.log and .cache/elements-behavior-before.log capture failing
  acceptance before schema and adapter behavior changed.
- .cache/elements-coverage.log: 61 passing focused tests across 37 files. Coverage
  includes activation/protection, every semantic icon, Card slots/empty content,
  controlled Alert actions/visibility, custom maxima/indeterminate Progress, strict
  props, consumer types, SSR/hydration, template/state retention and stale actions.
- .cache/elements-coverage/coverage-summary.json: all 42 nonempty owned runtime files
  have 100% statements, branches, functions and lines. Totals: 146 statements, 142
  branches, 56 functions and 138 lines. Global includes/thresholds were unchanged;
  focused execution exits nonzero for unrelated unexercised files and is not claimed as
  a full-snapshot coverage pass.
- .cache/elements-lint.log: explicit no-ignore type-aware owned-file lint passes.
- Owned source checks pass: at most 300 lines, at most 88 columns, two spaces, no tabs.
- Production types pass. The full type run reached an unrelated in-progress InputDate
  test matcher error; combined types remain the parent gate.
- demo/e2e/elements.spec.ts has ten browser scenarios pending parent execution. Both
  templates run at four widths with long labels, 200% text, actual scoped RTL, target
  dimensions, progress-fill geometry and keyboard/loading/slot/action interactions.

Schema acceptance is not browser evidence. Focused coverage is not full enterprise
acceptance. Root Verified status remains the integrator's responsibility.

## Primary references

Six upstream Nuxt component sources were retrieved from the official nuxt/ui v4
repository. Source URLs, cache paths and SHA-256 hashes are recorded in
.cache/elements-upstream.json; each source is cached as
.cache/references/element-<component>-nuxt.vue. Official shadcn Alert/Button/Progress
documentation and the already-pinned vendor sources informed the adapter composition.
Closed API adaptations and unsupported escape hatches are explicit in the spec/docs.
