import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { templates } from '../../schema/design/templates.schema.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'App',
    direction: 'rtl',
    language: 'ar',
    children: [
      {
        type: 'Theme',
        template: templates['erp-compact'],
        defaults: { Text: { role: 'caption' } },
        children: [
          {
            type: 'Error',
            statusCode: 503,
            title: 'Service unavailable',
            leading: [{ type: 'Text', content: 'Recovery context' }],
            children: [{ type: 'Text', content: 'Please try again.' }],
            actions: [{ type: 'Button', label: 'Retry safely', action: 'retry' }],
          },
        ],
      },
    ],
  },
});

describe('generative application context', () => {
  it('applies direction, template and defaults around recovery actions', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const view = render(<GenerativeUI document={document} actions={{ retry }} />);
    expect(view.container.querySelector('[lang="ar"]')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('Please try again.')).toHaveAttribute(
      'data-role',
      'caption',
    );
    await user.click(screen.getByRole('button', { name: 'Retry safely' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(
      renderToStaticMarkup(<GenerativeUI document={document} actions={{ retry }} />),
    ).toContain('Service unavailable');
  });

  it('validates unknown actions in every error slot', () => {
    for (const slot of ['children', 'leading', 'actions']) {
      const view = render(
        <GenerativeUI
          document={{
            ...document,
            root: {
              type: 'Error',
              statusCode: 404,
              title: 'Unavailable',
              children: [],
              [slot]: [{ type: 'Button', label: 'Missing', action: 'missing' }],
            },
          }}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('missing');
      view.unmount();
    }
  });
});
