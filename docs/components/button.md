---
reacd_preview: Button
---

# Button

Trigger an application action through a typed callback.

## Usage

Declare the action and keep its state next to the view.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/button.tsx"
```

```tsx
<Button label="Save changes" onPress={saveChanges} />
```

## API

| Property   | Type                             | Purpose              |
| ---------- | -------------------------------- | -------------------- |
| `label`    | `string`                         | Visible action label |
| `onPress`  | `() => void`                     | Application action   |
| `intent`   | `primary`, `secondary`, `danger` | Logical emphasis     |
| `disabled` | `boolean`                        | Prevent activation   |
| `pressed`  | `boolean`                        | Controlled selection |

Optional leadingIcon and trailingIcon use the closed semantic Icon names and render
decoratively beside the visible label. Optional loading blocks activation, exposes
aria-busy and shows a loading symbol. Optional loadingLabel replaces the visible label
while busy; otherwise the original label remains. Busy and disabled buttons retain
native disabled semantics for pointer and keyboard interactions.

Enter, Space and pointer activation request onPress. Button is always type button; it
does not submit a surrounding form. Labels wrap and icons reflow when space is limited.
The adapter owns dimensions and design tokens in every template.

## Pressed state

Use optional `pressed` for an action that represents a selected state. The
application controls its value: `true` and `false` expose the matching native
`aria-pressed` state; omitting it leaves an ordinary action button. Keep the
accessible label stable while the selection changes.

```tsx
<Button label="Mono" pressed={preset === 'mono'} onPress={selectMono} />
```

Activation requests `onPress` and does not change `pressed` automatically. Use
the callback to update Jotai state. Set `intent` separately when the selection
needs different visual emphasis. Both generative transports accept the same
optional boolean.

## Intent

```tsx
<Button label="Cancel" intent="secondary" onPress={cancel} />
<Button label="Delete record" intent="danger" onPress={deleteRecord} />
```

The adapter determines the concrete appearance of each intent. A view does not choose
colors, classes, or dimensions for the button.

## Forms

Use `SubmitButton` inside `Form` when the action should follow form submission and
validation semantics.
