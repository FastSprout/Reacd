---
template: preview.html
reacd_preview: InputMenu
reacd_preview_height: 560
---

# InputMenu

Edit free text with optional suggestions. The host owns the accepted text. Selecting a
suggestion requests its label; the option key is not stored or submitted. Use SelectMenu
when the value must identify an option.

```tsx
import { InputMenu } from '@fastsprout/reacd';

<InputMenu
  label="Destination"
  value={destination}
  onValueChange={setDestination}
  items={[{ value: 'krakow', label: 'Kraków' }]}
/>;
```

`onValueChange(nextText)` receives one string. `onSuggestionSelect({value, text})` is an
optional synchronous preflight before a suggestion's text request. Return false from
either callback to veto that interaction. True or no return allows it. Exceptions,
Promises and other returns show an error. Host rejection retains accepted text and form
data. An unchanged suggestion may notify preflight but does not duplicate a text write.

| Fields                   | Meaning                           |
| ------------------------ | --------------------------------- |
| `label`, `description?`  | Visible name and help             |
| `value`, `onValueChange` | Controlled text request           |
| `items`                  | Canonical options; empty is valid |
| `visibleValues?`         | Ordered external result keys      |
| `onSuggestionSelect?`    | Key/text preflight, TSX only      |
| `open?`, `onOpenChange?` | Controlled disclosure pair        |
| `status?`                | Ready, loading or error           |
| `emptyMessage?`          | Empty-result copy                 |
| `loadingMessage?`        | Pending-result copy               |
| `errorMessage?`          | Failed-result copy                |
| `disabled?`, `readOnly?` | Interaction protection            |
| `clearable?`             | Show the clear control            |
| `required?`, `name?`     | Native forms                      |
| `placeholder?`           | Empty-input hint                  |

Local search folds case and diacritics in labels/descriptions and preserves order.
Supplying visibleValues uses the host's results without losing canonical identities.
Loading/error suppress stale suggestion activation but preserve editable text. The host
owns async cancellation and result freshness. Styles belong to the template.

Arrows browse, Enter activates a highlighted suggestion, Tab leaves without selecting,
and Escape closes the inner popup without clearing text. Plain Enter without an active
suggestion keeps normal form behavior. IME composition does not select or submit early.
Required validates native submission, including read-only empties; it allows clearing
while editing. Disabled controls are omitted. Only accepted text is submitted once.
Required feedback follows current text and flags, including host updates. Callback
failures remain separate. A wrapping FormField supplies name, required, disabled and
associated help/error feedback. Explicit name/required override its defaults; disabled
scopes protect open suggestion portals even when a child declares disabled=false.
Accepted clear returns focus to the input; a veto preserves the focused clear control.
Values and suggestion labels reject CR/LF rather than silently letting the browser
remove line breaks. Empty strings, numeric text and spaces remain valid. The same
single-line contract applies to JSON initial state and mounted host/atomic writes.

Generative transport binds value to text state with explicit read/readWrite access. Read
forces readOnly. Optional open binds a readWrite boolean. JSON transports text only: it
has no persistent suggestion key or preflight action. TSX preflight does not change
GenerativeActions or its context. Stores remain isolated for applications/SSR.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-menu.tsx"
```
