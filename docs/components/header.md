---
reacd_preview: Header
---

# Header

Header combines application identity, navigation and a controlled accessible menu.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/header.tsx"
```

## Properties

`title` is required. `href` optionally links the title to a validated destination.
`children`, `start`, `end`, `top` and `bottom` accept reacd content. `menu` accepts
`content`, required `open` and `onOpenChange`, optional `mode` (`modal`, `slideover`,
`drawer`), `toggleLabel`, `closeLabel` and optional `replacesNavigation`.

`replacesNavigation` defaults to `false`. Set it only when `menu.content` contains all
destinations from the desktop `children` and `bottom` navigation slots. The SDK then
shows those slots on wide layouts and their menu replacement on compact layouts.
Identity, start/end controls and top content remain available. A menu without desktop
navigation keeps its toggle accessible.

## Behavior and accessibility

The menu traps focus and restores focus to its toggle on dismissal. Escape, outside
interaction and the close control request `onOpenChange(false)`. Keep the menu state in
the application's isolated Jotai store. Route changes are host events: close the menu
when navigation succeeds. Generic slots wrap without application breakpoints. Compact
navigation replacement requires the explicit opt-in above. Menu modes change placement
while preserving the same dialog semantics.

## Generative transport

Version 0.2 represents child slots as arrays of component nodes. Every slot is validated
recursively. Styling properties and native element names are rejected. The menu open
property uses a boolean readWrite state binding. Its change callback is resolved by the
generative state host, never supplied as executable JSON.
