import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Calendar, ReacdProvider } from '../../../index.js';
import { GenerativeUI } from '../../../state/generative-ui/generative-ui.js';
import { createStateRegistry } from '../../../state/registry/state-registry.js';
import { success } from '../../../../test-support/data-table.js';

it('renders UTC references consistently across timezones and early years', () => {
  const view = (
    <ReacdProvider adapter={activeTestAdapter}>
      <Calendar
        label="Historical date"
        referenceDate="0001-01-01"
        value="0001-01-01"
        onValueChange={() => undefined}
      />
    </ReacdProvider>
  );
  vi.stubEnv('TZ', 'Pacific/Honolulu');
  const first = renderToString(view);
  vi.stubEnv('TZ', 'Asia/Tokyo');
  const second = renderToString(view);
  expect(second).toBe(first);
  expect(first).toContain('data-calendar-day="0001-01-01"');
  expect(first).toContain('January 1');
  vi.unstubAllEnvs();
});

it('hydrates dates and keeps server/client stores isolated', async () => {
  const user = userEvent.setup();
  const state = [{ key: 'delivery', kind: 'date', initial: null, access: 'readWrite' }];
  const document = {
    schemaVersion: '0.2',
    state,
    root: {
      type: 'Calendar',
      label: 'Delivery date',
      referenceDate: '2026-10-29',
      value: { state: 'delivery', mode: 'readWrite' },
    },
  };
  const server = success(createStateRegistry(state));
  const client = success(createStateRegistry(state));
  const container = globalThis.document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={activeTestAdapter} document={document} registry={server} />,
  );
  globalThis.document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={activeTestAdapter} document={document} registry={client} />,
    {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    },
  );
  await user.click(screen.getByRole('button', { name: /October 29, 2026$/ }));
  expect(success(client.read('delivery')).value).toBe('2026-10-29');
  expect(success(server.read('delivery')).value).toBe(null);
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
