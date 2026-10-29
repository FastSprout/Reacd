---
template: preview.html
reacd_preview: Stepper
reacd_preview_height: 560
---

# Stepper

Stepper describes progress through a controlled sequence. Application state selects the
current step; the component reports requested transitions and leaves business validation
to the host.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/stepper.tsx"
```

## Properties

- `label`: required accessible name.
- `items`: one through 32 keyed steps with a required title and optional description,
  disabled flag and safe reacd `content`.
- `value`: key of the current enabled step.
- `onValueChange`: requested enabled step key, without a native event.
- `linear`: defaults to true. Previous steps and the next enabled step are reachable;
  disabled steps are skipped. False permits any enabled step.
- `disabled`: blocks all step controls.
- `orientation`: `horizontal` by default, or `vertical`.

The active button has `aria-current="step"` and names the current content region. Arrow
keys follow the declared orientation and scoped writing direction. Home and End move to
the first or last reachable step. Keyboard focus does not change the value; Enter or
Space requests activation. A host that keeps its current value refuses the transition.
Horizontal steps wrap naturally in narrow containers.

Keep long-lived form values in application state. Inactive step content is unmounted.
The example uses Jotai so its address survives moving between steps and templates.

## Generative state

Version `0.2` binds `value` to an existing `text` state key using `read` or `readWrite`
mode. Read mode displays progress with disabled controls. Initial and subsequent values
must identify an enabled declared step. Each item's optional content is a bounded node
array whose actions are validated before rendering, including inactive steps.
