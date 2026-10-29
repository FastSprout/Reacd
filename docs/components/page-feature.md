---
template: preview.html
reacd_preview: PageFeature
reacd_preview_height: 560
---

# PageFeature

PageFeature composes a semantic page introduction using closed reacd declarations.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-feature.tsx"
```

## Properties

Optional title and description strings, leading and children slots, and an orientation
(`horizontal` by default or `vertical`). A title may use a safe `href` and optional
`newWindow`, or an `onPress` callback. An action requires a title; links and callbacks
are mutually exclusive.

## Behavior and accessibility

Titles follow the containing Page/Section heading scope, bounded at heading level six.
Supporting copy wraps without a fixed height. Components add no main landmark. Titles
with actions remain separate from child controls, avoiding nested buttons or links.

Horizontal layouts reflow when space is insufficient. Feature content and controls
remain in declaration order. Design templates own colors, typography and spacing.
Styling props, native event props, raw tags and rendering overrides are rejected.

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
