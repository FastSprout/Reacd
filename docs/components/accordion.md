---
template: preview.html
reacd_preview: Accordion
reacd_preview_height: 560
---

# Accordion

Accordion groups related sections behind accessible heading buttons. Open values are
controlled through Jotai or application state; appearance comes from the selected
adapter. The shadcn/ui adapter implements the complete reacd contract.

## Example

The [compiled TSX example](../examples/accordion.tsx) runs in the local catalog under
Layout. It includes multiple expansion, a disabled item, long content, and an input
whose value survives collapsing its panel. Wrap the example in `ReacdProvider` when
using it in another application.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/accordion.tsx"
```

## Properties

- `label`: required accessible name for the group.
- `items`: nonempty bounded list of unique `value`, visible `label`, `content`, and
  optional `disabled`. Content composes reacd components.
- `value`: required readonly array of open item values.
- `onValueChange`: receives the complete readonly open-value array.
- `mode`: `single` by default; `multiple` permits several open items.
- `collapsible`: defaults to true. False requires one open item in single mode.
- `disabled`: disables every trigger; individual item flags remain supported.
- `retainContent`: defaults to false. True keeps closed panels mounted and hidden.

Unknown values, duplicate IDs, too many open items in single mode, native content, and
styling properties produce validation errors. Callback values are logical item IDs; no
browser events are exposed.

## Keyboard and layout

Enter and Space activate headers. Arrow keys move between enabled headers; Home and End
move to the first and last enabled header. Focus remains visible. Headers and panels
wrap long text, adapt to their container, and respect design tokens. Disabled headers
cannot activate. Hidden retained content is excluded from normal navigation and the
accessibility tree.

Closing a retained section also closes descendant menus and deactivates nested dialogs.
This follows inactive ancestors through nested disclosure panels without resetting
controlled business values.

## Generative UI

Version `0.2` supports an `Accordion` node with the same logical properties. Its `value`
is `{ "state": "sections.open", "mode": "readWrite" }`, referencing a writable
`selection` definition. Each item's `content` is a recursive generative node. Nested
action names and bindings are validated before rendering, including panels that begin
collapsed. Host writes respect the selection rules.
