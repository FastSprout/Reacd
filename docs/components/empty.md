---
template: preview.html
reacd_preview: Empty
reacd_preview_height: 560
---

# Empty

Empty explains why a view has no content and can offer recovery actions. Its title stays
visible while an optional busy signal communicates an operation in progress. Use the
component for absence of content; use Alert for an error requiring attention.

## Example

This compiled example edits the message, changes presentation, preserves a recovery
query, and runs local actions in the action and footer slots.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/empty.tsx"
```

## Properties

- `title`: required nonempty region title.
- `description`: optional supporting text.
- `size`: `small`, `medium` (default), or `large`.
- `variant`: `outline` (default), `solid`, `soft`, `subtle`, or `naked`.
- `leading`: optional safe media, such as Avatar or AvatarGroup.
- `children`: optional body content, including typed fields.
- `actions`: optional safe action components.
- `footer`: optional supporting content or further actions.
- `loading`: false by default; true marks the body busy and displays a status.
- `loadingLabel`: optional nonempty status text, default `Loading`.

Variants express border/surface emphasis using the active design tokens. Nested controls
retain their own validated palette. Long messages and action labels wrap; the engine
imposes no fixed panel height or hidden action text.

## Behavior and accessibility

The title names a region and the description supplies its accessible description.
Fields, links and buttons keep their own names, focus behavior and typed callbacks.
Loading does not automatically activate or disable actions. The host decides whether an
action should be disabled and what business transition it performs. The loading message
is outside the busy body so its status is not deferred with body updates.

Changing loading, variant, size or template preserves child values. Leading, body,
actions and footer accept reacd content; native elements, raw icons and styling props
are rejected. Compose existing safe media components for illustrations or identities.

## Generative UI and server rendering

Version `0.2` uses arrays of component nodes for `leading`, `children`, `actions` and
`footer`; `children` is required and may be empty. All slots are recursively validated,
including registered action references. Missing actions fail before rendering.

`loading` accepts a literal boolean or a boolean state reference with `mode: "read"`. It
cannot request writable access. Body fields may independently edit other keys. Server
rendering and hydration preserve label identities and isolate request state.
