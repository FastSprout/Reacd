import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { alertNodeSchema } from '../../schema/alert/generative.schema.js';
import { GenerativeAlert } from './generative-alert.js';
import { GenerativeIcon } from './generative-icon.js';

const node = alertNodeSchema.parse({
  type: 'Alert',
  title: 'Review',
  message: 'Check the details.',
  intent: 'info',
  open: { state: 'visible', mode: 'readWrite' },
  actions: [{ id: 'review', label: 'Review details', action: 'review' }],
});

it('shares alert visibility and guards stale or missing host handlers', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'visible', kind: 'boolean', initial: true, access: 'readWrite' },
    ]),
  );
  const review = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeAlert node={node} registry={registry} actions={{ review }} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Review details' }));
  expect(review).toHaveBeenCalledWith({ state: registry });
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeAlert node={node} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Review details' }));
  expect(review).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Dismiss Review' }));
  expect(success(registry.read('visible')).value).toBe(false);
  expect(screen.queryByRole('status')).toBeNull();
  act(() => {
    registry.update('visible', true);
  });
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeAlert
        node={{ ...node, open: { state: 'visible', mode: 'read' } }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Dismiss Review' })).toBeNull();
});

it('renders literal alerts and reports invalid shared visibility references', () => {
  const registry = success(createStateRegistry([]));
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeAlert
        node={{ ...node, open: true, actions: undefined }}
        registry={registry}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toBeInTheDocument();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeAlert node={node} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('visible');
});

it('validates semantic icon alternatives at the trusted generative boundary', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeIcon node={{ type: 'Icon', name: 'check', label: 'Complete' }} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Complete' })).toBeInTheDocument();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <GenerativeIcon node={{ type: 'Icon', name: 'check' }} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Icon');
});
