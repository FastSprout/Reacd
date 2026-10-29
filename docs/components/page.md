---
template: preview.html
reacd_preview: Page
reacd_preview_height: 560
---

# Page

Page supplies a primary content region with optional side regions.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page.tsx"
```

## Properties and behavior

Required title, optional subtitle and safe children. Optional left/right slots accept
safe reacd content. The engine handles intrinsic region sizing and reflow. A semantic
anchor may identify the generated page heading. Nested Page adds a section rather than a
second main landmark. Regions remain in left/body/right reading order, including on
narrow screens.

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
