import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTags } from './input-tags.adapter.js';
import { DirectionProvider } from '@radix-ui/react-direction';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';

it.each([{ disabled: true }, { readOnly: true }])(
  'protects native chip/draft writes %j',
  async (props) => {
    const change = vi.fn();
    render(
      <ShadcnInputTags
        label="Topics"
        value={['Vue']}
        onValueChange={change}
        {...props}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Vue' }));
    expect(change).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  },
);

it.each(['inactive', 'pending'] as const)(
  'protects %s owners with the corresponding native canonical participation',
  (reason) => {
    const change = vi.fn();
    const contents = (protectedScope: boolean) => (
      <PortalActiveContext value={!(protectedScope && reason === 'inactive')}>
        <FormPendingContext value={protectedScope && reason === 'pending'}>
          <form>
            <ShadcnInputTags
              label="Topics"
              value={['Vue']}
              onValueChange={change}
              name="topics"
            />
          </form>
        </FormPendingContext>
      </PortalActiveContext>
    );
    const view = render(contents(true));
    const form = view.container.querySelector('form');
    if (!form) throw new Error('Missing native form');
    const input = screen.getByRole('combobox');
    expect(input).toHaveProperty('disabled', reason === 'inactive');
    expect(Array.from(new FormData(form))).toEqual(
      reason === 'inactive' ? [] : [['topics', 'Vue']],
    );
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Vue' }));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByText('Vue')).toBeVisible();
    expect(input).toHaveValue('');
    view.rerender(contents(false));
    expect(input).not.toBeDisabled();
    expect(Array.from(new FormData(form))).toEqual([['topics', 'Vue']]);
  },
);

it('uses the native RTL chip keyboard contract and inherited description', async () => {
  render(
    <DirectionProvider dir="rtl">
      <ShadcnInputTags
        label="Topics"
        description="Choose topics"
        value={['Vue']}
        onValueChange={vi.fn()}
      />
    </DirectionProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  expect(input).toHaveAccessibleDescription('Choose topics');
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByText('Vue').closest('[data-slot=combobox-chip]')).toHaveFocus();
});

it('keeps chips when a native removal proposal is declined', async () => {
  const change = vi.fn(() => false);
  render(<ShadcnInputTags label="Topics" value={['Vue']} onValueChange={change} />);
  await userEvent.click(screen.getByRole('button', { name: 'Remove Vue' }));
  expect(change).toHaveBeenCalledExactlyOnceWith([]);
  expect(screen.getByText('Vue')).toBeVisible();
});
