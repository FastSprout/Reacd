# Generative UI

Write application views in TSX. Use the optional version `0.2` JSON transport when an
agent needs to supply a view at runtime. Both paths use reacd components and the same
theme adapter.

## Define state separately

Each state definition has a unique key, a kind, an initial value, and component access.
Components bind to that key rather than copying values into their nodes.

```json
{
  "schemaVersion": "0.2",
  "state": [
    {
      "key": "customer.name",
      "kind": "text",
      "initial": "",
      "access": "readWrite"
    }
  ],
  "root": {
    "type": "VStack",
    "children": [
      {
        "type": "Input",
        "label": "Customer name",
        "value": { "state": "customer.name", "mode": "readWrite" }
      },
      {
        "type": "Text",
        "content": { "state": "customer.name", "mode": "read" }
      }
    ]
  }
}
```

Several fields can edit one key. Every reader updates through Jotai. A `read` binding
has no write operation. A state with `access: "read"` cannot be edited by components,
even if a document requests `readWrite`.

The definition's `access` sets the maximum component permission for the key. Each
binding's `mode` sets the permission for that particular property. A writable key can
therefore have many read-only displays alongside its editors. Host actions are a
separate trusted capability, not a third binding mode.

Keys are literal identifiers. A dot is a naming convention, not property access. Unknown
keys, duplicate definitions, wrong value types, and unsupported properties produce
validation diagnostics. Documents cannot contain HTML, CSS, callbacks, or JavaScript
expressions.

## Render a validated declaration

```tsx
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { GenerativeUI } from '@fastsprout/reacd/generative';

export function GeneratedView({ declaration }: { declaration: unknown }) {
  return <GenerativeUI adapter={shadcnAdapter} document={declaration} />;
}
```

Inside `ReacdProvider`, generative views may inherit its adapter. Standalone views
require an explicit adapter; missing selection produces a validation diagnostic.

Use `validateGenerativeDocument` for external objects or `parseGenerativeJson` for
strings. `defineGenerativeDeclaration` provides checked authoring in TypeScript. The
separately supported `0.1` transport does not have named state bindings.

The portable contract ships at `@fastsprout/reacd/generative-schema.json`. JSON Schema
checks the structural shape. The semantic validator additionally checks unique keys,
binding permissions, references, column types, and initial table consistency.

## State kinds

| Kind         | Value                           | Use                      |
| ------------ | ------------------------------- | ------------------------ |
| `text`       | String                          | Input, RadioGroup, Text  |
| `number`     | Finite number                   | Slider, Progress, Text   |
| `boolean`    | Boolean                         | Checkbox, Toggle, Text   |
| `tableRows`  | Unique row IDs and scalar cells | DataTable                |
| `selection`  | Unique string IDs               | DataTable, CheckboxGroup |
| `sorting`    | Column/direction descriptors    | DataTable                |
| `filters`    | Column/operator/value rules     | DataTable                |
| `pagination` | Page index and size             | DataTable                |

## Scope and lifecycle

A generative view creates its own registry. To share a scope explicitly, create a
registry with `createDocumentState(validatedDocument)` and pass it through the
`registry` prop. Use a separate registry for each SSR request.

Initial values apply when the registry is created. Theme changes and re-renders preserve
edits. Changing the definition shape requires an explicitly migrated registry.
`registry.reset()` validates and restores initial values atomically.

## Host actions

Button nodes reference registered action names. Trusted actions receive `{ state }`,
where `state.read(key)`, `state.update(key, value)`, and `state.transaction(updates)`
return structured results. Host actions can refresh read-only data; JSON cannot grant
itself host privileges.

Mounted bindings validate host writes against their property constraints too. An update
cannot make a shared Progress value exceed its range. Compound writes validate the
complete proposed state before committing.

For table-specific state, see [DataTable](../components/data-table.md).

## Compiled shared-state example

This example has two editors and a display sharing one key. A second key is read-only
for components, while a registered host action can refresh it. The example is compiled
and its reader, writer, permission, and action behavior is tested locally.

```tsx
--8<-- "examples/generative-state.tsx"
```
