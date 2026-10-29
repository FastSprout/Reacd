---
template: preview.html
reacd_preview: Badge
reacd_preview_height: 560
---

# Badge

Badge displays noninteractive status text using template-defined emphasis.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/badge.tsx"
```

Require a nonempty label. Optional intent is primary, secondary or danger; secondary is
the default. Optional leadingIcon uses the closed semantic Icon names. Optional size is
small, medium or large, with small the default.

The visible label names the status. An accompanying icon is decorative. Badge does not
expose buttons, links, click handlers or focus behavior. Long labels wrap; icon and text
content can reflow in narrow containers. The adapter supplies foreground, background,
spacing and dimensions from validated template tokens and named policies.

Generative 0.2 accepts the same literal logical properties. Unknown icon names,
interactive props, native HTML, classes and arbitrary styling are rejected.

The literal Badge has no state binding or action capability.
