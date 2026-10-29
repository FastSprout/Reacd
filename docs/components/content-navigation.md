---
template: preview.html
reacd_preview: ContentNavigation
reacd_preview_height: 560
---

# ContentNavigation

ContentNavigation presents host-provided document links in a controlled hierarchy.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/content-navigation.tsx"
```

## Properties

Required `label`, `items`, `expandedKeys` and `onExpandedKeysChange` describe the
navigation. Items have unique semantic `key` and plain `label`; leaves require safe
`href`. Branches add `children` and may have their own link. Optional `newWindow`
protects a new window with `noopener noreferrer`. Optional `disabled` blocks a subtree.

Optional `currentKey` highlights an existing document; empty text means none.
`onCurrentChange(key)` receives only that key before ordinary same-window navigation.
Return `false` to veto navigation. Invalid asynchronous decisions show a diagnostic.
Modified clicks, context menus and new-window links retain native browser behavior.

Optional `disabled`, `expansionReadOnly` and `emptyLabel` configure the whole region.
Disclosure buttons announce expanded state and hide closed descendants from focus.
Layout wraps labels and bounds indentation without exposing CSS or native tags.

## Generative state

Version 0.2 requires explicit `currentKey` text and `expandedKeys` selection references.
Both support `read` and `readWrite`. Read expansion disables disclosure, while native
links remain available. Rejected writes keep state unchanged and show feedback. Mounted
consumers constrain shared writes to declared keys and valid branches. The host supplies
document data; there is no implicit CMS or router.
