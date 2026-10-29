---
template: preview.html
reacd_preview: ColorModeButton
reacd_preview_height: 560
---

# ColorModeButton

A controlled toggle button that requests the opposite resolved palette. Its visible
label stays stable; pressed state means the resolved palette is dark.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-mode.tsx"
```

```tsx
<ColorModeButton
  label="Dark appearance"
  value={preference}
  resolvedMode={resolvedMode}
  onValueChange={setPreference}
/>
```

`value` is light, dark or system. `resolvedMode` is explicitly light or dark. Explicit
preferences must agree with the resolved mode. Clicking requests exactly one preference
value and never passes a DOM event. The host can reject that request.

Optional `description` supplies accessible supporting text. `disabled` prevents focus
and activation. `readOnly` keeps the button focusable while preventing changes.

Use `useColorMode(systemMode)` inside ReacdProvider for isolated Jotai preference state.
Apply the resulting palette through Theme or ReacdProvider. Optional
`useSystemColorMode(serverFallback)` observes the device after hydration; the explicit
fallback stabilizes server markup. No document mutation or persistence is implicit.

The compiled [color-mode example](../examples/color-mode.tsx) uses both template
profiles and their exported `darkTemplateVariants`. Applications can provide their own
complete validated templates. Existing input state survives palette changes.

Generative value is a text binding with read/readWrite access. Required systemMode is a
light/dark literal or read text binding. The bridge computes resolvedMode automatically.
