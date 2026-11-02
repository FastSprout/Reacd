import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnContentNavigation } from './content-navigation.adapter.js';

it('uses SDK controlled disclosures and honors document selection veto', () => {
  const expand = vi.fn();
  const current = vi.fn(() => false);
  render(
    <ShadcnContentNavigation
      label="Documents"
      expandedKeys={['forms']}
      onExpandedKeysChange={expand}
      currentKey="button"
      onCurrentChange={current}
      items={[
        {
          key: 'forms',
          label: 'Forms',
          children: [{ key: 'button', label: 'Button', href: '#button' }],
        },
      ]}
    />,
  );
  const link = screen.getByRole('link', { name: 'Button' });
  expect(link.getAttribute('aria-current')).toBe('location');
  expect(fireEvent.click(link)).toBe(false);
  expect(current).toHaveBeenCalledWith('button');
  fireEvent.click(screen.getByRole('button', { name: 'Forms' }));
  expect(expand).toHaveBeenCalledWith([]);
});

it('preserves branch overview links, read-only expansion and empty content', () => {
  const view = render(
    <ShadcnContentNavigation
      label="Documents"
      expandedKeys={['forms']}
      onExpandedKeysChange={() => undefined}
      expansionReadOnly
      items={[
        {
          key: 'forms',
          label: 'Forms',
          href: '#forms',
          children: [{ key: 'input', label: 'Input', href: '#input', disabled: true }],
        },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Forms' }).getAttribute('href')).toBe(
    '#forms',
  );
  expect(screen.getByRole('button', { name: 'Forms' }).hasAttribute('disabled')).toBe(
    true,
  );
  expect(screen.getByRole('link', { name: 'Input' }).getAttribute('href')).toBeNull();
  view.rerender(
    <ShadcnContentNavigation
      label="Documents"
      items={[]}
      disabled
      expandedKeys={[]}
      onExpandedKeysChange={() => undefined}
    />,
  );
  expect(screen.getByText('No document links.')).not.toBeNull();
  view.rerender(
    <ShadcnContentNavigation
      label="Documents"
      items={[]}
      emptyLabel="No matches"
      expandedKeys={[]}
      onExpandedKeysChange={() => undefined}
    />,
  );
  expect(screen.getByText('No matches')).not.toBeNull();
});
