---
template: preview.html
reacd_preview: Input
reacd_preview_height: 560
---

# Input

Edit controlled single-line text with native form behavior and semantic validation. The
theme adapter owns rendering, focus, labels and containment.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input.tsx"
```

```tsx
<Input
  label="Contact email"
  inputType="email"
  value={email}
  onValueChange={setEmail}
  autoComplete="email"
  name="contact"
  required
/>
```

Callbacks receive exactly one string. The host decides whether to accept proposed
writes. Disabled, read-only and loading controls do not request edits. Loading is
host-controlled busy state; it does not claim that a remote write succeeded.

Minimum length and complete email syntax constrain submission while incomplete drafts
remain editable. Maximum length constrains controlled state and shared host writes.
Required, minimum and email rules still apply to read-only values. The host must fix
missing read-only business data; disabled controls omit both validation and FormData.

Controlled values cannot contain CR/LF. Email values cannot contain leading/trailing
ASCII whitespace. Native inputs would silently strip these characters; rejecting them
keeps rendering and canonical host state consistent. Ordinary native paste/typing
already produces normalized strings. Internal email syntax errors remain valid drafts.

FormField supplies default name/required flags, guidance and controlled errors. Explicit
name/required overrides defaults; inherited disabled always wins. The native input keeps
its own visible label.

| Prop                           | Contract                                          |
| ------------------------------ | ------------------------------------------------- |
| label                          | Required visible label                            |
| value / onValueChange          | Controlled string and typed callback              |
| inputType                      | text, email, password or search; default text     |
| description / placeholder      | Accessible guidance and empty-field hint          |
| name                           | Optional native FormData key                      |
| required / disabled / readOnly | Logical form behavior                             |
| loading                        | Host-controlled busy state; retain canonical data |
| minLength / maxLength          | Ordered UTF-16 limits from 0 to 10,000            |
| autoComplete                   | Closed autofill intent                            |

`autoComplete` accepts off, on, name, email, username, current-password, new-password or
one-time-code.

No native events, HTML, classes, styling props, uncontrolled values or arbitrary native
attributes are accepted. Password feedback never includes the field value.

Optional generative transport binds text with explicit read/readWrite access. Read
bindings force read-only behavior. Host writes honor maximum length and normalization
constraints; minimum length and complete email syntax remain submission rules.

The compiled [Input example](../examples/input.tsx) covers required email submission,
loading, read-only/disabled behavior, inherited field metadata and scoped RTL.
