---
template: preview.html
reacd_preview: Calendar
reacd_preview_height: 560
---

# Calendar

Calendar provides controlled single-date and date-range selection. Application code uses
canonical strings, while the trusted shadcn adapter owns date objects, keyboard
navigation and rendering.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/calendar.tsx"
```

## Properties

| Property       | Contract                                                           |
| -------------- | ------------------------------------------------------------------ |
| label          | Required accessible name.                                          |
| referenceDate  | Required explicit YYYY-MM-DD empty-view and today reference.       |
| value          | Required date or null, or readonly start/end DTO in range mode.    |
| onValueChange  | Required typed controlled-state callback.                          |
| mode           | single by default; range is explicit.                              |
| min, max       | Optional inclusive canonical bounds, ordered when both supplied.   |
| locale         | Supported Intl date locale; en-US by default, Gregorian calendar.  |
| numberOfMonths | One by default; accepts one or two visible months.                 |
| weekStartsOn   | Monday by default; zero Sunday through six Saturday.               |
| description    | Optional associated help text.                                     |
| required       | Require a date or complete range on form submission.               |
| name           | Optional native field name; ranges submit name.start and name.end. |
| readOnly       | Preserve navigation and focus while preventing selection updates.  |
| disabled       | Prevent navigation, selection and native field submission.         |

Dates use proleptic Gregorian years 0001 through 9999. Timestamps, SDK objects,
impossible dates, reversed complete ranges, out-of-bounds values and styling/native
event props are rejected. Either range endpoint may be null while editing. A host
reference date outside bounds opens the nearest permitted month.

## Interaction

Arrow keys move among dates; Home/End move to week boundaries and PageUp/PageDown change
months. Enter or Space selects. App direction supplies RTL arrow behavior. Single
selection toggles to null unless required. A first range click starts a partial range; a
second click completes it in date order, including an equal endpoint. Clicking after a
complete range starts a new range. Callbacks request host changes and never mutate
controlled values.

The calendar region exposes its label and help text. Native required validation focuses
the visible calendar. Day targets retain the shared minimum touch size; narrow screens
scroll within the labelled grid viewport rather than creating page overflow. Two months
reflow when necessary. Selected-day foreground and background come from validated
template tokens.

Locale formatting always uses Gregorian dates and UTC. The component never chooses an
initial date from the ambient clock, timezone or browser locale. Provide the same
referenceDate and controlled values to server and client.

## Generative UI

Version 0.2 binds value to date or dateRange state according to mode. References grant
read or readWrite access. Read bindings force readonly selection while preserving
navigation. Bounded constraints apply to every shared write, with isolated app and SSR
stores.

The adapter composes DayPicker v10 and shadcn day buttons. Multiple-date selection,
arbitrary slots, public date objects and styling escapes are outside the closed API.
