---
template: preview.html
reacd_preview: ColorModeSwitch
reacd_preview_height: 560
---

# ColorModeSwitch

A controlled switch for dark appearance. Checked means resolved dark mode. Activation
requests light or dark, even when the current preference is system.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-mode.tsx"
```

```tsx
<ColorModeSwitch
  label="Dark appearance"
  value={preference}
  resolvedMode={resolvedMode}
  onValueChange={setPreference}
/>
```

Required props are label, value, resolvedMode and onValueChange. The callback receives
exactly one preference value. Optional description, disabled and readOnly follow Switch
interaction semantics. Palette selection is separate from business form submission.

Jotai stores the preference through `useColorMode(systemMode)`. The host applies the
resolved template. For system changes, `useSystemColorMode(serverFallback)` preserves
SSR output and subscribes after hydration.

Generative UI uses a text value binding and an explicit systemMode literal/read binding.
Read access prevents changes. See the compiled
[color-mode example](../examples/color-mode.tsx) and
[ColorModeButton](color-mode-button.md) for template composition.
