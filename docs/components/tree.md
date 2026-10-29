---
template: preview.html
reacd_preview: Tree
reacd_preview_height: 560
---

# Tree

Tree presents bounded hierarchical data with controlled selection and expansion. Focus
is independent of selection; navigating never silently changes host data.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/tree.tsx"
```

## Properties

- `label`: required accessible tree name.
- `items`: array of `{id, label, disabled?, children?}`; an empty tree is allowed.
- `value`: required readonly array of selected node ids.
- `expanded`: required readonly array of expanded branch ids.
- `onValueChange` and `onExpandedChange`: required callbacks for host transitions.
- `multiple`: allow modifier-free selection toggling; defaults to false.
- `disabled`: disable transitions and item navigation; defaults to false.
- `selectionReadOnly` and `expansionReadOnly`: independently prevent transitions.
- `emptyLabel`: optional empty message, default `No items to display.`.

Ids must be unique throughout the hierarchy. Single selection permits at most one id.
Selected ids must exist and expanded ids must identify branches. Trees have named depth
and node-count budgets; cycles and shared object graphs are rejected before recursive
parsing. Child arrays are nonempty when supplied.

## Interaction and accessibility

Up/Down, Home/End move among enabled visible nodes. Forward arrow opens a branch or
focuses its first enabled child. Backward arrow closes it or focuses its parent. App
direction determines which horizontal arrow is forward. Enter and Space select; multiple
mode toggles membership without modifier keys. Typeahead matches visible enabled labels.
Tab leaves the tree's single roving focus stop.

Pointer disclosure controls have explicit Expand/Collapse labels and minimum touch
targets. Disabled nodes never request transitions. Readonly data remains navigable.
Controlled callbacks only request updates; a host can reject them. Labels wrap and
indentation is capped to preserve space in deep narrow trees. Styling, native events and
arbitrary render functions are unavailable.

## Generative UI

Version `0.2` uses selection-kind state references for both value and expanded. Each
reference can request `read` or `readWrite` access. Read access prevents the
corresponding transition. Initial values and host updates must satisfy the same id and
mode constraints. Stores and SSR requests remain isolated.

The trusted adapter implements the WAI treeview interaction pattern using shadcn Button
and design tokens. Optional upstream virtualization, automatic selection propagation and
arbitrary item slots are outside this contract.
