import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { templates } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { ShadcnSurface } from './surface.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';

it('configures native SDK tokens and propagates them into SDK portals', async () => {
  const view = render(
    <ShadcnSurface
      template={templates['saas-modern-light']}
      templateId="saas-modern-light"
    >
      <ShadcnSelect
        label="Team"
        value=""
        items={[{ value: 'one', label: 'One' }]}
        onValueChange={() => undefined}
      />
    </ShadcnSurface>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Team' }));
  const popup = screen.getByRole('listbox');
  expect(popup.style.getPropertyValue('--primary')).toBe(
    templates['saas-modern-light'].colors.primary,
  );
  expect(popup.style.getPropertyValue('--sdk-shadow')).toBe('initial');
  view.rerender(
    <ShadcnSurface template={templates['erp-compact']} templateId="erp-compact">
      Compact
    </ShadcnSurface>,
  );
  expect(screen.getByText('Compact')).toHaveAttribute('data-adapter', 'shadcn-ui');
  expect(screen.getByText('Compact').style.getPropertyValue('--sdk-shadow'))
    .toBe('0 0 #0000');
  const stylesheet = readFileSync('src/adapter/shadcn/styles.css', 'utf8');
  expect(stylesheet).not.toContain('renderer/styles');
  expect(stylesheet).not.toContain('.reacd-');
});
