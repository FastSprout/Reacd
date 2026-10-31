import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import type { Result } from '../../core/result.js';
import { contentNavigationNodeSchema } from
  '../../schema/content-navigation/generative.schema.js';
import { contentTocNodeSchema } from '../../schema/content-toc/generative.schema.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundContentNavigation } from './bound-content-navigation.js';
import { BoundContentToc } from './bound-content-toc.js';
import { followHref } from '../../renderer/navigation/native-navigation.js';

vi.mock('../../renderer/navigation/native-navigation.js', () => ({
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
const NAVIGATION = contentNavigationNodeSchema.parse({
  type: 'ContentNavigation',
  label: 'Generated documents',
  items: ITEMS,
  currentKey: { state: 'current', mode: 'readWrite' },
  expandedKeys: { state: 'expanded', mode: 'readWrite' },
});
const TOC = contentTocNodeSchema.parse({
  type: 'ContentToc',
  label: 'Generated headings',
  items: [
    {
      key: 'guide',
      label: 'Guide',
      children: [{ key: 'intro', label: 'Introduction' }],
    },
  ],
  currentKey: { state: 'current', mode: 'readWrite' },
});

function success<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}
function registry() {
  return success(
    createStateRegistry([
      { key: 'current', kind: 'text', initial: '', access: 'readWrite' },
      { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
    ]),
  );
}

describe('generated content outline state', () => {
  it('refuses writes visibly and recovers without losing state', async () => {
    const user = userEvent.setup();
    const state = registry();
    render(
      <ReacdProvider adapter={shadcnAdapter} store={state.store}>
        <BoundContentNavigation node={NAVIGATION} registry={state} />
      </ReacdProvider>,
    );
    const releaseExpansion = success(
      state.constrain(['expanded'], (read) => {
        const value = success(read('expanded'));
        return Array.isArray(value.value) && value.value.length > 0
          ? { success: false, issues: [{ path: 'expanded', message: 'Keep closed.' }] }
          : { success: true, data: undefined };
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Expand Guide' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Keep closed.');
    expect(state.read('expanded')).toMatchObject({ data: { value: [] } });
    expect(screen.queryByRole('link', { name: 'Introduction' })).toBeNull();
    releaseExpansion();
    await user.click(screen.getByRole('button', { name: 'Expand Guide' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(state.read('expanded')).toMatchObject({ data: { value: ['guide'] } });
    const releaseCurrent = success(
      state.constrain(['current'], (read) =>
        success(read('current')).value === 'intro'
          ? { success: false, issues: [{ path: 'current', message: 'Keep current.' }] }
          : { success: true, data: undefined },
      ),
    );
    const before = vi.mocked(followHref).mock.calls.length;
    await user.click(screen.getByRole('link', { name: 'Introduction' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Keep current.');
    expect(state.read('current')).toMatchObject({ data: { value: '' } });
    expect(vi.mocked(followHref).mock.calls.length).toBe(before);
    releaseCurrent();
    await user.click(screen.getByRole('link', { name: 'Introduction' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(state.read('current')).toMatchObject({ data: { value: 'intro' } });
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('/guide/intro', window.location.href).href,
    );
  });

  it('intersects live shared-key constraints and releases them after unmount', () => {
    const state = registry();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter} store={state.store}>
        <BoundContentNavigation node={NAVIGATION} registry={state} />
        <BoundContentToc node={TOC} registry={state} />
      </ReacdProvider>,
    );
    expect(state.update('current', 'home').success).toBe(false);
    expect(state.update('current', 'unknown').success).toBe(false);
    expect(state.update('expanded', ['intro']).success).toBe(false);
    expect(state.update('expanded', ['guide', 'guide']).success).toBe(false);
    act(() => {
      success(state.update('current', 'intro'));
    });
    expect(
      within(screen.getByRole('navigation', { name: 'Generated headings' })).getByRole(
        'link',
        { name: 'Introduction' },
      ),
    ).toHaveAttribute('aria-current', 'location');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter} store={state.store}>
        <BoundContentNavigation node={NAVIGATION} registry={state} />
      </ReacdProvider>,
    );
    act(() => {
      success(state.update('current', 'home'));
    });
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  it('vetoes and recovers TOC writes before fragment navigation', async () => {
    const user = userEvent.setup();
    const state = registry();
    render(
      <ReacdProvider adapter={shadcnAdapter} store={state.store}>
        <BoundContentToc node={TOC} registry={state} />
      </ReacdProvider>,
    );
    const release = success(
      state.constrain(['current'], (read) =>
        success(read('current')).value === 'intro'
          ? {
              success: false,
              issues: [{ path: 'current', message: 'Heading locked.' }],
            }
          : { success: true, data: undefined },
      ),
    );
    const before = vi.mocked(followHref).mock.calls.length;
    await user.click(screen.getByRole('link', { name: 'Introduction' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Heading locked.');
    expect(vi.mocked(followHref).mock.calls.length).toBe(before);
    release();
    await user.click(screen.getByRole('link', { name: 'Introduction' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(state.read('current')).toMatchObject({ data: { value: 'intro' } });
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('#intro', window.location.href).href,
    );
  });

  it('keeps read bindings native while blocking disclosure edits', () => {
    const state = registry();
    render(
      <ReacdProvider adapter={shadcnAdapter} store={state.store}>
        <BoundContentNavigation
          registry={state}
          node={{
            ...NAVIGATION,
            currentKey: { state: 'current', mode: 'read' },
            expandedKeys: { state: 'expanded', mode: 'read' },
          }}
        />
        <BoundContentToc
          registry={state}
          node={{ ...TOC, currentKey: { state: 'current', mode: 'read' } }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button', { name: 'Expand Guide' })).toBeDisabled();
    act(() => {
      success(state.update('expanded', ['guide']));
      success(state.update('current', 'intro'));
    });
    for (const nav of screen.getAllByRole('navigation')) {
      const link = within(nav).getByRole('link', { name: 'Introduction' });
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-current', 'location');
    }
  });

  it('reports each missing direct binding before any navigation renders', () => {
    const state = registry();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundContentNavigation
          registry={state}
          node={{ ...NAVIGATION, currentKey: { state: 'missing', mode: 'readWrite' } }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.queryByRole('navigation')).toBeNull();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundContentNavigation
          registry={state}
          node={{
            ...NAVIGATION,
            expandedKeys: { state: 'missing', mode: 'readWrite' },
          }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.queryByRole('navigation')).toBeNull();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundContentToc
          registry={state}
          node={{ ...TOC, currentKey: { state: 'missing', mode: 'readWrite' } }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
