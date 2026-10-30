---
template: preview.html
reacd_preview: PinInput
reacd_preview_height: 560
---

# PinInput

Enter a controlled numeric or alphanumeric code. A string preserves leading zeros and
incomplete input. The default length is six characters.

```tsx
import { PinInput } from '@fastsprout/reacd';

<PinInput
  label="Verification code"
  value={code}
  onValueChange={setCode}
  length={6}
  separatorEvery={3}
  otp
  required
/>;
```

Selection, arrows, deletion, and paste work through one accessible input. Pasted
whitespace and hyphens are removed. Numeric mode accepts ASCII digits;
`inputType="alphanumeric"` also accepts ASCII letters, preserving case.

`mask` hides characters on screen. `otp` enables one-time-code autocomplete; whether SMS
autofill appears depends on the browser and operating system. Masking does not encrypt
the code or change how the host receives it.

| Prop                         | Meaning                                  |
| ---------------------------- | ---------------------------------------- |
| `label`, `description?`      | Visible label and accessible help        |
| `value`, `onValueChange`     | Controlled string and logical change     |
| `onComplete?`                | User change reaching the complete length |
| `length?`, `separatorEvery?` | Slot count and optional visual grouping  |
| `inputType?`                 | `numeric` or `alphanumeric`              |
| `mask?`, `otp?`              | Password masking and OTP autocomplete    |
| `required?`, `name?`         | Form validation and field name           |
| `disabled?`, `readOnly?`     | Interaction protection                   |

Generative documents bind `value` to text state and may name a registered
`completeAction`. Read bindings are read-only. Code length and alphabet constraints
apply to shared host writes. Applications provide no HTML or CSS.

The example demonstrates input behavior only; submission performs no network
authentication and does not verify that a code is correct.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/pin-input.tsx"
```
