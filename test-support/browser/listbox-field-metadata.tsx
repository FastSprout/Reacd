import '@fastsprout/reacd-shadcn/styles';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SharedListbox } from '../../src/adapter/shared/listbox/listbox.adapter.js';
import { PrimitiveScope } from '../../src/adapter/shared/primitives/context.js';
import { muiPrimitives } from '../../src/adapter/mui/primitives/primitives.js';
import { shadcnPrimitives } from '../../src/adapter/shadcn/primitives/primitives.js';
import { browserAdapter } from './adapter.js';
import { FieldMetadataContext } from '../../src/renderer/form-field/field-metadata.js';

function Harness() {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [override, setOverride] = useState(false);
  const [error, setError] = useState(false);
  const [calls, setCalls] = useState<readonly (readonly unknown[])[]>([]);
  const [submits, setSubmits] = useState(0);
  return (
    <main>
      <h1>Listbox metadata acceptance</h1>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />
        Disable group
      </label>
      <label>
        <input
          type="checkbox"
          checked={readOnly}
          onChange={(event) => setReadOnly(event.target.checked)}
        />
        Readonly choice
      </label>
      <label>
        <input
          type="checkbox"
          checked={override}
          onChange={(event) => setOverride(event.target.checked)}
        />
        Override required
      </label>
      <label>
        <input
          type="checkbox"
          checked={error}
          onChange={(event) => setError(event.target.checked)}
        />
        Group error
      </label>
      <form
        aria-label="Metadata form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmits((previous) => previous + 1);
        }}
      >
        <p id="group-help">Group help</p>
        <p id="group-error">{error ? 'Server rejected selection' : ''}</p>
        <FieldMetadataContext.Provider
          value={{
            name: 'inherited',
            required: true,
            disabled,
            error: error ? 'Server rejected selection' : '',
            descriptionIds: ['group-help', 'group-error', 'group-help'],
          }}
        >
          <SharedListbox
            label="Control"
            items={[
              { value: '42', label: 'Answer' },
              { value: 'b', label: 'Beta' },
            ]}
            value={value}
            disabled={false}
            readOnly={readOnly}
            required={override ? false : undefined}
            description="Local help"
            onValueChange={(...args: readonly unknown[]) => {
              setCalls((previous) => [...previous, args]);
              const [next] = args;
              if (typeof next === 'string') setValue(next);
            }}
          />
        </FieldMetadataContext.Provider>
        <button type="submit">Save</button>
      </form>
      <output data-testid="calls">{JSON.stringify(calls)}</output>
      <output data-testid="submits">{submits}</output>
    </main>
  );
}
const root = document.getElementById('root');
if (root === null) throw new Error('Missing acceptance root.');
createRoot(root).render(
  <PrimitiveScope
    primitives={browserAdapter.id === 'material-ui' ? muiPrimitives : shadcnPrimitives}
  >
    <Harness />
  </PrimitiveScope>,
);
