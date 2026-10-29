---
template: preview.html
reacd_preview: Breadcrumb
reacd_preview_height: 560
---

# Breadcrumb

Breadcrumb describes an ordered navigation path. The last item identifies the current
page; earlier items may be native links, local actions, or plain labels.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/breadcrumb.tsx"
```

## Properties

- `label`: accessible navigation name.
- `items`: one through 32 items with unique `key` and nonempty `label`.
- Each item accepts either a safe `href` or an `onPress` callback.
- `disabled`: an item-level flag that prevents its navigation or action.
- `separator`: `chevron` by default, or `slash`.

The current item has `aria-current="page"`; a supplied link or action retains its
behavior. Links preserve native browser behavior. Callbacks receive no DOM event. Paths
wrap with long labels and narrow containers. Chevron direction follows the writing
direction; separators are decorative.

## Generative state

Generative version `0.2` uses a registered action identifier in an item's `action`
property instead of a callback. All references must resolve, including references on
current or disabled items. Missing actions fail validation.

An action may update registered state, including a pagination or table state. Breadcrumb
itself does not infer a router, fetch data, or mutate unrelated state.
