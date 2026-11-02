import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { NavigationMenu } from '../vendor/ui/navigation-menu.js';
import { ShadcnNavigationTarget } from './navigation-target.js';

it('keeps disabled links inert and labels without destinations noninteractive', () => {
  const view = render(
    <NavigationMenu>
      <ShadcnNavigationTarget
        item={{ key: 'api', label: 'API', href: '#api', disabled: true }}
      />
    </NavigationMenu>,
  );
  expect(fireEvent.click(screen.getByRole('link'))).toBe(false);
  expect(screen.getByRole('link').getAttribute('tabindex')).toBe('-1');
  view.rerender(
    <NavigationMenu>
      <ShadcnNavigationTarget item={{ key: 'api', label: 'API', href: '#api' }} />
    </NavigationMenu>,
  );
  expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
  const action = vi.fn();
  view.rerender(
    <NavigationMenu>
      <ShadcnNavigationTarget
        item={{ key: 'run', label: 'Run', disabled: true, onPress: action }}
      />
    </NavigationMenu>,
  );
  expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true);
  fireEvent.click(screen.getByRole('button'));
  expect(action).not.toHaveBeenCalled();
  view.rerender(
    <NavigationMenu>
      <ShadcnNavigationTarget item={{ key: 'label', label: 'Section label' }} />
    </NavigationMenu>,
  );
  expect(screen.getByText('Section label')).not.toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
});
