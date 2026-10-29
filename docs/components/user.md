---
template: preview.html
reacd_preview: User
reacd_preview_height: 560
---

# User

User displays an identity using a name, optional description and optional Avatar. Choose
plain content, a safe navigation link or a host-controlled action.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/user.tsx"
```

## Properties

- `name`: required nonempty identity and accessible action/link name.
- `description`: optional supporting text, also the accessible description.
- `avatar`: optional `{src?, fallback?}` using Avatar's validated source rules.
- `size`: `small`, `medium` (default) or `large`.
- `orientation`: `horizontal` (default) or `vertical`.
- `href`: optional safe link destination; mutually exclusive with `onPress`.
- `onPress`: optional callback with no DOM event exposed.
- `disabled`: optional action disablement; requires `onPress`.

Names and descriptions wrap. Avatar images retain their safe fallback. Plain identities
add no focus stop; links use native navigation and actions support keyboard activation.
Templates control presentation without replacing identity data or callbacks. Arbitrary
tags, classes, styles and native events are rejected.

## Generative UI

Version `0.2` accepts the same literal identity data. Use `action: "openProfile"`
instead of a callback. The host must register that action before rendering. Link
destinations and action references are mutually exclusive. Visibility or business
transitions belong to the host's isolated Jotai state.
