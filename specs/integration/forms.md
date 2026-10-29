# Form catalog integration

## Ready modules: InputNumber, PinInput, InputRating

- InputNumber: `components/input-number/index.ts`, `inputNumberSchema`,
  `ShadcnInputNumber`.
- PinInput: `components/pin-input/index.ts`, `pinInputSchema`, `ShadcnPinInput`.
- InputRating: `components/input-rating/index.ts`, `inputRatingSchema`,
  `ShadcnInputRating`.

Each schema is under `src/schema/<name>/<name>.schema.ts`. Adapters are under
`src/adapter/shadcn/<name>/<name>.adapter.tsx`. Each public module exports its own named
Props type and named function with explicit ReactNode return.

CSS imports required in `src/renderer/styles.css`:

```css
@import './styles/input-number.css';
@import './styles/pin-input.css';
@import './styles/input-rating.css';
```

These files use existing control-target, border-width, focus-width, palette, radius, and
small spacing tokens. No template-variable additions are needed. NumberField comes from
pinned Base UI. PinInput uses pinned input-otp 1.5.0, which is the primitive documented
by shadcn's Input OTP recipe.

## Generative transport

- `inputNumberNodeSchema` is in `schema/input-number/generative.schema.ts`.
- `pinInputNodeSchema` is in `schema/pin-input/generative.schema.ts`.
- Both schemas expose `value: stateBindingSchema` with read/readWrite access.
- `BoundInputNumber({node, registry})` targets nullableNumber state.
- `BoundPinInput({node, registry, actions})` targets text state.
- `inputRatingNodeSchema` is in `schema/input-rating/generative.schema.ts`.
- `BoundInputRating({node, registry})` targets number state, constrained through
  `ratingValueSchema(node.length, node.step)` from schema/input-rating.
- Read bindings force readOnly; shared writers remain guarded by range or
  alphabet/length constraints. InputNumber clears to null without coercion.
- PinInput's optional `completeAction` names a registered host action. Include it in
  `nodeActionReferences` under property `completeAction`.
- Completion occurs after the text-state write and receives `{state: registry}`. Neither
  JSON nor TSX exposes native events, styling, or markup escapes. Rejected shared-state
  writes do not dispatch completion actions.

Transport fixtures and acceptance tests live in
`state/generative-ui/numeric-pin-transport.test.tsx`. Bound-state failure, permissions,
host-write constraints and hydration tests are colocated nearby.

## Documentation and browser integration

- Public reference pages: `docs/components/<name>.md` for each ready entry.
- Runnable previews: `InputNumberExample`, `PinInputExample`, and `InputRatingExample`
  in matching `docs/examples/<name>.tsx` files, with colocated interaction tests.
- The previews require a ReacdProvider and use isolated Jotai stores.
- Each preview has a scoped App direction toggle. Browser checks verify computed field
  direction and mirrored rating pointer/keyboard behavior, rather than a document
  attribute masked by an explicitly LTR ancestor.
- Numeric preview label: Quantity; controls: Increase Quantity, Decrease Quantity, Clear
  quantity, Read-only quantity.
- PIN preview label: Verification code; controls: Submit code, Mask code, Clear code.
  Masking does not copy secrets into completion feedback.
- Rating preview label: Service rating; controls: Clear Service rating, Save rating,
  Read-only rating. Empty required submission focuses the slider.
- Browser acceptance remains for central integration: keyboard modifiers, required-form
  validity, native selection/paste, 360px containment, 200% text, both templates, and no
  hydration errors. Unit coverage is not browser proof.

## Verification checkpoint

2026-10-29: 95 focused tests across nineteen files pass. Unchanged global coverage
includes were retained; every production file owned by these three entries, bindings,
and preview examples measured 100% in all four categories. Focused coverage exit status
is nonzero because unrelated production families were not exercised, rather than a
threshold exclusion or reduction.

Reports: `/tmp/reacd-forms-coverage/coverage-summary.json` and
`/tmp/reacd-forms-coverage/coverage-final.json`. Full project checks, generated schema
freshness, packaging, and browser conformance remain central checks.

## Next batch

InputTags is next, requiring controlled unique text tokens, validation, composition-safe
entry, removal, paste, and selection state. Implementation is deferred until the
coordinated project gate concludes. Contracts and tests precede each implementation.
Remaining Form entries retain Required status until individually verified against their
upstream behavior.
