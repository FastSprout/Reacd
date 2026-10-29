---
template: preview.html
reacd_preview: PageCTA
reacd_preview_height: 560
---

# PageCTA

PageCTA composes a call to action and independent content.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-cta.tsx"
```

## Properties and behavior

Optional title, description, headline, links, children, top/header/footer/bottom slots,
orientation/reverse and surface variant. Variants are solid, outline (default), soft,
subtle and naked. Horizontal orientation is an intrinsic preference and reflows when
space is insufficient. Reverse changes keyed region order while preserving controlled
child state. Button actions remain independent of other controls.

## Accessibility and design

The trusted renderer owns native semantics, wrapping, target sizes and focus indicators.
Templates supply typography, colors and spacing. Native tags, dimensions, CSS, classes
and rendering overrides are rejected. New-window links include noopener/noreferrer.

Page, Section, PageHeader and PageSection accept a semantic anchor starting with an
ASCII letter, then letters/digits/hyphens/underscores, up to 80 characters. It
identifies the generated heading, which becomes a programmatic native fragment focus
target. Hosts must use unique anchors across the document. Without an anchor, generated
IDs remain renderer-owned. This API does not expose arbitrary HTML attributes.

## Generative transport

Version 0.2 uses required children arrays for Page, Section and PageCTA. Page
left/right, CTA content slots and link leading content use optional arrays. Registered
actions and state references inside every slot are checked before rendering. Schema
validation alone does not prove browser geometry, focus or native navigation.
