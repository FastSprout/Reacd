---
template: preview.html
reacd_preview: InputTags
reacd_preview_height: 560
---

# InputTags

Collect a controlled list of unique text tokens. The host owns committed tags; the
adapter keeps a separate editable draft until the host accepts an addition.

```tsx
import { InputTags } from '@fastsprout/reacd';

<InputTags
  label="Topics"
  value={topics}
  onValueChange={setTopics}
  maxTags={4}
  maxTagLength={24}
  addOnPaste
  delimiters={['comma', 'newline']}
/>;
```

Enter adds a draft. Configured delimiter keys also add it. Arrow keys move into selected
chips; Backspace/Delete remove a focused chip. Each chip has a named remove button.
Scoped App direction mirrors keyboard navigation in RTL.

`addOnPaste` commits an entire delimited batch atomically. Duplicate tags, excessive
counts and oversized tags expose an error and retain the editable draft. A host
rejecting a proposal keeps both its committed tags and the draft. IME composition
prevents premature Enter, paste or blur commits.

| Prop                                     | Meaning                                |
| ---------------------------------------- | -------------------------------------- |
| `label`, `description?`                  | Visible label and help                 |
| `value`, `onValueChange`                 | Controlled strings and change callback |
| `maxTags?`, `maxTagLength?`              | Count and per-tag length limits        |
| `delimiters?`                            | Comma, semicolon or newline            |
| `addOnPaste?`, `addOnTab?`, `addOnBlur?` | Additional commit triggers             |
| `disabled?`, `readOnly?`                 | Interaction protection                 |
| `required?`, `name?`                     | Committed selection and form name      |
| `placeholder?`                           | Empty-draft hint                       |

Defaults allow 100 tags, 80 characters per tag, and comma-separated entry. Additional
paste/Tab/blur commit triggers default to disabled. Submitted values remain separate
fields with the same name. A draft alone cannot satisfy required. Tag values must
already be trimmed and unique; raw additions are trimmed before validation. Unicode text
is supported; regular expressions and object converters are not public props.

Generative documents bind `value` to selection state with read/readWrite access. Read
bindings are read-only. Count, length and canonical token constraints apply to initial
values and active host updates. Templates own all styles.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/input-tags.tsx"
```
