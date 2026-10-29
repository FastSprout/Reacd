---
template: preview.html
reacd_preview: PageAside
reacd_preview_height: 560
---

# PageAside

PageAside keeps contextual navigation available beside page content.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-aside.tsx"
```

## Properties

Required `label` names the complementary landmark. `children`, `top` and `bottom` accept
optional safe reacd content.

## Behavior and accessibility

Wide layouts use an engine-owned sticky offset and bounded scrolling. Narrow layouts
keep the same content in document flow. The component preserves navigation on mobile
rather than inheriting Nuxt's hidden mobile aside. It does not move focus when the
layout changes. Applications supply no breakpoint, raw CSS or fixed height.

## Generative transport

Version 0.2 uses a required children array, which may be empty. Optional top and bottom
slots are also arrays. The entire tree is validated before rendering, including
descendant state references and registered actions. Styling hooks and native element
nodes are rejected.
