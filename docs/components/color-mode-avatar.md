---
template: preview.html
reacd_preview: ColorModeAvatar
reacd_preview_height: 560
---

# ColorModeAvatar

An Avatar with separate image sources for resolved light and dark modes.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-mode.tsx"
```

```tsx
<ColorModeAvatar
  name="Team account"
  mode={resolvedMode}
  light="/team-light.png"
  dark="/team-dark.png"
  size="medium"
/>
```

Mode is explicitly light or dark. Both sources must be HTTP(S) or root-relative URLs
without credentials. The visible fallback uses the verified Avatar initials policy;
optional fallback is limited to two Unicode graphemes. Logical size is small, medium or
large. No native image props or styling escapes are available.

Switching source resets the private image lifecycle, retaining the account name while
the new source loads or fails. Generative mode accepts a resolved literal or read text
binding. It never writes application state.

See the compiled [color-mode example](../examples/color-mode.tsx).
