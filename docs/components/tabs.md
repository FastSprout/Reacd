---
template: preview.html
reacd_preview: Tabs
reacd_preview_height: 560
---

# Tabs

Tabs presents named panels with controlled selection and keyboard navigation.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/tabs.tsx"
```

## Properties

Required `label` names the tab list. `items` contains unique `value` and `label` pairs,
optional `disabled`, and optional safe `content`. Required `value` selects an enabled
item; `onValueChange` requests a new selection.

`orientation` is `horizontal` (default) or `vertical`. `activationMode` is `automatic`
(default) or `manual`. `children` is a fallback for items without content. Appearance
comes from the adapter and template.

## Behavior and accessibility

Arrow keys follow orientation and scoped direction. Home/End reach the first/last
enabled tab. Manual mode moves focus without selecting until Enter/Space. Disabled items
cannot be activated. Horizontal labels wrap on narrow screens.

Each selected trigger identifies its panel. Hidden panels stay mounted and are removed
from the accessibility tree and keyboard order. Shared fallback content remains mounted
when a different item has its own panel. Keep application data in the host Jotai store.

## Generative transport

Version 0.2 uses a text state reference with explicit `read` or `readWrite` mode. Read
mode disables unselected triggers. Write mode requests validated state changes. Items
and fallback content use node arrays; every slot is checked before rendering. Styling,
native elements and executable callbacks are rejected.

Rejected shared-state writes preserve the selected panel and show a diagnostic. A later
accepted selection clears it. Disabled controls retain template text contrast.

Nuxt router integration and raw styling hooks are replaced by this closed React
contract. Schemas validate declarations; browser tests verify actual behavior.

Retained inactive panels keep their local state while their child portals become
inactive. Controlled open intent remains unchanged; returning to the panel restores
its retained content. Shared fallback content follows the same rule, and enclosing
inactivity cannot be overridden by selecting a tab.
