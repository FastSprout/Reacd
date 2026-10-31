import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { ChartExample } from '../../../../docs/examples/chart.js';
it('hydrates deterministic SVG and isolates request-local data', async () => {
  const user = userEvent.setup();
  const tree = (
    <ReacdProvider adapter={shadcnAdapter}>
      <ChartExample />
    </ReacdProvider>
  );
  const server = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = server;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const label = screen.getByRole('textbox', { name: 'Chart label' });
  await user.clear(label);
  await user.type(label, 'Client chart');
  expect(screen.getByRole('img', { name: 'Client chart' })).toBeVisible();
  expect(renderToString(tree)).toContain('Reference activity');
  expect(renderToString(tree)).not.toContain('Client chart');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
