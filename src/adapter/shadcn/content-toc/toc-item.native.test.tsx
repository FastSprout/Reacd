import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { NavigationMenu } from '../vendor/ui/navigation-menu.js';
import { ShadcnTocItem } from './toc-item.js';

it('keeps fragment keys encoded and propagates item-level disabling', () => {
  render(
    <NavigationMenu>
      <ShadcnTocItem
        disabled={false}
        item={{
          key: 'item key',
          label: 'Parent',
          disabled: true,
          children: [{ key: 'child', label: 'Child' }],
        }}
      />
    </NavigationMenu>,
  );
  expect(screen.getByRole('link', { name: 'Parent' }).getAttribute('href')).toBeNull();
  expect(screen.getByRole('link', { name: 'Child' }).getAttribute('href')).toBeNull();
});
