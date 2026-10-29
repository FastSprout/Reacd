---
template: preview.html
reacd_preview: PageCard
reacd_preview_height: 560
---

# PageCard

PageCard composes a semantic page introduction using closed reacd declarations.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-card.tsx"
```

## Properties

PageCard adds header/footer slots, orientation and reverse to feature content. Variants
are solid, outline (default), soft, subtle, ghost and naked. Intent is neutral
(default), primary or danger. Highlight adds an emphasis border; spotlight adds an
outline on hover and focus within. Both are false by default. Title links and callbacks
are mutually exclusive and require a nonempty title.

## Behavior and accessibility

Titles follow the containing Page/Section heading scope, bounded at heading level six.
Supporting copy wraps without a fixed height. Components add no main landmark. Titles
with actions remain separate from child controls, avoiding nested buttons or links.

Horizontal layouts reflow when space is insufficient. Reverse changes the declaration
order of content regions while retaining their identity and controlled field values.
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
