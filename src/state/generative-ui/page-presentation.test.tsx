import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';

const actionNode = () =>
  ({
    type: 'Button',
    label: 'Slot action',
    action: 'run',
  }) as const;
const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'query', kind: 'text', initial: '', access: 'readWrite' }],
  root: {
    type: 'PageHero',
    title: 'Generated hero',
    top: [actionNode()],
    header: [actionNode()],
    footer: [actionNode()],
    bottom: [actionNode()],
    links: [actionNode()],
    children: [
      {
        type: 'PageHeader',
        title: 'Generated header',
        links: [actionNode()],
        children: [actionNode()],
      },
      {
        type: 'PageFeature',
        title: 'Feature action',
        action: 'run',
        leading: [actionNode()],
        children: [actionNode()],
      },
      {
        type: 'PageCard',
        title: 'Card action',
        action: 'run',
        header: [actionNode()],
        footer: [actionNode()],
        leading: [actionNode()],
        children: [actionNode()],
      },
      {
        type: 'PageSection',
        title: 'Generated section',
        links: [actionNode()],
        top: [actionNode()],
        bottom: [actionNode()],
        header: [actionNode()],
        footer: [actionNode()],
        leading: [actionNode()],
        features: [actionNode()],
        children: [
          {
            type: 'Input',
            label: 'Generated intro query',
            value: { state: 'query', mode: 'readWrite' },
          },
        ],
      },
      { type: 'PageHeader', children: [] },
      { type: 'PageFeature', children: [] },
      { type: 'PageCard', children: [] },
      { type: 'PageHero', children: [] },
      { type: 'PageSection', children: [] },
    ],
  },
});

describe('Page presentation generative transport', () => {
  it('renders every slot and resolves registered title and child actions', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} actions={{ run }} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Generated hero', level: 1 }),
    ).toBeVisible();
    for (const button of screen.getAllByRole('button')) await user.click(button);
    expect(run).toHaveBeenCalledTimes(screen.getAllByRole('button').length);
    const field = screen.getByLabelText('Generated intro query');
    await user.type(field, 'Shared state');
    expect(field).toHaveValue('Shared state');
    expect(
      renderToString(
        <GenerativeUI adapter={shadcnAdapter} document={document} actions={{ run }} />,
      ),
    ).toContain('Generated intro query');
  });

  it('rejects unregistered descendant actions in every available slot', () => {
    const components = [
      ['PageHeader', ['links']],
      ['PageFeature', ['leading']],
      ['PageCard', ['leading', 'header', 'footer']],
      ['PageHero', ['links', 'header', 'footer', 'top', 'bottom']],
      [
        'PageSection',
        ['links', 'leading', 'header', 'footer', 'top', 'bottom', 'features'],
      ],
    ] as const;
    for (const [type, slots] of components) {
      for (const slot of [...slots, 'children']) {
        const view = render(
          <GenerativeUI
            adapter={shadcnAdapter}
            document={{
              ...document,
              root: { type, children: [], [slot]: [actionNode()] },
            }}
          />,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('not registered');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        view.unmount();
      }
    }
  });

  it('rejects executable callbacks and unsafe or unnamed title actions', () => {
    for (const root of [
      { type: 'PageCard', title: 'Invalid', href: '/', action: 'run', children: [] },
      { type: 'PageFeature', action: 'run', children: [] },
      {
        type: 'PageFeature',
        title: 'Callback',
        onPress: () => undefined,
        children: [],
      },
      {
        type: 'PageHero',
        title: 'Invalid slot',
        links: [{ type: 'div' }],
        children: [],
      },
    ])
      expect(validateGenerativeDocument({ ...document, root }).success).toBe(false);
  });

  it('handles a host action removed after accepted rendering', async () => {
    const user = userEvent.setup();
    const actions: Record<string, () => void> = { run: vi.fn() };
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} actions={actions} />,
    );
    delete actions['run'];
    const inherited = vi.fn();
    Object.setPrototypeOf(actions, { run: inherited });
    await user.click(screen.getByRole('button', { name: 'Card action' }));
    expect(inherited).not.toHaveBeenCalled();
  });
});
