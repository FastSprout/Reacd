---
template: preview.html
reacd_preview: AuthForm
reacd_preview_height: 560
---

# AuthForm

AuthForm composes controlled reacd fields, provider actions and a native submit control.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/auth-form.tsx"
```

Required props are label, submitLabel and onSubmit. Optional title/description,
leading/header/children/footer, separatorLabel and error compose the form. Providers are
uniquely keyed label/onPress records with optional closed intent and disabled options.
Each provider is a separate type-button action; it never submits the form.

Loading and disabled both block fields, provider actions and submission. Loading adds a
live status using loadingLabel or Submitting, outside its busy credential fieldset. An
already-open Select also respects a later loading or disabled transition, including
across its portal; nested FormField metadata and explicit child name/required overrides
are preserved. Error is plain text announced as an alert. Native required/email
validation remains available through Input children.

The host owns controlled values, authentication and business validation. AuthForm does
not collect DOM credentials, call an identity provider, persist data or make requests.
Use Jotai to read the same controlled state in onSubmit. Do not nest forms. The trusted
renderer replaces a nested Form/AuthForm with a diagnostic rather than emitting invalid
nested native forms. Physically separate forms inside Modal portals remain independent:
submitting the portal form does not submit a logical ancestor form.

Version 0.2 generative transport replaces callbacks with registered submitAction and
provider action names. Loading/disabled may read explicit boolean state references.
Every slot, action and reference is validated before controls are exposed. Rendering and
browser validation require browser checks in addition to schema validation.
