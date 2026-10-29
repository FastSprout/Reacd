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
  ({ type: 'Button', label: 'Editorial slot action', action: 'run' }) as const;
const entry = () => ({
  title: 'Editorial title action',
  action: 'run',
  date: '2024-02-29',
  dateLabel: 'Explicit leap day',
  header: [actionNode()],
  badge: [actionNode()],
  authors: [actionNode()],
  footer: [actionNode()],
  actions: [actionNode()],
  children: [actionNode()],
});
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'VStack',
    children: [
      { ...entry(), type: 'BlogPost' },
      { ...entry(), type: 'ChangelogVersion' },
      { type: 'BlogPosts', posts: [{ ...entry(), key: 'entry' }], children: [] },
      {
        type: 'ChangelogVersions',
        versions: [{ ...entry(), key: 'entry' }],
        children: [],
      },
      { type: 'BlogPost', children: [] },
      { type: 'ChangelogVersion', children: [] },
      { type: 'BlogPosts', children: [] },
      { type: 'ChangelogVersions', children: [] },
    ],
  },
});

describe('editorial generative transport', () => {
  it('resolves standalone and collection entry actions', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(<GenerativeUI document={declaration} actions={{ run }} />);
    for (const button of screen.getAllByRole('button')) await user.click(button);
    expect(run).toHaveBeenCalledTimes(screen.getAllByRole('button').length);
    expect(
      renderToString(<GenerativeUI document={declaration} actions={{ run }} />),
    ).toContain('2024-02-29');
  });

  it('rejects missing actions in every entry slot and collection row', () => {
    for (const type of ['BlogPost', 'ChangelogVersion'] as const) {
      for (const slot of [
        'header',
        'badge',
        'authors',
        'footer',
        'actions',
        'children',
      ]) {
        const view = render(
          <GenerativeUI
            document={{
              ...declaration,
              root: {
                type,
                children: [],
                [slot]: [actionNode()],
              },
            }}
          />,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('not registered');
        expect(screen.queryByRole('article')).not.toBeInTheDocument();
        view.unmount();
      }
    }
    const view = render(<GenerativeUI document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    view.unmount();
    for (const root of [
      { type: 'BlogPosts', posts: [{ ...entry(), key: 'one' }], children: [] },
      {
        type: 'ChangelogVersions',
        versions: [{ ...entry(), key: 'one' }],
        children: [],
      },
    ]) {
      const item = render(<GenerativeUI document={{ ...declaration, root }} />);
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      item.unmount();
    }
  });

  it('rejects executable transport metadata and invalid collection data', () => {
    for (const root of [
      { type: 'BlogPost', onPress: () => undefined, children: [] },
      { type: 'BlogPost', dateLabel: 'Missing date', children: [] },
      { type: 'ChangelogVersion', date: '2025-02-29', children: [] },
      {
        type: 'BlogPosts',
        posts: [
          { key: 'one', children: [] },
          { key: 'one', children: [] },
        ],
        children: [],
      },
    ])
      expect(validateGenerativeDocument({ ...declaration, root }).success).toBe(false);
  });

  it('never executes an inherited replacement for a removed host action', async () => {
    const user = userEvent.setup();
    const inherited = vi.fn();
    const actions: Record<string, () => void> = { run: vi.fn() };
    render(<GenerativeUI document={declaration} actions={actions} />);
    Object.setPrototypeOf(actions, { run: inherited });
    delete actions['run'];
    const button = screen.getAllByRole('button', { name: 'Editorial title action' })[0];
    if (button === undefined) throw new Error('Missing editorial title action.');
    await user.click(button);
    expect(inherited).not.toHaveBeenCalled();
  });
});
