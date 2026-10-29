---
template: preview.html
reacd_preview: CheckboxGroup
reacd_preview_height: 560
---

# CheckboxGroup

CheckboxGroup manages a controlled set of choices. It supports an optional maximum,
required selection, disabled items, and shared state.

## Example

The Fields catalog runs this same compiled source. Place it inside `ReacdProvider` in a
project configured with `jsxImportSource: "reacd"`.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/checkbox-group.tsx"
```

## Properties

| Property | Required | Default | Behavior |
| --- | --- | --- | --- |
| `label` | Yes | None | Visible legend and accessible group name. |
| `items` | Yes | None | Unique choices with labels, descriptions, and disabled flags. |
| `value` | Yes | None | Readonly array of selected item values. |
| `onValueChange` | Yes | None | Receives the complete proposed readonly selection. |
| `description` | No | None | Visible, linked group description. |
| `max` | No | No limit | Positive integer maximum selected values. |
| `orientation` | No | `vertical` | `horizontal` uses wrapping rows. |
| `disabled` | No | False | Prevents group interaction. |
| `required` | No | False | At least one selected value before native submission. |
| `name` | No | Instance ID | Logical form name, isolated by default. |

Item `value` identifiers start with a letter and use letters, digits, dots, hyphens, or
underscores. Labels are required. Descriptions and disabled flags are optional. Disabled
selected items stay selected until an explicit host update changes the value.

Duplicate IDs or selections, missing selected options, excessive selections, invalid
limits/callbacks, and unknown properties fail validation. No native slots, CSS, icon
strings, browser events, or uncontrolled defaults are public.

## Interaction and forms

Space and label clicks toggle a choice. At `max`, unchecked choices remain focusable
with `aria-disabled` and cannot activate. Selected enabled choices can be cleared to
release capacity. The adapter displays a maximum hint. Tab visits enabled choices;
disabled items do not activate. Focus stays visible.

Required means at least one choice, rather than every checkbox. Empty selection is valid
editing state, but native form submission waits for a selection. Disabled groups do not
block submission. Host logic can reject a proposal by keeping `value` unchanged.

Long text wraps inside the available container in either orientation, including enlarged
text. Theme changes preserve selections. The shadcn adapter composes its Base UI
checkbox recipe with CheckboxGroup. SSR/hydration retain control links and isolate
application stores.

## Generative UI

Version `0.2` binds `value` to writable `selection` state. Membership, uniqueness, and
maximum constraints apply both before rendering and to live host updates. Groups sharing
a key must satisfy all active constraints. Invalid changes leave state untouched; hosts
can explicitly update disabled choices. TSX and generative UI use the same adapter.
