import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnHeader } from './header.adapter.js';

it('preserves shell slots and opens the selected SDK Sheet', () => {
  const changed = vi.fn();
  const view = render(
    <ShadcnHeader
      title="reacd"
      href="/"
      start="Start"
      end="End"
      top="Top"
      bottom="Bottom"
      menu={{
        content: 'Menu content',
        open: false,
        onOpenChange: changed,
        mode: 'slideover',
      }}
    >
      Navigation
    </ShadcnHeader>,
  );
  expect(screen.getByRole('banner')).not.toBeNull();
  expect(screen.getByRole('link', { name: 'reacd' }).getAttribute('href')).toBe('/');
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(changed).toHaveBeenCalledWith(true);
  view.rerender(
    <ShadcnHeader
      title="reacd"
      menu={{
        content: 'Menu content',
        open: true,
        onOpenChange: changed,
        mode: 'slideover',
      }}
    />,
  );
  expect(screen.getByRole('dialog', { name: 'reacd' }).getAttribute('data-slot')).toBe(
    'sheet-content',
  );
});

it('keeps a non-link brand and optional shell regions valid', () => {
  render(<ShadcnHeader title="reacd" />);
  expect(screen.getByText('reacd')).not.toBeNull();
  expect(screen.queryByRole('link')).toBeNull();
});

it('requires explicit complete navigation intent before replacing shell slots', () => {
  const menu = { open: false, onOpenChange: () => undefined, content: 'Menu links' };
  const view = render(
    <ShadcnHeader title="Site" menu={menu}>
      Desktop links
    </ShadcnHeader>,
  );
  expect(screen.getByRole('banner').hasAttribute('data-navigation-replacement')).toBe(
    false,
  );
  view.rerender(
    <ShadcnHeader
      title="Site"
      menu={{ ...menu, replacesNavigation: true }}
      bottom="Secondary links"
    >
      Desktop links
    </ShadcnHeader>,
  );
  expect(screen.getByRole('banner').getAttribute('data-navigation-replacement')).toBe(
    'true',
  );
  view.rerender(
    <ShadcnHeader title="Site" menu={{ ...menu, replacesNavigation: true }} />,
  );
  expect(screen.getByRole('banner').hasAttribute('data-navigation-replacement')).toBe(
    false,
  );
});
