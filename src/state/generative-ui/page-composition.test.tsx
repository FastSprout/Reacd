import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'query', kind: 'text', initial: '', access: 'readWrite' }],
  root: {
    type: 'PageBody',
    children: [
      {
        type: 'PageAside',
        label: 'Generated page navigation',
        top: [{ type: 'Button', label: 'Top action', action: 'help' }],
        bottom: [{ type: 'Button', label: 'Bottom action', action: 'help' }],
        children: [{ type: 'Text', content: 'Aside body' }],
      },
      { type: 'PageAside', label: 'Minimal navigation', children: [] },
      {
        type: 'PageColumns',
        children: [{ type: 'Button', label: 'Column action', action: 'help' }],
      },
      { type: 'PageGrid', children: [{ type: 'Text', content: 'Grid body' }] },
      {
        type: 'PageList',
        divide: true,
        children: [
          {
            type: 'Input',
            label: 'Generated page query',
            value: { state: 'query', mode: 'readWrite' },
          },
        ],
      },
    ],
  },
});

describe('generative page composition', () => {
  it('validates every slot and preserves interactive children', async () => {
    const user = userEvent.setup();
    const help = vi.fn();
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} actions={{ help }} />,
    );
    expect(
      screen.getByRole('complementary', {
        name: 'Generated page navigation',
      }),
    ).toBeVisible();
    for (const name of ['Top action', 'Bottom action', 'Column action']) {
      await user.click(screen.getByRole('button', { name }));
    }
    expect(help).toHaveBeenCalledTimes(3);
    const query = screen.getByLabelText('Generated page query');
    await user.type(query, 'Page state');
    expect(query).toHaveValue('Page state');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('rejects missing actions in every aside slot before rendering', () => {
    for (const slot of ['top', 'bottom', 'children']) {
      const view = render(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={{
            ...document,
            root: {
              type: 'PageAside',
              label: 'Invalid navigation',
              children: [],
              [slot]: [{ type: 'Button', label: 'Missing', action: 'missing' }],
            },
          }}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('missing');
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
      view.unmount();
    }
  });

  it('rejects native slots, unknown properties and invalid node declarations', () => {
    for (const root of [
      { type: 'PageAside', label: '', children: [] },
      { type: 'PageAside', label: 'Links', top: [{ type: 'div' }], children: [] },
      { type: 'PageGrid', columns: 99, children: [] },
      { type: 'PageColumns', style: {}, children: [] },
      { type: 'PageList', divide: 'true', children: [] },
    ])
      expect(validateGenerativeDocument({ ...document, root }).success).toBe(false);
  });

  it('server-renders safe page content without a second main landmark', () => {
    const output = renderToStaticMarkup(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        actions={{ help: () => undefined }}
      />,
    );
    expect(output).toContain('Aside body');
    expect(output).toContain('Grid body');
    expect(output).not.toContain('<main');
  });
});
