---
reacd_example: Counter
---

# Counter

One Jotai atom drives a text value and two actions. Click **Increment**, switch the
adapter, then click **Reset**. Changing appearance keeps the application value.

<!-- reacd-live-preview -->

## Source

Render `CounterExample` inside the `ReacdProvider` shown in
[Get started](../getting-started.md). The preview provides that same boundary.

```tsx
--8<-- "examples/recipe-counter.tsx"
```

`useAtom` reads the provider's store. The atom definition can be shared by multiple
instances while their provider roots keep independent values. See
[State with Jotai](../guides/state.md) for application state ownership.
