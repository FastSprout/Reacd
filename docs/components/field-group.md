---
template: preview.html
reacd_preview: FieldGroup
reacd_preview_height: 560
---

# FieldGroup

FieldGroup names a related set of controls and lays them out together. Horizontal groups
wrap when space is limited. Each control keeps its own label and state.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/field-group.tsx"
```

## Properties

| Property    | Type                   | Default    | Purpose                       |
| ----------- | ---------------------- | ---------- | ----------------------------- |
| label       | string                 | Required   | Accessible name for the group |
| orientation | horizontal or vertical | horizontal | Logical arrangement           |
| children    | reacd content          | Empty      | Related controls              |

The group preserves normal Tab order. Its children handle their own keys, form values
and callbacks. A group does not disable or rewrite child controls: set disabled or
readOnly explicitly on each control that needs protection. Group state is host owned;
separate applications use isolated Jotai stores.

Both shadcn profiles use template surface, border, radius and spacing. Horizontal groups
may span several rows; vertical groups stay stacked. Labels and actions wrap, including
long unbroken text and enlarged fonts. App direction determines logical ordering. Empty
groups are allowed and retain their accessible name.

Unknown properties, native children, CSS classes, inline styles and DOM events fail
validation. Optional generative transport has the same label and orientation with a
bounded children array. Child state references and registered actions retain their
normal validation and permissions. No group-specific state kind is introduced.
