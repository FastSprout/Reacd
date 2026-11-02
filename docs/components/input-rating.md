---
reacd_preview: InputRating
---

# InputRating

Collect a controlled rating, including half values. The host owns the number; zero
represents an unrated value. Each adapter keeps its selected SDK's native controls and
interaction.

```tsx
import { InputRating } from '@fastsprout/reacd';

<InputRating
  label="Service rating"
  value={rating}
  onValueChange={setRating}
  length={5}
  step={0.5}
  clearable
/>;
```

The default shadcn adapter composes its native scalar Slider. Arrow keys change one
step, Home selects zero and End selects the maximum. Material UI uses its native Rating
radio choices and star hover preview; readonly ratings use its nonfocusable image
semantics. Neither adapter replaces its SDK's keyboard engine.

Omitted `hoverable` uses the native default: false in shadcn, true in Material UI.
Explicit `hoverable=true` is unsupported in shadcn; explicit `hoverable=false` is
unsupported in Material UI. Those requests throw an adapter/component diagnostic rather
than silently changing meaning or inventing pointer interaction.

Hover previews never change host state. `clearable` adds a labelled clear button. When
required, zero blocks logical form submission. shadcn focuses its native Slider thumb;
Material UI focuses the named SDK form field group. The `name` prop applies to the SDK's
native editable input. Material readonly image output retains its named value through a
native Material Input successful form control; it adds no editable UI. Zero serializes
as the SDK's empty choice. Unnamed ratings omit that readonly control, and disabled or
inactive fields omit their value.

| Prop                       | Meaning                               |
| -------------------------- | ------------------------------------- |
| `label`, `description?`    | Visible label and accessible help     |
| `value`, `onValueChange`   | Controlled number and logical change  |
| `length?`                  | One through ten stars; default five   |
| `step?`                    | One star or half a star; default one  |
| `clearable?`, `hoverable?` | Clear action and pointer-only preview |
| `required?`, `name?`       | Native form validation and field name |
| `disabled?`, `readOnly?`   | Interaction protection                |

Generative documents bind `value` to number state. Range and step constraints apply to
initial values and active shared host writes. Read bindings render read-only ratings.
Icon choice, color, spacing and focus appearance belong to the template adapter.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-rating.tsx"
```
