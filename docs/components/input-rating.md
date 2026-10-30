---
template: preview.html
reacd_preview: InputRating
reacd_preview_height: 560
---

# InputRating

Collect a controlled star rating, including half-star values, with one accessible
slider. The host owns the number. Zero represents an unrated value.

```tsx
import { InputRating } from '@fastsprout/reacd';

<InputRating
  label="Service rating"
  value={rating}
  onValueChange={setRating}
  length={5}
  step={0.5}
  clearable
  hoverable
/>;
```

Arrow keys change one step. Home selects zero and End selects the maximum. Hover
previews never change state. `clearable` adds a labelled clear button. The selected
value is announced as a number of stars. When required, zero blocks form submission and
focus moves to the visible slider.

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
