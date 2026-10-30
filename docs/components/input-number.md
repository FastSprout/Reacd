---
template: preview.html
reacd_preview: InputNumber
reacd_preview_height: 560
---

# InputNumber

Edit a controlled number with keyboard entry and increment/decrement controls. The host
owns the value; `null` represents an empty field.

```tsx
import { InputNumber } from '@fastsprout/reacd';

<InputNumber
  label="Quantity"
  value={quantity}
  onValueChange={setQuantity}
  min={0}
  max={10}
  step={0.1}
/>;
```

Use ArrowUp and ArrowDown to step. Home and End select defined bounds. Shift uses the
large step and Alt uses the small step. Typed and pasted values use the selected locale.
The default is `en-US`, including during server rendering.

`locale="de-DE"` and `format={{ style: 'currency', currency: 'EUR' }}` display localized
currency while callbacks carry numbers. Decimal and percent formats are also available.
Formatting never changes the state value into a string.

| Prop                     | Meaning                                        |
| ------------------------ | ---------------------------------------------- |
| `label`, `description?`  | Visible label and accessible help              |
| `value`, `onValueChange` | Controlled `number \| null` and logical change |
| `min?`, `max?`, `step?`  | Ordered bounds and positive step               |
| `locale?`, `format?`     | Locale and closed numeric formatting options   |
| `required?`, `name?`     | Native form participation                      |
| `disabled?`, `readOnly?` | Interaction protection                         |
| `placeholder?`           | Hint while the value is empty                  |

Generative documents bind `value` to `nullableNumber` state. Read bindings render as
read-only fields. Shared state writes must satisfy active range constraints. Templates
own all colors, spacing, focus rings, and control sizes.

The interactive example uses Jotai and only reacd components.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-number.tsx"
```
