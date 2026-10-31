import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import type { GenerativeActions } from './generative-ui.props.js';

describe('Skeleton and Empty hydration', () => {
  it.each([false, true])(
    'hydrates busy=%s with isolated request state',
    async (busy) => {
      const user = userEvent.setup();
      const declaration = defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [
          { key: 'busy', kind: 'boolean', initial: busy, access: 'read' },
          { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
        ],
        root: {
          type: 'Empty',
          title: 'Hydrated results',
          loading: { state: 'busy', mode: 'read' },
          leading: [{ type: 'Skeleton', shape: 'avatar' }],
          children: [
            {
              type: 'Skeleton',
              label: 'Loading results',
              show: { state: 'busy', mode: 'read' },
            },
            {
              type: 'Input',
              label: 'Hydrated query',
              value: { state: 'query', mode: 'readWrite' },
            },
          ],
          actions: [{ type: 'Button', label: 'Finish loading', action: 'finish' }],
          footer: [{ type: 'Text', content: 'Local request' }],
        },
      });
      const actions: GenerativeActions = {
        finish: ({ state }) => {
          state.update('busy', false);
        },
      };
      const container = document.createElement('div');
      container.innerHTML = renderToString(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          actions={actions}
        />,
      );
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          actions={actions}
        />,
        {
          container,
          hydrate: true,
          onRecoverableError: (error) => errors.push(error),
        },
      );
      expect(screen.getByRole('region', { name: 'Hydrated results' })).toHaveAttribute(
        'data-loading',
        String(busy),
      );
      await user.type(screen.getByLabelText('Hydrated query'), 'Client query');
      await user.click(screen.getByRole('button', { name: 'Finish loading' }));
      expect(screen.queryByRole('status')).toBeNull();
      expect(
        renderToString(
          <GenerativeUI
            adapter={shadcnAdapter}
            document={declaration}
            actions={actions}
          />,
        ),
      ).not.toContain('Client query');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
