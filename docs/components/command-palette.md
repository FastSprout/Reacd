---
template: preview.html
reacd_preview: CommandPalette
reacd_preview_height: 560
---

# CommandPalette

CommandPalette is an inline search interface for grouped actions. Compose it inside
Modal when a dialog is needed; the palette does not install global shortcuts or own the
host's open state.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/command-palette.tsx"
```

## Properties

- `label`: required visible search label and accessible name.
- `query` and `onQueryChange`: controlled text, up to 1000 characters.
- `groups`: up to 24 keyed, named groups, each with up to 100 items. The total item
  budget is 500 and item keys are globally unique across all groups.
- Each item has a key and label, plus optional description, keywords, disabled flag and
  either a safe `href` or `onPress` action.
- `onSelect(key)`: optional synchronous callback. It runs before a target and can return
  false to veto execution. A command without a target requires this callback.
- `filtering`: `local` by default, or `external` for host-supplied ordering and matches.
- `status`: `ready`, `loading` or `error`. Stale options cannot execute while loading or
  in error. `disabled` also disables query editing.
- `emptyMessage`, `loadingMessage` and `errorMessage`: optional visible status copy.

Local search removes diacritics, normalizes case without an ambient locale, and matches
every query token against labels, descriptions and keywords. Exact and prefix label
matches take priority across all groups when selecting the 100 visible results. Ties and
visible group blocks retain declaration order; admitted items within each group retain
their rank order. Use external filtering for server search or a different ranking
algorithm.

The private adapter uses Base UI's inline autocomplete/combobox behavior with shadcn
input styling. It deliberately avoids adding cmdk, which shadcn's Command component
uses. This closed matching contract replaces Nuxt UI's Fuse-based fuzzy search.

## Interaction

Arrow keys highlight commands and Enter activates them. Pointer selection follows the
same veto rule. Selection leaves the query unchanged. IME composition does not trigger a
premature Enter action. Long text wraps inside an engine-bounded scroll region.

An href is an explicit same-window command destination captured before the host
callback. Use Link or NavigationMenu when native link browsing operations are required.
Selection callbacks accept a key rather than a DOM event and cannot return a Promise.
Invalid runtime callback results fail closed before action/navigation and show an error.

## Generative state

Version `0.2` binds query to readWrite text state. An optional selection readWrite text
binding records accepted keys. Its initial value can be empty or identify a declared
command. Rejected state writes veto the action. Item action identifiers must resolve
before rendering, and actions can read the selected key from the state registry.
