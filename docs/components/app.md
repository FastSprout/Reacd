---
template: preview.html
reacd_preview: App
reacd_preview_height: 560
---

# App

App sets the language and reading direction for an application shell.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/app.tsx"
```

## Properties

`children`: safe reacd content. `language`: a language tag, default `en`. `direction`:
`ltr` (default) or `rtl`.

## Behavior

App propagates direction to native content, Base UI and Radix interactions. It lays out
shell children vertically. Wrap it with ReacdProvider to select an adapter and create
isolated Jotai state. Nested application markup, CSS, portal DOM targets and arbitrary
provider options are unavailable.

The nearest App determines keyboard direction. For example, horizontal Slider and Tabs
reverse their arrow behavior under RTL. A nested LTR App restores LTR behavior. Portaled
Select content receives the same nearest direction.

## Generative transport

Version 0.2 uses required children arrays. Every slot is validated recursively.
Templates and defaults are validated as data; executable behavior and arbitrary CSS are
rejected.
