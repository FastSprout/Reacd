---
template: preview.html
reacd_preview: NavigationMenu
reacd_preview_height: 560
---

# NavigationMenu

NavigationMenu combines direct links and local actions with disclosure groups. Its
private Base UI implementation handles pointer intent, keyboard navigation and Escape.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/navigation-menu.tsx"
```

## Properties

- `label`: required accessible navigation name.
- `items`: up to 32 keyed items with a nonempty label.
- `orientation`: `horizontal` by default, or `vertical`.
- A direct item accepts a safe `href`, an `onPress` callback, or no target for a label.
- `active`, `disabled` and link-only `newWindow` express target intent.
- A group has a nonempty `children` array of up to 32 keyed targets, plus an optional
  plain text `description`. A group cannot simultaneously declare a link or action.

The closed contract supports one submenu level. Deeper recursive navigation, vendor
render functions, icons as code, router objects and arbitrary CSS are outside this API.
This limit is an explicit adaptation of Nuxt UI's broader navigation vocabulary.

Disclosure state is temporary interaction state owned by the adapter. Application
selection and business actions remain with the host. Active links use
`aria-current="page"`, disabled targets cannot execute, and child controls preserve
native keyboard activation. The menu keeps link semantics rather than presenting
application commands with an ARIA menu role.

Popup content inherits the current template and writing direction across portals. It
scrolls within the available space, uses collision-aware positioning, and wraps long
labels. Application code does not specify breakpoints, coordinates or popup dimensions.

## Generative transport

Version `0.2` replaces callbacks with registered `action` names on direct or child
targets. Missing actions fail the whole declaration before partial UI is shown.
