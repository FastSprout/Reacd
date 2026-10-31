import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { Example } from '../../../../test-support/action-menu-example.js';

describe('shadcn action menus', () => {
  it.each([false, true])(
    'opens controlled menus and honors callback veto (%s)',
    async (context) => {
      const user = userEvent.setup();
      const action = vi.fn<() => boolean | void>(() => false);
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <Example
            context={context}
            items={[
              { type: 'label', key: 'label', label: 'Actions' },
              { type: 'separator', key: 'separator' },
              { type: 'action', key: 'run', label: 'Run', onPress: action },
            ]}
          />
        </ReacdProvider>,
      );
      if (context)
        fireEvent.contextMenu(screen.getByRole('group'), {
          clientX: 20,
          clientY: 20,
        });
      else await user.click(screen.getByRole('button', { name: 'Resource actions' }));
      await user.click(await screen.findByRole('menuitem', { name: 'Run' }));
      expect(action).toHaveBeenCalledOnce();
      expect(screen.getByRole('menu')).toBeVisible();
      action.mockReturnValueOnce(true);
      await user.click(screen.getByRole('menuitem', { name: 'Run' }));
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    },
  );
  it('updates controlled checkbox and radio choices without closing', async () => {
    const user = userEvent.setup();
    function Choices() {
      const [checked, setChecked] = useState(false);
      const [value, setValue] = useState('one');
      return (
        <Example
          items={[
            {
              type: 'checkbox',
              key: 'check',
              label: 'Pin',
              checked,
              onCheckedChange: setChecked,
            },
            {
              type: 'radio',
              key: 'mode',
              label: 'Mode',
              value,
              onValueChange: setValue,
              options: [
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two' },
              ],
            },
          ]}
        />
      );
    }
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Choices />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Pin' }));
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('menuitemradio', { name: 'Two' }));
    expect(screen.getByRole('menuitemradio', { name: 'Two' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menu')).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
  it('retains native safe links and removes disabled link destinations', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Example
          items={[
            {
              type: 'link',
              key: 'docs',
              label: 'Docs',
              href: '/guide',
              newWindow: true,
            },
            {
              type: 'link',
              key: 'off',
              label: 'Unavailable',
              href: '/',
              disabled: true,
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('menuitem', { name: 'Docs' })).toHaveAttribute(
      'href',
      '/guide',
    );
    expect(screen.getByRole('menuitem', { name: 'Docs' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(screen.getByRole('menuitem', { name: 'Unavailable' })).not.toHaveAttribute(
      'href',
    );
  });
  it('opens a bounded submenu and closes it before the root on Escape', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Example
          items={[
            {
              type: 'submenu',
              key: 'more',
              label: 'More',
              items: [{ type: 'action', key: 'copy', label: 'Copy', onPress: vi.fn() }],
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('menuitem', { name: 'More' }));
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Copy' })).toBeNull(),
    );
    expect(screen.getByRole('menu')).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
  it('does not open disabled menus', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Example disabled items={[]} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
