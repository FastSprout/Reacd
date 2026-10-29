import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

describe('navigation hydration', () => {
  it.each([0, 23])(
    'hydrates %s items and isolates server state',
    async (totalItems) => {
      const user = userEvent.setup();
      const declaration = defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [
          {
            key: 'page',
            kind: 'pagination',
            initial: { pageIndex: 0, pageSize: 10 },
            access: 'readWrite',
          },
        ],
        root: {
          type: 'VStack',
          children: [
            {
              type: 'Breadcrumb',
              label: 'Hydrated path',
              items: [{ key: 'home', label: 'Home', href: '/' }],
            },
            {
              type: 'Pagination',
              label: 'Hydrated pages',
              totalItems,
              value: { state: 'page', mode: 'readWrite' },
            },
          ],
        },
      });
      const server = renderToString(<GenerativeUI document={declaration} />);
      const container = document.createElement('div');
      container.innerHTML = server;
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(<GenerativeUI document={declaration} />, {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      const pager = within(screen.getByRole('navigation', { name: 'Hydrated pages' }));
      if (totalItems === 0) {
        expect(pager.getByRole('button', { name: 'Next page' })).toBeDisabled();
      } else {
        await user.click(pager.getByRole('button', { name: 'Next page' }));
        expect(pager.getByRole('status')).toHaveTextContent('Page 2 of 3');
        expect(renderToString(<GenerativeUI document={declaration} />)).toBe(server);
      }
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
