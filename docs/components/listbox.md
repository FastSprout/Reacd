---
template: preview.html
reacd_preview: Listbox
reacd_preview_height: 560
---

# Listbox

Choose from a visible list of options. Focus and typeahead help inspect choices; only
explicit activation requests a change. Values stay controlled by the host.

```tsx
import { Listbox } from '@fastsprout/reacd';

<Listbox label="Region" items={regions} value={region} onValueChange={setRegion} />;
```

Use `mode="multiple"` with a readonly string array for multiple selection. Single empty
values use `''`; multiple empty values use `[]`. Keys are opaque strings, so values such
as `'42'` are supported. Catalog values must be unique, already trimmed and contain
every selected key. Empty catalogs require empty selection.

| Prop | Meaning |
| --- | --- |
| `label`, `items` | Visible name and bounded option catalog |
| `value`, `onValueChange` | Controlled string or readonly string array |
| `mode?` | `single` by default, or `multiple` |
| `description?` | Help displayed beside the list |
| `locale?` | `en-US`, `pl-PL`, `de-DE` or `ar-EG`; defaults to `en-US` |
| `readOnly?`, `disabled?` | Inspection or full interaction protection |
| `status?` | `ready`, `loading` or `error` |
| `emptyMessage?` | Message for a ready empty catalog |
| `loadingMessage?`, `errorMessage?` | Status feedback |
| `clearLabel?` | Visible Clear selection action label |
| `name?`, `required?` | Canonical native form entries and validity |

Each option has `value`, `label`, optional `description` and optional `disabled`.
Disabled options cannot be newly selected. Previously selected disabled values remain
visible and serialized; Clear selection can remove them. Readonly and non-ready lists
remain inspectable but do not request writes. Disabled lists leave Tab order and do not
contribute form data.

Up/Down, Home/End and typeahead navigate the vertical list without selecting.
Enter/Space explicitly select or toggle; multiple mode supports Ctrl/Meta+A. Escape
preserves selection and remains available to a containing dialog. App controls text
direction independently of the explicit collation locale.

Callbacks receive exactly one logical value. Returning `false` rejects the request;
`true` or nothing allows it. The host still owns the resulting value. Asynchronous
callbacks and other return values are invalid. A callback cannot undo changes it already
made externally before returning a veto.

Requiredness validates submission, including readonly empty fields. Empty values remain
valid editing state. Multiple values post repeated entries with the same name in host
order. Native reset requests the complete initial selection while respecting the current
catalog and protection.

Generative documents bind the same component to text or selection state using explicit
read/readWrite access. Read bindings force readonly behavior. Mounted catalog
constraints apply to shared writes; no additional state kind is needed. Application code
uses TSX; no HTML, CSS or vendor objects are accepted.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/listbox.tsx"
```
