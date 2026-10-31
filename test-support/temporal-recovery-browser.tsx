import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InputDate, InputTime, ReacdProvider } from '../src/index.js';
import type { TemporalRange } from '../src/core/date-time.js';
import '@fastsprout/reacd-shadcn/styles';

function RangeExample({ kind }: { kind: 'date' | 'time' }) {
  const initial =
    kind === 'date'
      ? { start: '2024-01-01', end: '2024-01-05' }
      : { start: '09:00:00', end: '10:00:00' };
  const replacement =
    kind === 'date'
      ? { start: '2024-02-01', end: '2024-02-05' }
      : { start: '13:00:00', end: '14:00:00' };
  const [value, setValue] = useState<TemporalRange>(initial);
  const [writes, setWrites] = useState<readonly TemporalRange[]>([]);
  const [decline, setDecline] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [saved, setSaved] = useState('');
  const properties = {
    mode: 'range' as const,
    label: `${kind} range`,
    value,
    name: 'range',
    readOnly,
    disabled,
    onValueChange(next: TemporalRange) {
      setWrites((current) => [...current, next]);
      if (!decline) setValue(next);
    },
  };
  return (
    <section aria-label={`${kind} reset proof`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(
            JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
          );
        }}
      >
        {kind === 'date' ? (
          <InputDate {...properties} referenceDate="2024-01-01" />
        ) : (
          <InputTime {...properties} />
        )}
        <label>
          Unrelated {kind}
          <input defaultValue="Initial" />
        </label>
        <button type="button" onClick={() => setValue(replacement)}>
          Replace
        </button>
        <button type="button" onClick={() => setDecline(!decline)}>
          Toggle decline
        </button>
        <button type="button" onClick={() => setReadOnly(!readOnly)}>
          Toggle readonly
        </button>
        <button type="button" onClick={() => setDisabled(!disabled)}>
          Toggle disabled
        </button>
        <button type="reset">Reset</button>
        <button type="submit">Save</button>
      </form>
      <output aria-label="Range value">{JSON.stringify(value)}</output>
      <output aria-label="Range writes">{JSON.stringify(writes)}</output>
      <output aria-label="Range saved">{saved}</output>
    </section>
  );
}

function RecoveryExample({ kind }: { kind: 'date' | 'time' }) {
  const initial = kind === 'date' ? '2024-02-29' : '10:00:00';
  const replacement = kind === 'date' ? '2024-01-15' : '09:00:00';
  const [value, setValue] = useState<string | null>(initial);
  const [saved, setSaved] = useState(0);
  const [writes, setWrites] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const properties = {
    label: `${kind} recovery`,
    value,
    max: initial,
    name: 'value',
    required: true,
    onValueChange(next: string | null) {
      setValue(next);
      setWrites(writes + 1);
    },
  };
  return (
    <section aria-label={`${kind} recovery proof`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(saved + 1);
        }}
      >
        {kind === 'date' ? (
          <InputDate {...properties} referenceDate="2024-02-29" />
        ) : (
          <InputTime {...properties} />
        )}
        <button type="button" onClick={() => setValue(replacement)}>
          Replace
        </button>
        <button type="button" onClick={() => setRefresh(refresh + 1)}>
          Refresh
        </button>
        <button type="submit">Save</button>
      </form>
      <output aria-label="Recovery saved">{saved}</output>
      <output aria-label="Recovery writes">{writes}</output>
      <output aria-label="Refresh count">{refresh}</output>
    </section>
  );
}

function Example() {
  const [templateId, setTemplateId] = useState('saas-modern-light');
  return (
    <ReacdProvider adapter={shadcnAdapter} templateId={templateId}>
      <FixtureContent
        onTemplate={() =>
          setTemplateId(
            templateId === 'saas-modern-light' ? 'erp-compact' : 'saas-modern-light',
          )
        }
      />
    </ReacdProvider>
  );
}

function FixtureContent({ onTemplate }: { onTemplate: () => void }) {
  return (
    <>
      <button onClick={onTemplate}>Switch template</button>
      <RangeExample kind="date" />
      <RangeExample kind="time" />
      <RecoveryExample kind="date" />
      <RecoveryExample kind="time" />
    </>
  );
}

const root = document.getElementById('root');
if (root === null) throw new Error('Missing temporal recovery fixture root.');
createRoot(root).render(<Example />);
