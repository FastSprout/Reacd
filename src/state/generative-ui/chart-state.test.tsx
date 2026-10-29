import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { chartNodeSchema } from '../../schema/chart/index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { GenerativeChart } from './generative-chart.js';
import { GenerativeUI } from './generative-ui.js';
const BASE = chartNodeSchema.parse({
  type: 'Chart',
  label: 'Generated activity',
  description: 'Category counts.',
  categories: [{ id: 'one', label: 'One' }],
  series: [{ id: 'count', label: 'Count', values: [1] }],
});
it('keeps literal data declarative and guards stale retry capabilities', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry([]));
  const retry = vi.fn();
  const view = render(
    <ReacdProvider>
      <GenerativeChart node={BASE} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Generated activity' })).toBeVisible();
  view.rerender(
    <ReacdProvider>
      <GenerativeChart
        node={{ ...BASE, state: 'error', retryAction: 'retry' }}
        registry={registry}
        actions={{ retry }}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry chart' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith({ state: registry });
  view.rerender(
    <ReacdProvider>
      <GenerativeChart
        node={{ ...BASE, state: 'error', retryAction: 'retry' }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry chart' }));
  expect(retry).toHaveBeenCalledOnce();
});

it('validates retry intents before exposing generated chart controls', async () => {
  const user = userEvent.setup();
  const document = {
    schemaVersion: '0.2',
    state: [],
    root: { ...BASE, state: 'error', retryAction: 'retry' },
  };
  const view = render(<GenerativeUI document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: retry');
  expect(screen.queryByRole('button')).toBeNull();
  const retry = vi.fn();
  view.rerender(<GenerativeUI document={document} actions={{ retry }} />);
  await user.click(screen.getByRole('button', { name: 'Retry chart' }));
  expect(retry).toHaveBeenCalledOnce();
});
