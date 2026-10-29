---
template: preview.html
reacd_preview: InputDate
reacd_preview_height: 560
---

# InputDate

Edit Gregorian calendar dates through a labelled segmented field. Supply canonical ISO
strings and a host reference date; the theme adapter owns labels, focus, native
validation, clear actions and rendering.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-date.tsx"
```

```tsx
import { InputDate } from 'reacd';

<InputDate
  label="Event date"
  referenceDate="2024-02-28"
  value="2024-02-29"
  onValueChange={setEventDate}
  required
/>;
```

## Dates and references

Values are Gregorian `YYYY-MM-DD` strings or null. The supported years are 0001
through 9999. Calendar validation rejects impossible dates instead of normalizing them.
Dates have no time, timezone or offset. Interpret a calendar date in your domain before
converting it into an instant.

`referenceDate` is required, even when the value is empty. It provides an explicit
placeholder and editing reference without reading the host clock. It does not commit a
value and may lie outside the field's min/max bounds.

## Ranges

Explicit `mode="range"` accepts a readonly start/end object. Each endpoint is a
canonical date or null. Either endpoint may be empty while editing. Both are required
for successful submission when `required` is set. Complete ranges must be ordered; equal
endpoints are allowed.

```tsx
<InputDate
  mode="range"
  label="Booking dates"
  referenceDate="2024-02-28"
  value={{ start: '2024-02-28', end: '2024-03-01' }}
  onValueChange={setBookingDates}
  min="2024-01-01"
  max="2024-12-31"
  name="booking"
  required
/>
```

## Keyboard and form behavior

Type or use Up/Down to edit a segment. Left/Right and Tab navigate according to the
locale's numeric order. Clear requests an empty endpoint. The host remains authoritative
when it rejects a proposed value. Bounds and range ordering reject invalid requests with
associated feedback.

Native validity observes the visible draft. Incomplete nonempty drafts block submission
even when optional. Completely empty optional state is allowed. Old committed dates
cannot mask missing visible segments. Invalid submission announces the field and focuses
its first missing editable segment.

Ordinary same-value updates preserve an unfinished draft. To intentionally discard a
draft while restoring the same canonical value, change the field's React key. The
compiled example uses a Jotai reset revision for its Restore action.

`name` submits canonical dates. Range fields submit `name.start` and `name.end`.
Disabled inputs do not submit. Read-only fields remain accessible for navigation and
inspection. SDK date objects never enter your state or FormData.

## Locale and direction

The default locale is explicitly `en-US`. A supported `locale` changes numeric order and
digits. Display remains Gregorian even if the locale normally uses another calendar. An
existing calendar extension is replaced with Gregorian internally.

`App.direction` controls outer layout independently of numeric locale direction. English
segments retain left-to-right numeric order inside an RTL App. Arabic locales retain
their numeric bidi behavior. Rendering does not select dates from the ambient clock or
timezone.

The field does not open an implicit calendar popup. Compose the separate Calendar
component with the same controlled state when your application needs both entry modes.

## Props

| Prop                | Contract                                             |
| ------------------- | ---------------------------------------------------- |
| label               | Required visible field label                         |
| referenceDate       | Required canonical non-null editing reference        |
| mode                | Optional single, or explicit range                   |
| value               | String or null; readonly start/end DTO in range mode |
| onValueChange       | Matching typed controlled callback                   |
| min / max           | Optional inclusive canonical date bounds             |
| locale              | Supported BCP 47 locale; default en-US               |
| description         | Optional accessible supporting text                  |
| name                | Optional native form field name                      |
| required            | Require the single value or both endpoints           |
| disabled / readOnly | Protect editing                                      |

No HTML, styles, classes, native events or vendor date objects are accepted.

## Runnable example

The catalog's Fields section mounts the compiled
[InputDate example](../examples/input-date.tsx), with leap-date state, range clearing,
native required validation, Arabic locale, scoped RTL and protected editing.

## FormField composition

Inside FormField, the control inherits the nearest logical name and required default. An
explicit name or required flag overrides that default. A disabled FormField always
disables segmented editing, clear actions and native validation/data participation; a
child cannot re-enable it with disabled={false}. Range names use .start and .end. The
field's descriptions and controlled errors are associated with each endpoint, while the
control keeps its own description and incomplete-draft feedback.
