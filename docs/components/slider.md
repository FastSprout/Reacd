---
template: preview.html
reacd_preview: Slider
reacd_preview_height: 560
---

# Slider

Declare a controlled finite number or an explicit ordered interval. The engine owns
thumb layout, direction, keyboard interaction and theme styling.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/slider.tsx"
```

```tsx
<Slider
  label="Volume"
  value={volume}
  min={0}
  max={100}
  onValueChange={setVolume}
/>
<Slider
  mode="range"
  label="Price"
  value={price}
  min={0}
  max={100}
  onValueChange={setPrice}
/>
```

Range values are readonly `{ start, end }` objects, with equal endpoints allowed. Both
endpoints must be finite, ordered and within min/max. Minimum must be less than maximum.
The callback proposes exactly one number or frozen interval. SDK arrays and events stay
inside the adapter. A host may decline a proposal without changing visible form values.

The default step is one. Page keys move ten steps, bounded by the total interval. Arrow
keys follow App direction; vertical arrows increase upward. Home/End reach the valid
endpoint limits. Range thumb identities do not swap or push each other when they meet.
Initial supported values are preserved even when they do not align exactly with step.
Editing uses a step grid starting at min; the first edit can align an off-grid value.

Slider supports numbers exactly representable with at most twelve fraction digits.
Unsupported precision is rejected instead of silently rounding values. This is the
Slider adapter's supported numeric domain; general numberRange state remains
unrestricted. The interval span and its percentage/step arithmetic must remain finite.
When step is smaller than the span, it must advance both bounds in JavaScript number
arithmetic. Zero/subnormal steps and large intervals with unrepresentable increments are
rejected.

`readOnly` retains focus and native values but rejects editing proposals. `disabled`
prevents interaction and omits data. Named single controls serialize their number; named
ranges serialize `name.start` and `name.end`. FormField supplies names, descriptions,
errors and inherited disabled state. Required has no empty-state rule because Slider
values are always present in the public contract.

`orientation="vertical"` uses a policy-owned extent. All dimensions, focus indicators,
track and thumb styling belong to the adapter. Application code needs no CSS.

Run the compiled [Slider example](../examples/slider.tsx) in the component preview.

Generative single mode binds number state; range mode binds numberRange. Read references
force read-only. Current min/max also constrain external registry writes. Each SSR
request uses its own store and explicit numeric locale; schema validation does not prove
layout.
