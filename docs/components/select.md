---
template: preview.html
reacd_preview: Select
reacd_preview_height: 560
---

# Select

Declare a controlled single choice or an explicit multiple choice. The adapter owns
popup positioning, keyboard navigation, labels and theme styling. Option keys must be
unique and belong to the current catalog. Existing single callers keep their API.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/select.tsx"
```

```tsx
<Select
  label="Status"
  value={status}
  items={statuses}
  onValueChange={setStatus}
/>
<Select
  mode="multiple"
  label="Included statuses"
  value={included}
  items={statuses}
  onValueChange={setIncluded}
/>
```

Single empty state is an empty string. Multiple empty state is a readonly empty array.
Callbacks propose exactly one logical value; the host owns acceptance. Disabled options
cannot be newly selected. Previously selected disabled values remain visible and valid.

`clearable` requests empty state without bypassing required submission checks. Required
empty controls block native form submission and focus the trigger. A named multiple
control serializes repeated values under the same name; an empty multiple selection
serializes no entry. Disabled fields are omitted. Read-only values remain in form data.

`readOnly` permits browsing options without committing changes. `loading` retains cached
values, locks changes and announces progress. These flags do not silently disable native
required validation. FormField metadata supplies name, required and descriptions;
explicit name/required overrides defaults while disabled remains inherited.

Trigger labels wrap within the engine's line limit. More than two selected options
produce a count summary. Full option labels and descriptions remain in the scrollable
popup. App direction controls layout and popup direction; no application CSS is needed.

Run the compiled [Select example](../examples/select.tsx) in the component preview.

Generative transport binds `value` to text state in single mode and selection state in
multiple mode. Read references force read-only behavior. Catalog membership constraints
also apply to external registry writes. Schema validation does not prove browser layout.
