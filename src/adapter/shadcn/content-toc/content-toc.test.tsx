import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContentToc, ReacdProvider } from '../../../index.js';
import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { contentTocSchema } from '../../../schema/content-toc/content-toc.schema.js';
import { ShadcnContentToc } from './content-toc.adapter.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';

vi.mock('../../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

const ITEMS = [
  {
    key: 'overview',
    label: 'Overview',
    children: [{ key: 'install', label: 'Installation' }],
  },
];

describe('semantic table of contents', () => {
  it('retains nested fragments and controlled current state', async () => {
    const user = userEvent.setup();
    const selected = vi.fn();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentToc
          label="On this page"
          items={ITEMS}
          currentKey="overview"
          onCurrentChange={selected}
        />
      </ReacdProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(nav).toBeVisible();
    const overview = screen.getByRole('link', { name: 'Overview' });
    const installation = screen.getByRole('link', { name: 'Installation' });
    expect(overview).toHaveAttribute('href', '#overview');
    expect(overview).toHaveAttribute('aria-current', 'location');
    expect(installation).toHaveAttribute('href', '#install');
    expect(screen.queryByRole('button')).toBeNull();
    await user.click(installation);
    expect(selected).toHaveBeenCalledExactlyOnceWith('install');
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('#install', window.location.href).href,
    );
    expect(overview).toHaveAttribute('aria-current', 'location');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentToc
          label="On this page"
          items={ITEMS}
          currentKey="install"
          onCurrentChange={selected}
        />
      </ReacdProvider>,
    );
    expect(installation).toHaveAttribute('aria-current', 'location');
    expect(overview).not.toHaveAttribute('aria-current');
  });

  it('inherits disabled state and exposes honest empty feedback', async () => {
    const user = userEvent.setup();
    const selected = vi.fn();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentToc
          label="Unavailable headings"
          items={ITEMS}
          disabled
          onCurrentChange={selected}
        />
      </ReacdProvider>,
    );
    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('tabindex', '-1');
      await user.click(link);
    }
    expect(selected).not.toHaveBeenCalled();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentToc label="Empty page" items={[]} />
      </ReacdProvider>,
    );
    expect(screen.getByText('No document links.')).toBeVisible();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentToc label="Empty page" items={[]} emptyLabel="No headings yet." />
      </ReacdProvider>,
    );
    expect(screen.getByText('No headings yet.')).toBeVisible();
  });

  it('shows invalid decisions and recovers on a valid decision', async () => {
    const user = userEvent.setup();
    const entry = renderEntry('ContentToc', contentTocSchema, ShadcnContentToc);
    const properties = {
      label: 'Guarded headings',
      items: ITEMS,
      onCurrentChange: () => 'wrong',
    };
    const view = render(<>{entry.render(properties)}</>);
    await user.click(screen.getByRole('link', { name: 'Installation' }));
    expect(screen.getByRole('alert')).toHaveTextContent('must return a boolean');
    view.rerender(<>{entry.render({ ...properties, onCurrentChange: () => false })}</>);
    await user.click(screen.getByRole('link', { name: 'Installation' }));
    expect(screen.queryByRole('alert')).toBeNull();
    view.rerender(<>{entry.render({ ...properties, onCurrentChange: 42 })}</>);
    expect(screen.getByRole('alert')).toBeVisible();
  });
});
