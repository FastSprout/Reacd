---
template: preview.html
reacd_preview: Error
reacd_preview_height: 560
---

# Error

Error presents an HTTP failure with safe recovery content.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/error.tsx"
```

## Properties

Required `statusCode` is an integer from 400 through 599. `title` is required and
nonempty. Optional properties are `message`, `leading`, `actions`, `children`,
`redirect` and `recoveryLabel`. The recovery label defaults to `Back to home`.

## Behavior

Error renders a labeled region and a descriptive message when supplied. Recovery content
stays in document order. A redirect produces a real safe link. The host owns retries and
exception handling; supply trusted user-facing text rather than raw exception objects or
stack traces.

## Generative transport

Version 0.2 uses required children arrays. Optional leading and actions are also arrays.
Every slot is validated recursively. Templates and defaults are validated as data;
executable behavior and arbitrary CSS are rejected.
