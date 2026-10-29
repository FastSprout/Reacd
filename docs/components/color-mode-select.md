---
template: preview.html
reacd_preview: ColorModeSelect
reacd_preview_height: 560
---

# ColorModeSelect

A controlled selector for system, light and dark preferences. The selected label is
available in server output before the option popup mounts.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-mode.tsx"
```

```tsx
<ColorModeSelect
  label="Appearance"
  value={preference}
  resolvedMode={resolvedMode}
  onValueChange={setPreference}
  labels={{ system: 'Device preference', light: 'Day', dark: 'Night' }}
/>
```

Required props are label, value, resolvedMode and onValueChange. Optional labels is a
closed complete system/light/dark object. Description, disabled and readOnly control
supporting text and interaction. Read-only users can inspect choices without changes.

Arrow keys, typeahead, Enter and Escape operate the themed popup. The callback receives
only the declared preference. The host owns acceptance, system resolution, persistence
and the validated template used for that preference.

Generative value uses read/readWrite text state. Required systemMode is a resolved
literal or read binding. Enum constraints also protect subsequent host writes.

See the compiled [color-mode example](../examples/color-mode.tsx).
