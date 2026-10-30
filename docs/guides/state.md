# State with Jotai

Use typed atoms for application values and connect those values to controlled reacd
components.

```tsx
import { atom, useAtom } from 'jotai';
import { Input } from '@fastsprout/reacd';

const nameAtom = atom('');

export function NameField() {
  const [name, setName] = useAtom(nameAtom);

  return <Input label="Name" value={name} onValueChange={setName} />;
}
```

## Store ownership

Place the application's Jotai store above the visual adapter boundary. Use a separate
store for each application instance or SSR request.

Atoms describe values and their relationships. A design adapter renders the controls; it
does not own the business data.

## Named state in generative views

The optional generative transport defines state separately from the view tree. A
definition's unique key identifies one value in an application scope. Its `kind`
validates the value and its `access` sets the maximum component permission.

| Consumer             | Binding mode | Capability                            |
| -------------------- | ------------ | ------------------------------------- |
| Display such as Text | `read`       | Observe a compatible value            |
| Editor such as Input | `readWrite`  | Observe and propose a typed change    |
| Read-only definition | `read`       | Components cannot edit the key        |
| Trusted host action  | Host API     | Validate and update host-owned values |

A writable key can have several editors and any number of read-only displays. All share
the same reactive Jotai value. A writable binding cannot override a read-only
definition. Keys are literal identifiers, not expressions or property paths.

DataTable uses separate keys for rows, selection, sorting, filters, and pagination. Its
controller validates compound transitions atomically, including page resets and
selection cleanup, rather than treating every table interaction as a scalar setter. See
[Generative UI](generative-ui.md) for complete definitions and
[DataTable](../components/data-table.md) for its transition contract.

## Actions

Pass business functions through logical callbacks such as `onPress`, `onValueChange`,
and `onSubmit`. Do not mutate DOM elements to update a view.
