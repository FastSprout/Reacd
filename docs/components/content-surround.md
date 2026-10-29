---
template: preview.html
reacd_preview: ContentSurround
reacd_preview_height: 560
---

# ContentSurround

ContentSurround shows previous and next document destinations with native links.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/content-surround.tsx"
```

## Properties

Optional `previous` and `next` require `title` and safe `href`, with optional plain-text
`description` and `newWindow`. Optional `label` names the navigation region; its default
is `Adjacent pages`. `emptyLabel` defaults to `No adjacent pages.`

## Behavior and accessibility

Visible Previous/Next labels supplement each document title. Links wrap into one column
when space is narrow. Long text stays reachable, including at enlarged text and RTL.
Missing neighbors create no placeholder links. With no neighbors, the empty message is
visible. New windows receive `noopener noreferrer`; other native navigation remains
available. The host supplies document relationships, without an implicit CMS or router.

## Generative transport

Version 0.2 adds `type: "ContentSurround"` to the same closed declaration. There are no
callbacks, CSS properties or executable native elements. Validation and real browser
acceptance cover different requirements.
