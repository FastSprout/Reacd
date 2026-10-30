---
template: preview.html
reacd_preview: RadioGroup
reacd_preview_height: 560
---

# RadioGroup

RadioGroup presents one controlled choice from a named list. The host owns the value;
the adapter owns accessible controls, visual indicators, and wrapping.

## Example

The Fields catalog runs this same compiled source. Use it inside `ReacdProvider` with
`jsxImportSource: "@fastsprout/reacd"`.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/radio-group.tsx"
```

## Properties

| Property | Required | Default | Behavior |
| --- | --- | --- | --- |
| `label` | Yes | None | Visible legend and accessible group name. |
| `items` | Yes | None | Unique choices with labels, descriptions, and disabled flags. |
| `value` | Yes | None | Selected item value; empty string means no selection. |
| `onValueChange` | Yes | None | Receives the proposed string value without an event. |
| `description` | No | None | Visible, linked group description. |
| `orientation` | No | `vertical` | `horizontal` arranges choices in wrapping rows. |
| `disabled` | No | False | Prevents group interaction. |
| `required` | No | False | Blocks native form submission until a choice is selected. |
| `name` | No | Instance ID | Logical native form name, isolated by default. |

Items require a nonempty label and stable identifier `value`. Values start with a letter
and use letters, digits, dots, hyphens, or underscores. Optional `description` adds
linked explanatory text. `disabled` prevents choosing that item. A disabled item may
remain selected until the host changes it.

Missing options, duplicate values, invalid callbacks, unknown properties, and styling
escapes fail validation. Custom HTML, CSS, icon strings, and uncontrolled defaults are
not component props. Appearance belongs to the adapter and template.

## Keyboard, forms, and state

Arrow keys move focus and selection, skip disabled choices, and wrap at the ends. Space
selects the focused choice. Tab enters/exits the group rather than visiting every radio.
Labels activate their controls. Focus remains visible, and controls use the engine's
minimum target size.

Required groups may begin empty while editing. A native form cannot submit them until a
value is selected. Disabled controls do not block form submission. Host callbacks may
reject changes by keeping `value` unchanged. Updating a theme preserves the value.

Long labels and descriptions wrap within the group, including horizontal layouts and
enlarged text. The shadcn adapter follows its Base UI Radio Group recipe. SSR and
hydration preserve generated label/control IDs and isolate application stores.

## Generative UI

Version `0.2` uses a writable text binding for `value`. Empty text is unselected; any
other value must name an item. Definitions, permissions, initial membership, and live
host writes are validated. Several controls/displays may share the same state key while
all active constraints remain satisfied. Invalid writes preserve the previous value.
