---
template: preview.html
reacd_preview: Collapsible
reacd_preview_height: 560
---

# Collapsible

Collapsible reveals one controlled panel. Its trigger and content belong to the active
theme; application code supplies logical values and reacd children.

## Example

The local Layout catalog runs this same compiled source. Place the example inside
`ReacdProvider` in an application configured with
`jsxImportSource: "@fastsprout/reacd"`.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/collapsible.tsx"
```

## Properties

| Property | Required | Default | Behavior |
| --- | --- | --- | --- |
| `label` | Yes | None | Names the trigger and content region. |
| `open` | Yes | None | Controlled boolean visibility. |
| `onOpenChange` | Yes | None | Receives a boolean proposal, without a DOM event. |
| `children` | No | None | Content composed from reacd components. |
| `disabled` | No | False | Prevents interaction with the built-in trigger. |
| `retainContent` | No | False | Keeps descendants mounted while the panel is closed. |
| `showTrigger` | No | True | False supports an external control without a trigger. |

Empty labels, invalid values/callbacks, native elements, and unknown props are rejected.
Styling props, browser events, vendor slots, and uncontrolled defaults are not public.

## State and keyboard

The host owns `open`. Clicking the built-in trigger, Enter, or Space proposes the next
boolean. The host can reject it by keeping its state unchanged. Disabled affects the
trigger; the host can still open or close the panel programmatically. Triggers do not
submit enclosing forms. Expanded/control semantics link the trigger to its named region.

By default, closing unmounts content and discards descendant-local state. With
`retainContent`, child state remains mounted, but closed fields are invisible and
excluded from keyboard navigation. Child menus close and nested dialogs become inactive
with their ancestor. Controlled business values remain intact. Nested disclosure panels
keep their own controlled state. Theme changes preserve edits.

## Layout and rendering

Labels and content wrap within their available width, including long identifiers and
enlarged text. The shadcn adapter uses its Base UI Collapsible recipe with engine
tokens. Both open content and a retained closed panel support server rendering; no
application HTML or CSS is required.

## Generative UI

Version `0.2` binds `open` to a writable boolean definition. `children` is an array of
recursive declarations. References, actions, types, and permissions are validated even
while the panel is closed. Display components may read the same key; writable controls
may share it. The same adapter handles TSX and generative declarations.
