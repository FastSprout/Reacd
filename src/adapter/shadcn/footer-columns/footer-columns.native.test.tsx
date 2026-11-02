import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFooterColumns } from './footer-columns.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
it('composes native columns and guarded logical targets', async () => {
  const press = vi.fn();
  const columns = [
    {
      key: 'links',
      label: 'Resources',
      children: [
        { key: 'home', label: 'Home', href: '/', active: true },
        { key: 'external', label: 'External', href: '/external/', newWindow: true },
        { key: 'disabled', label: 'Unavailable', href: '/', disabled: true },
        { key: 'press', label: 'Select', onPress: press },
        { key: 'blocked', label: 'Blocked', onPress: press, disabled: true },
        { key: 'info', label: 'Information' },
      ],
    },
  ];
  const right = <input aria-label="Note" defaultValue="Saved" />;
  const view = render(
    <ShadcnFooterColumns
      label="Footer"
      columns={columns}
      left="Before"
      right={right}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'Footer' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  expect(screen.getByRole('link', { name: 'Unavailable' })).not.toHaveAttribute('href');
  await userEvent.click(screen.getByRole('button', { name: 'Select' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(screen.getByRole('button', { name: 'Blocked' })).toBeDisabled();
  expect(screen.getByText('Information')).toBeVisible();
  const note = screen.getByRole('textbox');
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnFooterColumns label="Footer" columns={columns} right={right} />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Select' })).toBeDisabled();
  view.rerender(<ShadcnFooterColumns label="Footer" columns={[]} />);
  expect(screen.queryByRole('listitem')).toBeNull();
  expect(note).not.toBeInTheDocument();
});
