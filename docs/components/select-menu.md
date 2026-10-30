---
template: preview.html
reacd_preview: SelectMenu
reacd_preview_height: 560
---

# SelectMenu

Select one or several canonical option keys through a searchable popup. The host owns
the selection; query text is a separate value and never becomes a key by typing. For
editable free text, use [InputMenu](input-menu.md).

```tsx
import { SelectMenu } from '@fastsprout/reacd';

<SelectMenu
  label="Records"
  items={records}
  mode="multiple"
  value={selectedKeys}
  onValueChange={setSelectedKeys}
/>;
```

Default mode single uses a string key or ''. Mode multiple uses a readonly unique array,
with [] meaning empty. Options use the canonical SelectionOption shape: value, label,
optional description and disabled. Values are opaque strings, including numeric-looking
keys, with no edge whitespace. Empty catalogs are supported.

| Fields                       | Meaning                          |
| ---------------------------- | -------------------------------- |
| `label`, `description?`      | Visible name and help            |
| `items`                      | Complete canonical option domain |
| `mode?`                      | Single or multiple               |
| `value`, `onValueChange`     | Controlled logical selection     |
| `query?`, `onQueryChange?`   | Controlled search pair           |
| `queryReadOnly?`             | Lock only the search channel     |
| `open?`, `onOpenChange?`     | Controlled disclosure pair       |
| `visibleValues?`             | Ordered external result keys     |
| `status?`                    | Ready, loading or error          |
| `emptyMessage?`              | Empty-result copy                |
| `loadingMessage?`            | Pending-result copy              |
| `errorMessage?`              | Failed-result copy               |
| `readOnly?`, `disabled?`     | Selection/all-channel locks      |
| `clearable?`, `placeholder?` | Clear control and empty hint     |
| `name?`, `required?`         | Native selected-value forms      |

Callbacks receive exactly one logical value and return boolean or void. False vetoes;
throws, Promises and other returns produce feedback. A whole multiple array is validated
and requested once. Retained keys keep their order; additions append. Disabled old
selections remain valid and submitted, and may be removed or cleared. New disabled
choices cannot be selected. Requiredness validates submission only; it permits empty
editing requests. Host rejection never changes displayed selection.

Search folds case/diacritics in labels/descriptions while retaining canonical order.
visibleValues supplies external result order without removing selected options from the
full domain. The host owns async result freshness. Query persists across close,
selection and blur. Selection never silently resets a separately controlled query.
ReadOnly selection may still be searched; queryReadOnly protects that separate value.

Arrows browse, Enter activates, Tab leaves without implicit selection, and Escape closes
the inner popup first. Composition does not commit or submit early. Accepted clear
focuses the trigger; explicit veto keeps focus/value. Full selected labels wrap. Native
forms submit keys, not labels or query: single uses one field, multiple uses repeated
same-name fields. Required read-only empties remain invalid and focus the visible
trigger with feedback. Disabled fields are omitted. Inside FormField, the control
inherits name and required defaults, description/error associations and disabled safety.
An explicit disabled=false cannot enable a disabled scope, including an already open
popup. Explicit name and required override defaults.

Generative single value binds text, multiple binds selection, and optional query binds a
different text key. Read value forces readOnly; read query forces queryReadOnly without
blocking an independent selection writer. Optional open uses a readWrite boolean
reference. Membership and query single-line constraints protect initial state and
mounted host/atomic writes. Stores remain isolated for apps/SSR.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/select-menu.tsx"
```
