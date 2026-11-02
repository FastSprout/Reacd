import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnContentLink } from './content-link.js';
import { nativeDocumentationEntries } from '../registry/native-documentation.js';
import { NavigationMenu } from '../vendor/ui/navigation-menu.js';

it('preserves new-window destinations and blocks disabled document selection', () => {
  const changed = vi.fn(() => true);
  const view = render(
    <NavigationMenu>
      <ShadcnContentLink
        disabled={false}
        item={{ key: 'api', label: 'API', href: '#api', newWindow: true }}
        onCurrentChange={changed}
      />
    </NavigationMenu>,
  );
  const link = screen.getByRole('link', { name: 'API' });
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  expect(fireEvent.click(link)).toBe(true);
  expect(changed).toHaveBeenCalledWith('api');
  view.rerender(
    <NavigationMenu>
      <ShadcnContentLink
        disabled
        item={{ key: 'api', label: 'API', href: '#api' }}
        onCurrentChange={changed}
      />
    </NavigationMenu>,
  );
  expect(fireEvent.click(screen.getByRole('link'))).toBe(false);
  expect(screen.getByRole('link').getAttribute('href')).toBeNull();
  expect(changed).toHaveBeenCalledOnce();
  view.rerender(
    <NavigationMenu>
      <ShadcnContentLink
        disabled={false}
        item={{ key: 'api', label: 'API', href: '#api' }}
      />
    </NavigationMenu>,
  );
  expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
});

it('rejects an invalid external callback return value', () => {
  const errors: string[] = [];
  const report = (event: ErrorEvent) => {
    errors.push(event.message);
    event.preventDefault();
  };
  window.addEventListener('error', report);
  try {
    render(
      <>
        {nativeDocumentationEntries.ContentNavigation.render({
          label: 'Documents',
          expandedKeys: [],
          onExpandedKeysChange: () => undefined,
          onCurrentChange: () => 'invalid',
          items: [{ key: 'api', label: 'API', href: '#api' }],
        })}
      </>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(errors).toContain('Current callbacks must return a boolean or nothing.');
  } finally {
    window.removeEventListener('error', report);
  }
});
