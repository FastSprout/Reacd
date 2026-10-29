---
template: preview.html
reacd_preview: PageHeader
reacd_preview_height: 560
---

# PageHeader

PageHeader composes a semantic page introduction using closed reacd declarations.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-header.tsx"
```

## Properties

Optional headline, title and description strings introduce the page. `links` and
`children` accept safe reacd content.

## Behavior and accessibility

Titles follow the containing Page/Section heading scope, bounded at heading level six.
Supporting copy wraps without a fixed height. Components add no main landmark. Titles
with actions remain separate from child controls, avoiding nested buttons or links.

Design templates own colors, typography and spacing. Styling props, native event props,
raw tags and rendering overrides are rejected.

## React adaptation

Safe component slots replace upstream icon functions and ButtonProps arrays. The trusted
adapter owns semantic tags. PageCard spotlight is keyboard-accessible hover/focus
emphasis, not a pointer-tracking color effect. No HTML, CSS or pointer coordinates enter
the authoring API. Surface variants retain the template's verified foreground pairs.

## Generative transport

Version 0.2 requires a children array and accepts arrays for each optional component
slot. PageFeature and PageCard use a registered action name instead of a callback. Every
descendant action is checked before rendering. Transport validation does not prove
browser geometry or accessibility.

## Semantic anchors

Optional anchor identifies the generated title as a native fragment focus target. It
requires a title and starts with an ASCII letter, followed by letters, digits, hyphens
or underscores (at most 80 characters). Hosts must use unique identifiers. Generated IDs
remain the fallback. Applications never mutate the DOM to navigate.
