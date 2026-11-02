---
reacd_preview: AvatarGroup
---

# AvatarGroup

AvatarGroup displays named identities with a shared logical size. Extra entries remain
accessible through an expandable list. Items wrap within their container instead of
overlapping each other.

## Usage

Show two reviewers and use the native overflow disclosure to see the other two.
The component owns disclosure state; this static example needs no application state.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/avatar-group.tsx"
```

## Properties

| Property       | Type                       | Default                 |
| -------------- | -------------------------- | ----------------------- |
| `label`        | Nonempty string            | Required                |
| `items`        | Readonly identity array    | Required                |
| `max`          | Integer from 1 to 100      | `5`                     |
| `size`         | `small`, `medium`, `large` | `medium`                |
| `emptyMessage` | Nonempty string            | `No people to display.` |

The label supplies the group's accessible name. `max` controls how many identities
appear before the overflow disclosure. `emptyMessage` supplies feedback for empty data.

Each item has a unique stable `id`, a required `name`, and optional `src` and `fallback`
properties from [Avatar](avatar.md). The group owns sizing, so individual items cannot
set it. An empty item array is valid. Duplicate IDs or invalid identities fail
validation.

## Overflow and keyboard use

When more items exist than `max`, a `+N` count accompanies the `Show N more people`
disclosure. Activating it with click, Enter, or Space reveals all hidden identities and
their full names. The disclosure remains keyboard focusable and uses native expanded
state. Long names wrap, including when text is enlarged.

Opening the disclosure changes transient UI state. It does not alter the items or their
business state. Changing a design template preserves the open disclosure while the
component remains mounted. Emptying the group removes its disclosure.

## Generative UI and rendering

Version `0.2` accepts literal AvatarGroup properties. Hosts can replace those
declarations or supply reactive TSX props. Group items do not introduce a new named
state kind. Server rendering includes the initially visible identities. The native
SDK mounts overflow content when opened and retains the full accessible names.
