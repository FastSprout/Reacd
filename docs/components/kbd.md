---
template: preview.html
reacd_preview: Kbd
reacd_preview_height: 560
---

# Kbd

Kbd displays a key or shortcut token. It is passive notation: it does not register a
keyboard listener or activate an action. Keep the action itself on a named control.

## Example

This compiled example changes the key, platform, accessible label, size, variant, and
intent. A chord composes several Kbd components with Text separators.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/kbd.tsx"
```

## Properties

- `value`: required nonempty key name or literal label.
- `label`: optional accessible label override, useful for unfamiliar symbols.
- `platform`: `other` (default) or `apple`. This is explicit for stable server
  rendering.
- `size`: `small`, `medium` (default), or `large`.
- `variant`: `outline` (default), `soft`, `subtle`, or `solid`.
- `intent`: `secondary` (default), `primary`, or `danger`.

Lowercase aliases include `meta`, `ctrl`, `alt`, `command`, `control`, `option`,
`shift`, `win`, `enter`, `delete`, `backspace`, `escape`, `tab`, `capslock`, the four
arrow names such as `arrowup`, and `pageup`, `pagedown`, `home`, `end`. Unknown values
stay literal, including their original case. `meta` shows Command on Apple and Control
elsewhere.

## Accessibility and layout

The engine renders native keyboard notation with an accessible full key name. Kbd is not
a tab stop. Long literals wrap within their container, including enlarged text and
right-to-left layouts. Appearance uses the active template's validated color pairs.

Tooltip shortcut labels share the private keyboard presentation but stay literal; adding
Kbd aliases does not change the meaning of an existing Tooltip label.

## Generative UI

Version `0.2` accepts a literal `value` or a text state reference with `mode: "read"`.
Several Kbd and Text nodes can display the same key. Editors update the underlying state
through their own writable bindings. An empty initial or live value is rejected. Kbd
cannot write state, render arbitrary children, or receive native event handlers.
