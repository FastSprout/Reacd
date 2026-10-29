---
template: preview.html
reacd_preview: ContentToc
reacd_preview_height: 560
---

# ContentToc

ContentToc links to declared section anchors in the current document.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/content-toc.tsx"
```

## Properties and accessibility

Required `label` names the navigation and `items` describes nested headings. Each item
has a unique semantic `key`, plain `label`, optional `children` and optional `disabled`.
Keys become native fragment destinations. Use matching anchors on PageSection or other
reacd page components. Disabled ancestors disable their descendants.

Optional `currentKey` and `onCurrentChange(key)` describe explicit host state. An empty
key means none. The current link announces `aria-current="location"`. Return `false`
from the callback to veto ordinary navigation; invalid asynchronous returns show a
diagnostic. Modified activation retains browser behavior.

Optional `disabled` blocks navigation and `emptyLabel` names the empty state. Labels
wrap and indentation stays bounded. This component does not query the DOM or install
scrollspy. The host determines which heading is current.

Version 0.2 generative transport requires an explicit text `currentKey` reference,
supporting `read` and `readWrite`. Rejected writes block navigation and show feedback.
State constraints and schema validation complement real browser conformance tests.
