import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';

const action = () =>
  ({ type: 'Button', label: 'Generated slot action', action: 'run' }) as const;

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'Page',
    title: 'Generated page',
    anchor: 'generated-page',
    left: [action()],
    right: [action()],
    children: [
      {
        type: 'Section',
        title: 'Generated section',
        anchor: 'generated-section',
        children: [],
      },
      {
        type: 'PageAnchors',
        label: 'Generated anchors',
        activeKey: 'target',
        links: [
          {
            key: 'target',
            label: 'Read generated section',
            href: '#generated-section',
            leading: [action()],
          },
        ],
      },
      { type: 'PageAnchors', label: 'Empty anchors' },
      {
        type: 'PageLinks',
        label: 'Generated links',
        title: 'Related',
        links: [{ key: 'overview', label: 'Overview', href: '/' }],
      },
      { type: 'PageLinks', label: 'Empty links' },
      {
        type: 'PageCTA',
        title: 'Generated CTA',
        links: [action()],
        top: [action()],
        header: [action()],
        footer: [action()],
        bottom: [action()],
        children: [action()],
      },
      { type: 'PageCTA', children: [] },
      { type: 'Page', title: 'Nested page', children: [] },
    ],
  },
});

describe('Page navigation transport', () => {
  it('renders native anchors, regions and registered actions', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(<GenerativeUI document={declaration} actions={{ run }} />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Generated section' })).toHaveAttribute(
      'id',
      'generated-section',
    );
    for (const button of screen.getAllByRole('button')) await user.click(button);
    expect(run).toHaveBeenCalledTimes(screen.getAllByRole('button').length);
    expect(
      renderToString(<GenerativeUI document={declaration} actions={{ run }} />),
    ).toContain('generated-section');
  });

  it('checks hidden leading and auxiliary slot actions before rendering', () => {
    const roots = [
      ...['left', 'right'].map((slot) => ({
        type: 'Page',
        title: 'Page',
        children: [],
        [slot]: [action()],
      })),
      ...['PageAnchors', 'PageLinks'].map((type) => ({
        type,
        label: 'Links',
        links: [{ key: 'target', label: 'Target', href: '/', leading: [action()] }],
      })),
      ...['links', 'header', 'footer', 'top', 'bottom', 'children'].map((slot) => ({
        type: 'PageCTA',
        children: [],
        [slot]: [action()],
      })),
    ];
    for (const root of roots) {
      const view = render(<GenerativeUI document={{ ...declaration, root }} />);
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      view.unmount();
    }
  });

  it('rejects invalid anchors, keys and rendering overrides in transport', () => {
    for (const root of [
      { type: 'Page', title: 'Page', anchor: '1-invalid', children: [] },
      { type: 'PageHeader', anchor: 'unnamed', children: [] },
      { type: 'PageSection', anchor: 'unnamed', children: [] },
      { type: 'PageAnchors', label: 'Links', activeKey: 'missing' },
      { type: 'PageCTA', variant: 'ghost', children: [] },
      {
        type: 'PageLinks',
        label: 'Links',
        links: [{ key: 'invalid', label: 'Unsafe', href: 'javascript:alert(1)' }],
      },
    ])
      expect(validateGenerativeDocument({ ...declaration, root }).success).toBe(false);
  });
});
