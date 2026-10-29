---
template: preview.html
reacd_preview: BlogPosts
reacd_preview_height: 560
---

# BlogPosts

BlogPosts presents editorial records with closed reacd composition.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/blog-posts.tsx"
```

## Entry contract

BlogPost and ChangelogVersion accept optional title, description, date/dateLabel, image,
header/badge/authors/children/footer/actions, orientation and surface variant. A title
may navigate with a safe href/newWindow or run onPress. The entire article is never
wrapped in an interactive target, so child controls remain independent.

Dates use canonical ISO calendar strings. An explicit display label requires a date;
otherwise the date string is displayed verbatim. No ambient timezone, clock or locale
changes hydration output. Images require validated src and meaningful alt, reserve
engine-owned dimensions, and display an accessible fallback when unavailable. The
reference's missing image is an explicit failure-state placeholder, not a product asset.

Variants are outline, soft, subtle, ghost and naked. Horizontal orientation wraps when
space is insufficient. ChangelogVersion's optional indicator is decorative and defaults
to true; version/date information remains explicit text.

## Collection contract

BlogPosts accepts optional keyed posts and safe children, with horizontal (default) or
vertical collection orientation. ChangelogVersions accepts keyed versions and children,
plus an optional indicator default inherited by its entries. Each entry may override
that default. Keys must be unique. Children supplement structured entries. Host order is
preserved; no implicit sorting or fetching occurs. Empty collections are valid.

## Accessibility and React adaptation

Semantic articles, lists and heading scope are owned by the adapter. Safe slots replace
vendor User/Badge property bags; body content is composed from reacd components rather
than interpreted Markdown/HTML. Styling, native attribute bags, raw icons and tag
changes are rejected. Template contrast pairs remain intact. Scroll-driven spring or
progress effects are replaced by static optional indicators.

## Generative transport

Version 0.2 replaces callbacks with registered action names and slots with arrays.
Standalone nodes and collection entry arrays are traversed completely before rendering.
Every transport entry requires a children array. Validation does not establish browser
geometry, image loading or native focus behavior.
