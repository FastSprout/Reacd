---
reacd_preview: Prose
---

# Prose

Render structured content through the selected theme adapter. Markdown is parsed
at build time; the view receives a validated document containing semantic blocks.
Content cannot include HTML, CSS, JSX or executable callbacks.

## Usage

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/prose.tsx"
```

## Properties

| Property | Type | Purpose |
| --- | --- | --- |
| `document` | `ProseDocument` | Validated semantic content blocks |

Supported blocks include headings, paragraphs, lists, quotes, tables, images,
thematic breaks and fenced code. Inline nodes support text, emphasis, strong
text, deletion, code, links and breaks. Code can include validated light and dark
syntax tokens. Heading IDs remain stable for table-of-contents links.

The selected adapter owns semantic rendering, typography and code presentation.
Unsafe links and unknown nodes fail validation. A missing adapter mapping throws
`UnsupportedAdapterComponentError`.
