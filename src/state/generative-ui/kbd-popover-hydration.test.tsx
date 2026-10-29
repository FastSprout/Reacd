import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

describe('Kbd and Popover SSR hydration', () => {
  it.each([false, true])(
    'hydrates initial open=%s without leaking state',
    async (open) => {
      const user = userEvent.setup();
      const declaration = defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [
          { key: 'open', kind: 'boolean', initial: open, access: 'readWrite' },
          { key: 'draft', kind: 'text', initial: '', access: 'readWrite' },
        ],
        root: {
          type: 'VStack',
          children: [
            { type: 'Kbd', value: 'meta', platform: 'apple' },
            {
              type: 'Popover',
              title: 'Hydrated panel',
              triggerLabel: 'Hydrated trigger',
              open: { state: 'open', mode: 'readWrite' },
              children: [
                {
                  type: 'Input',
                  label: 'Hydrated draft',
                  value: { state: 'draft', mode: 'readWrite' },
                },
              ],
            },
          ],
        },
      });
      const container = document.createElement('div');
      container.innerHTML = renderToString(<GenerativeUI document={declaration} />);
      expect(container.querySelector('[role="dialog"]')).toBeNull();
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(<GenerativeUI document={declaration} />, {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      expect(screen.getByRole('img', { name: 'Command' })).toHaveTextContent('⌘');
      if (!open)
        await user.click(screen.getByRole('button', { name: 'Hydrated trigger' }));
      await user.type(await screen.findByLabelText('Hydrated draft'), 'Client draft');
      expect(renderToString(<GenerativeUI document={declaration} />)).not.toContain(
        'Client draft',
      );
      await user.click(screen.getByRole('button', { name: 'Close popover' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
