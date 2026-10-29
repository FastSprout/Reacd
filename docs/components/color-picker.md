---
template: preview.html
reacd_preview: ColorPicker
reacd_preview_height: 560
---

# ColorPicker

ColorPicker edits a host-controlled canonical color using a two-dimensional color area,
hue, optional alpha, labelled presets and hexadecimal entry.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-picker.tsx"
```

```tsx
<ColorPicker
  mode="rgba"
  label="Accent"
  value={color}
  onValueChange={setColor}
  name="accent"
/>
```

Choose mode explicitly: rgb accepts lowercase #rrggbb; rgba accepts lowercase #rrggbbaa.
A change requests only that string, never a native event or an SDK Color. Presets are
readonly { label, value } data with unique values matching the mode.

The area supports pointer/touch and two-dimensional keyboard changes. Hue and alpha
support keyboard navigation. The hexadecimal field permits a local partial draft; Enter
or blur commits a complete valid value. Escape restores the controlled value. Invalid
drafts stay local and native form validation focuses the field. Uppercase input
normalizes to lowercase on commit. Rejected changes preserve host values. The adapter
retains private achromatic hue while the canonical color remains unchanged.

The optional named native form value is the canonical string. Read-only retains it;
disabled omits it. Read-only leaves hexadecimal text available for copying and prevents
area, slider and preset changes. Labels and focus treatments follow the template;
selected swatches display color as business data. Functional gradients show the channel
space and do not style labels with the selected color.

App direction controls an explicit private locale scope, including actual slider
keyboard direction. SSR uses deterministic English labels and Latin digits. No locale or
viewport is inferred from ambient browser settings.

Optional generative UI binds text state with the mode-specific canonical constraint.
Read bindings protect interaction. Apps and server requests use isolated stores. The
compiled live example demonstrates Jotai, presets, native forms, host rejection,
protection and direction. Arbitrary CSS colors, custom renderers and SDK props are not
part of the public contract.
