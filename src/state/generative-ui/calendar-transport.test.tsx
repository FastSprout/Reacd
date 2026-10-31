import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';

const definitions = [
  {
    key: 'booking',
    kind: 'dateRange',
    access: 'readWrite',
    initial: { start: '2026-10-29', end: null },
  },
];
const node = {
  type: 'Calendar',
  mode: 'range',
  label: 'Booking calendar',
  referenceDate: '2026-10-29',
  min: '2026-10-01',
  max: '2026-10-31',
  value: { state: 'booking', mode: 'readWrite' },
};

it('constrains range updates through the generative dispatcher', async () => {
  const user = userEvent.setup();
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Calendar registry creation failed.');
  const model = { schemaVersion: '0.2', state: definitions, root: node };
  expect(validateGenerativeDocument(model).success).toBe(true);
  render(
    <GenerativeUI adapter={shadcnAdapter} document={model} registry={registry.data} />,
  );
  const calendar = screen.getByRole('group', { name: 'Booking calendar' });
  await user.click(
    within(calendar).getByRole('button', {
      name: /October 30, 2026$/,
    }),
  );
  expect(registry.data.read('booking')).toMatchObject({
    data: { value: { start: '2026-10-29', end: '2026-10-30' } },
  });
  act(() => {
    expect(
      registry.data.update('booking', {
        start: '2026-10-29',
        end: '2026-11-01',
      }).success,
    ).toBe(false);
  });
  expect(registry.data.read('booking')).toMatchObject({
    data: { value: { start: '2026-10-29', end: '2026-10-30' } },
  });
  expect(
    validateGenerativeDocument({
      ...model,
      state: [{ ...definitions[0], kind: 'date', initial: '2026-10-29' }],
    }).success,
  ).toBe(false);
});
