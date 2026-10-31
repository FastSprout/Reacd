import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Calendar } from '../../../components/calendar/index.js';
import type { CalendarProps } from '../../../components/calendar/index.js';
import { ReacdProvider } from '../../../state/provider/provider.js';
import { GenerativeUI } from '../../../state/generative-ui/generative-ui.js';

const BASE = {
  label: 'Required delivery calendar',
  referenceDate: '2026-10-29',
  required: true,
  readOnly: true,
  name: 'delivery',
  onValueChange: () => undefined,
} as const;

const incompleteCases: readonly CalendarProps[] = [
  { ...BASE, value: null },
  { ...BASE, mode: 'range', value: { start: '2026-10-29', end: null } },
  { ...BASE, mode: 'range', value: { start: null, end: '2026-10-30' } },
];

function form() {
  const element = screen.getByRole('form', { name: 'Delivery form' });
  if (!(element instanceof HTMLFormElement)) throw new Error('Missing form.');
  return element;
}

function mountCalendar(properties: CalendarProps) {
  const submit = vi.fn<() => void>();
  render(
    <form
      aria-label="Delivery form"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ReacdProvider adapter={shadcnAdapter}>
        <Calendar {...properties} />
      </ReacdProvider>
    </form>,
  );
  return submit;
}

it.each(incompleteCases)(
  'blocks required read-only incomplete selection %# and focuses the calendar',
  (properties) => {
    const submit = mountCalendar(properties);
    form().requestSubmit();
    expect(submit).not.toHaveBeenCalled();
    expect(form().checkValidity()).toBe(false);
    expect(screen.getByRole('group', { name: BASE.label })).toHaveFocus();
  },
);

const completeCases: readonly {
  properties: CalendarProps;
  serialized: Record<string, string>;
}[] = [
  {
    properties: { ...BASE, value: '2026-10-29' },
    serialized: { delivery: '2026-10-29' },
  },
  {
    properties: {
      ...BASE,
      mode: 'range',
      value: { start: '2026-10-29', end: '2026-10-30' },
    },
    serialized: {
      'delivery.start': '2026-10-29',
      'delivery.end': '2026-10-30',
    },
  },
];

it.each(completeCases)(
  'submits complete read-only selection %# with canonical fields',
  ({ properties, serialized }) => {
    const submit = mountCalendar(properties);
    expect(form().checkValidity()).toBe(true);
    form().requestSubmit();
    expect(submit).toHaveBeenCalledExactlyOnceWith();
    expect(Object.fromEntries(new FormData(form()))).toEqual(serialized);
  },
);

it.each(incompleteCases)(
  'exempts disabled incomplete read-only selection %# and omits its fields',
  (properties) => {
    const submit = mountCalendar({ ...properties, disabled: true });
    expect(form().checkValidity()).toBe(true);
    form().requestSubmit();
    expect(submit).toHaveBeenCalledExactlyOnceWith();
    expect(Array.from(new FormData(form()))).toEqual([]);
  },
);

const bindingCases = [
  { kind: 'date', initial: null, mode: 'single' },
  {
    kind: 'dateRange',
    initial: { start: '2026-10-29', end: null },
    mode: 'range',
  },
] as const;

it.each(bindingCases)(
  'blocks required generative read binding for $kind',
  ({ kind, initial, mode }) => {
    const submit = vi.fn<() => void>();
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'delivery', kind, initial, access: 'readWrite' }],
      root: {
        type: 'Calendar',
        label: BASE.label,
        referenceDate: BASE.referenceDate,
        required: true,
        name: 'delivery',
        mode,
        value: { state: 'delivery', mode: 'read' },
      },
    };
    render(
      <form
        aria-label="Delivery form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <GenerativeUI adapter={shadcnAdapter} document={document} />
      </form>,
    );
    expect(screen.getByRole('group', { name: BASE.label })).toHaveAttribute(
      'data-readonly',
      'true',
    );
    form().requestSubmit();
    expect(submit).not.toHaveBeenCalled();
    expect(form().checkValidity()).toBe(false);
    expect(screen.getByRole('group', { name: BASE.label })).toHaveFocus();
  },
);
