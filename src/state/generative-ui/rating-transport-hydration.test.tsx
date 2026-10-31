import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [{ key: 'rating', kind: 'number', initial: 2.5, access: 'readWrite' }];
const document = {
  schemaVersion: '0.2',
  state,
  root: {
    type: 'InputRating',
    label: 'Rating',
    step: 0.5,
    length: 5,
    value: { state: 'rating', mode: 'readWrite' },
  },
};
describe('rating transport and hydration', () => {
  it('hydrates stable slider labels and isolated server/client state', async () => {
    const user = userEvent.setup();
    const server = success(createStateRegistry(state));
    const client = success(createStateRegistry(state));
    const container = globalThis.document.createElement('div');
    container.innerHTML = renderToString(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={server} />,
    );
    globalThis.document.body.appendChild(container);
    const label = screen.getByText('Rating', { exact: true }).id;
    const errors: unknown[] = [];
    const view = render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={client} />,
      {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      },
    );
    const slider = screen.getByRole('slider', { name: 'Rating' });
    expect(slider).toHaveAttribute('aria-labelledby', label);
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(success(client.read('rating')).value).toBe(3);
    expect(success(server.read('rating')).value).toBe(2.5);
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  });
  it('rejects out-of-range transport state before showing the slider', () => {
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          ...document,
          state: [{ key: 'rating', kind: 'number', initial: 6, access: 'readWrite' }],
        }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('slider')).toBeNull();
  });
});
