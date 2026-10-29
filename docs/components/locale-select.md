---
template: preview.html
reacd_preview: LocaleSelect
reacd_preview_height: 560
---

# LocaleSelect

A controlled locale selector with host-supplied language names. Canonical BCP 47 codes
identify locales; the host owns translations, application language and direction.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/locale-select.tsx"
```

```tsx
<LocaleSelect
  label="Language"
  value={locale}
  locales={locales}
  onValueChange={setLocale}
/>
```

The locale list must be nonempty, bounded and unique by code. The selected code must
exist in that list. Aliases such as `en-us` are rejected; use the canonical `en-US`.
Labels are supplied by the host and remain readable when they wrap.

| Prop                  | Contract                                           |
| --------------------- | -------------------------------------------------- |
| label                 | Required visible accessible label                  |
| value / onValueChange | Controlled canonical code and one-value callback   |
| locales               | Readonly code/label entries supplied by the host   |
| description           | Optional accessible supporting text                |
| name / required       | Native form name and validation                    |
| readOnly              | Allow inspection while retaining the current value |
| disabled              | Prevent interaction and omit form data             |

Arrow keys, typeahead, Enter and Escape operate the themed option popup. Focus returns
to the trigger after selection. The adapter renders the selected label on the server
before popup options mount. Changing a locale does not fetch resources or mutate the
document. Use App language/direction or your localization service to apply the result.

Generative UI binds value to text state in read or readWrite mode. Both initial and
subsequent host values must belong to the configured locale list. A reader cannot write
through the control. Each application keeps its own Jotai store.

The compiled [LocaleSelect example](../examples/locale-select.tsx) applies language and
direction through App and demonstrates read-only and disabled states.
