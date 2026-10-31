import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContentNavigation, ReacdProvider } from '../../../index.js';
import { ShadcnContentNavigation } from './content-navigation.adapter.js';
import { contentNavigationSchema } from
  '../../../schema/content-navigation/content-navigation.schema.js';
import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';

vi.mock('../../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

const ITEMS = [
  {
    key: 'guide',
    label: 'Guide',
    href: '/guide',
    children: [{ key: 'intro', label: 'Introduction', href: '/guide/intro' }],
  },
  { key: 'home', label: 'Home', href: '/' },
];

describe('controlled content navigation', () => {
  it('keeps branch links independent and excludes hidden focus', async () => {
    const user = userEvent.setup();
    const expanded = vi.fn();
    const selected = vi.fn();
    function Scene() {
      const [keys, setKeys] = useState<readonly string[]>([]);
      const [current, setCurrent] = useState('home');
      return (
        <ContentNavigation
          label="Reference tree"
          items={ITEMS}
          expandedKeys={keys}
          currentKey={current}
          onExpandedKeysChange={(next) => {
            expanded(next);
            setKeys(next);
          }}
          onCurrentChange={(key) => {
            selected(key);
            setCurrent(key);
          }}
        />
      );
    }
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Scene />
      </ReacdProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Reference tree' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Introduction' })).toBeNull();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Guide' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(selected).toHaveBeenCalledExactlyOnceWith('guide');
    expect(expanded).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    await user.tab();
    const disclosure = screen.getByRole('button', { name: 'Expand Guide' });
    expect(disclosure).toHaveFocus();
    const controlled = disclosure.getAttribute('aria-controls');
    expect(controlled).toBeTruthy();
    await user.keyboard(' ');
    expect(expanded).toHaveBeenCalledExactlyOnceWith(['guide']);
    expect(screen.getByRole('button', { name: 'Collapse Guide' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Introduction' })).toBeVisible();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Collapse Guide' }));
    expect(expanded).toHaveBeenLastCalledWith([]);
    expect(screen.queryByRole('link', { name: 'Introduction' })).toBeNull();
    expect(followHref).toHaveBeenCalled();
  });

  it('honors refusal, read-only expansion and inherited disabling', async () => {
    const user = userEvent.setup();
    const expanded = vi.fn();
    const selected = vi.fn(() => false);
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentNavigation
          label="Read-only tree"
          items={ITEMS}
          expandedKeys={[]}
          expansionReadOnly
          onExpandedKeysChange={expanded}
          onCurrentChange={selected}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button', { name: 'Expand Guide' })).toBeDisabled();
    await user.click(screen.getByRole('link', { name: 'Guide' }));
    expect(selected).toHaveBeenCalledExactlyOnceWith('guide');
    expect(expanded).not.toHaveBeenCalled();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentNavigation
          label="Disabled branch"
          items={[{ ...ITEMS[0], key: 'guide', label: 'Guide', disabled: true }]}
          expandedKeys={['guide']}
          onExpandedKeysChange={expanded}
          onCurrentChange={selected}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button', { name: 'Collapse Guide' })).toBeDisabled();
    const child = screen.getByRole('link', { name: 'Introduction' });
    expect(child).not.toHaveAttribute('href');
    await user.click(child);
    expect(selected).toHaveBeenCalledTimes(1);
  });

  it('blocks async decisions and malformed callback properties', async () => {
    const user = userEvent.setup();
    const entry = renderEntry(
      'ContentNavigation',
      contentNavigationSchema,
      ShadcnContentNavigation,
    );
    const properties = {
      label: 'Guarded navigation',
      items: ITEMS,
      expandedKeys: [],
      onExpandedKeysChange: () => undefined,
      onCurrentChange: () => Promise.resolve(true),
    };
    const view = render(<>{entry.render(properties)}</>);
    await user.click(screen.getByRole('link', { name: 'Guide' }));
    expect(screen.getByRole('alert')).toHaveTextContent('must return a boolean');
    view.rerender(<>{entry.render({ ...properties, onCurrentChange: () => true })}</>);
    await user.click(screen.getByRole('link', { name: 'Guide' }));
    expect(screen.queryByRole('alert')).toBeNull();
    view.rerender(<>{entry.render({ ...properties, onExpandedKeysChange: 'bad' })}</>);
    expect(screen.getByRole('alert')).toBeVisible();
  });

  it('renders default and explicit empty feedback', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentNavigation
          label="No documents"
          items={[]}
          expandedKeys={[]}
          onExpandedKeysChange={() => undefined}
        />
      </ReacdProvider>,
    );
    expect(screen.getByText('No document links.')).toBeVisible();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentNavigation
          label="No documents"
          items={[]}
          emptyLabel="No visible chapters."
          expandedKeys={[]}
          onExpandedKeysChange={() => undefined}
        />
      </ReacdProvider>,
    );
    expect(screen.getByText('No visible chapters.')).toBeVisible();
  });
});
