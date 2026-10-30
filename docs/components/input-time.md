---
template: preview.html
reacd_preview: InputTime
reacd_preview_height: 560
---

# InputTime

Edit local wall-clock times through a labelled segmented control. The application
supplies canonical strings and callbacks; the theme adapter renders the input, clear
actions, focus, descriptions and native validation.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-time.tsx"
```

```tsx
import { InputTime } from '@fastsprout/reacd';

<InputTime label="Arrival time" value="12:30:00" onValueChange={setArrival} required />;
```

## Values and ranges

A single value is `HH:mm:ss` or null. Hours use 00 through 23; seconds are required.
These values have no date, offset or timezone. Interpret them in your business domain
before converting them to an instant.

Use explicit `mode="range"` with `{start, end}`. Each endpoint is a string or null, and
either endpoint may remain empty while editing. Complete ranges must be ordered. Equal
endpoints are accepted. Overnight ranges require a separate domain model.

```tsx
<InputTime
  mode="range"
  label="Availability"
  value={{ start: '09:00:00', end: '17:00:00' }}
  onValueChange={setAvailability}
  min="08:00:00"
  max="18:00:00"
  required
  name="availability"
/>
```

## Keyboard and validation

Type or use Up/Down to edit a segment. Left/Right and Tab navigate segments. Incomplete
segments remain local draft data; callbacks receive canonical complete endpoints or
null. Clear requests an empty endpoint. The host remains authoritative when it declines
a proposed value. Out-of-bounds and reversed-range edits are rejected with associated
feedback.

`required` blocks native submission while a single value or either range endpoint is
empty. Invalid submission focuses the incomplete visible field. `name` submits canonical
time strings; range names are `name.start` and `name.end`. Disabled inputs do not
submit. Read-only inputs remain available to keyboard and assistive technology.

Incomplete nonempty drafts block submission even when optional. A fully empty optional
field may submit when its committed value is also empty. Previously saved values cannot
silently mask missing visible segments. Invalid submission announces the incomplete
field and focuses its first missing segment.

## Locale and layout direction

The default locale is explicitly `en-US`. Set `locale` for localized numeric segments.
Display currently uses 24-hour time, second precision and leading zeros.

`App.direction` controls the outer layout, while `locale` controls numeric bidi and
segment ordering. English time keeps its left-to-right numeric order inside an RTL App.
Arabic locales use their localized numeric layout. The adapter's fixed private UTC date
anchor prevents host DST and timezone differences from changing a local time; it does
not attach a timezone to your public value.

## Props

| Prop                | Contract                                         |
| ------------------- | ------------------------------------------------ |
| label               | Required visible label                           |
| mode                | Optional single, or explicit range               |
| value               | String or null; start/end DTO in range mode      |
| onValueChange       | Matching typed controlled callback               |
| min / max           | Optional inclusive canonical time bounds         |
| locale              | Supported BCP 47 locale; default en-US           |
| description         | Optional accessible supporting text              |
| name                | Optional native form field name                  |
| required            | Require the single value or both range endpoints |
| disabled / readOnly | Protect editing                                  |

The API accepts no native tags, styles, classes, browser events or vendor date objects.

## Runnable example

The catalog's Fields section mounts the compiled
[InputTime example](../examples/input-time.tsx). It demonstrates canonical state, range
clearing, native required validation, Arabic locale, scoped RTL and protected editing.

## FormField composition

Inside FormField, the control inherits the nearest logical name and required default. An
explicit name or required flag overrides that default. A disabled FormField always
disables segmented editing, clear actions and native validation/data participation; a
child cannot re-enable it with disabled={false}. Range names use .start and .end. The
field's descriptions and controlled errors are associated with each endpoint, while the
control keeps its own description and incomplete-draft feedback.
