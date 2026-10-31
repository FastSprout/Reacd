import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'PageSection',
    title: 'Hydrated section',
    children: [
      {
        type: 'PageCard',
        title: 'Hydrated action',
        action: 'run',
        children: [{ type: 'Text', content: 'Hydrated child' }],
      },
    ],
  },
});

describe('Page presentation hydration', () => {
  it('hydrates deterministic heading IDs and independent request state', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = renderToString(
      <GenerativeUI adapter={shadcnAdapter} document={declaration} actions={{ run }} />,
    );
    const errors: unknown[] = [];
    const view = render(
      <GenerativeUI adapter={shadcnAdapter} document={declaration} actions={{ run }} />,
      {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      },
    );
    expect(errors).toEqual([]);
    expect(
      screen.getByRole('heading', { name: 'Hydrated action', level: 2 }),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Hydrated action' }));
    expect(run).toHaveBeenCalledOnce();
    view.unmount();
    container.remove();
    expect(
      renderToString(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          actions={{ run }}
        />,
      ),
    ).toContain('Hydrated child');
  });
});
