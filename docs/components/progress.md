---
template: preview.html
reacd_preview: Progress
reacd_preview_height: 560
---

# Progress

Progress displays a current value relative to a maximum, or an explicit indeterminate
working state.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/progress.tsx"
```

Require a nonempty label. Optional value is a finite number between zero and max; null
or omitted value means indeterminate. Optional max is finite and positive, defaults to
100 and cannot exceed Number.MAX_SAFE_INTEGER. Invalid values are rejected, not silently
clamped. Optional description supplies associated help text.

Optional showValue defaults true. Determinate text shows the percentage relative to max
with at most two fractional digits. Indeterminate text says In progress. Hiding the text
preserves the progressbar's accessibility values.

Determinate progress exposes minimum, maximum and current values. Indeterminate progress
omits aria-valuenow. The fill follows logical inline direction in App RTL. It stays
inside the track and does not require animation to convey progress.

Generative 0.2 accepts literal values or read references to number/nullableNumber state.
Every reader contributes its max-aware constraint to shared writes. App and SSR stores
remain isolated. Arbitrary styles, HTML and vendor props are rejected.
