---
template: preview.html
reacd_preview: DropdownMenu
reacd_preview_height: 560
---

# DropdownMenu

DropdownMenu presents named actions, safe links and controlled checkbox/radio choices.
The engine owns positioning, focus, keyboard navigation and overflow containment.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dropdown-menu.tsx"
```

## Properties

- `label`: required trigger label and menu accessible name.
- `open` and `onOpenChange`: controlled visibility. Disabled and inactive ancestors
  suppress opening without changing the host state.
- `items`: strict keyed union of `action`, `link`, `checkbox`, `radio`, `label`,
  `separator` and `submenu`. Submenus permit exactly one child level.
- Action items require `onPress`; link items require a safe `href` and optionally
  `newWindow`. A link cannot supply a callback. Disabled links omit their destination.
- Checkbox items require `checked` and `onCheckedChange`. Radio groups require `value`,
  `onValueChange` and keyed `options`; the selected value must identify an option.
- Action/choice callbacks are synchronous and may return false to reject a change.
  Invalid runtime results fail closed with visible feedback. Choice items remain open by
  default; action items close by default. `closeOnSelect` overrides either policy.
- Item keys are globally unique across the root and all submenu children. There are at
  most 64 root items, 64 children per submenu, 256 total items and 32 radio options.

## Interaction

Arrow keys, Home/End and typeahead navigate the menu. Escape dismisses a submenu before
its parent menu and returns focus to the trigger. Native link browsing operations remain
available. Labels wrap within a viewport-bounded scroll region, including in RTL.

The private shadcn adapter uses Base UI menu primitives. Applications provide no native
HTML, CSS, positioning props, native event handlers or custom item renderers.

## Generative state

Version `0.2` binds `open` to readWrite boolean state. Checkbox `checked` binds boolean
state; radio `value` binds text state and is constrained to the declared option values.
Read bindings display their current value and disable editing. Writable bindings may be
rejected by the host registry without changing the selected value or closing the menu.
Action identifiers must resolve to registered own-property handlers before rendering.
Nested submenu actions and bindings participate in the same preflight validation.

`modal` optionally traps interaction; the default is false. The trigger is a button.
