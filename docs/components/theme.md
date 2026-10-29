---
template: preview.html
reacd_preview: Theme
reacd_preview_height: 560
---

# Theme

Theme scopes appearance and closed component defaults to a subtree.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/theme.tsx"
```

## Properties

`children`: safe reacd content. `template`: an optional full validated DesignTemplate.
`defaults`: an optional closed component map.

## Behavior

When template is absent, Theme inherits the active variables. A supplied template also
reaches descendant portals. Explicit properties override defaults, including false and
zero values; optional undefined properties inherit defaults. Nesting themes preserves
state and combines defaults with inner values taking precedence.

Supported defaults: Button intent; Text role, weight and lineLimit; VStack, HStack, Card
and Grid spacing; Separator orientation, position, lineStyle, intent, size and
decorative. Required properties remain explicit. Invalid contrast, unknown component
defaults, callbacks and raw styling are rejected. Layout safety constraints remain owned
by the engine.

## Generative transport

Version 0.2 uses required children arrays. Every slot is validated recursively.
Templates and defaults are validated as data; executable behavior and arbitrary CSS are
rejected.
