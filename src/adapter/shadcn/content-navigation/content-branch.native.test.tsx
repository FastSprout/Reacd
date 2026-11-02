import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { NavigationMenu } from '../vendor/ui/navigation-menu.js';
import { Accordion } from '../vendor/ui/accordion.js';
import { ShadcnContentBranch } from './content-branch.js';

it('preserves inherited blocking across nested native SDK disclosures', () => {
  render(
    <NavigationMenu><Accordion type="multiple" value={['forms', 'fields']}>
      <ShadcnContentBranch
        disabled
        readOnly={false}
        item={{
          key: 'forms',
          label: 'Forms',
          children: [
            {
              key: 'fields',
              label: 'Fields',
              children: [{ key: 'input', label: 'Input', href: '#input' }],
            },
          ],
        }}
      />
    </Accordion></NavigationMenu>,
  );
  expect(screen.getByRole('button', { name: 'Fields' }).hasAttribute('disabled')).toBe(
    true,
  );
  expect(screen.getByRole('link', { name: 'Input' }).getAttribute('href')).toBeNull();
});
