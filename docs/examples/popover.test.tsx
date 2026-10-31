import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PopoverExample } from './popover.js';
describe('documented Popover example', () => {
  it.each([
    ['Popover placement', ['Top', 'Inline start', 'Inline end', 'Bottom']],
    ['Popover alignment', ['Start', 'End', 'Center']],
    ['Popover mode', ['Hover', 'Click']],
  ] as const)('changes %s options', async (control, options) => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PopoverExample />
      </ReacdProvider>,
    );
    for (const option of options) await chooseOption(user, control, option);
  });
  it.each([
    'Modal popover',
    'Dismissible popover',
    'Retain popover content',
    'Disable popover trigger',
    'Popover arrow',
    'Long popover content',
  ])('changes %s and restores its value', async (label) => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PopoverExample />
      </ReacdProvider>,
    );
    const control = screen.getByRole('switch', { name: label });
    const initial = control.getAttribute('aria-checked');
    await user.click(control);
    expect(control.getAttribute('aria-checked')).not.toBe(initial);
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', initial);
  });
  it('edits, saves, and closes interactive content', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PopoverExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('switch', { name: 'Long popover content' }));
    await user.click(screen.getByRole('button', { name: 'Open details popover' }));
    await user.type(await screen.findByLabelText('Popover draft'), 'Example draft');
    await user.click(screen.getByRole('button', { name: 'Annotated save' }));
    await user.click(screen.getByRole('button', { name: 'Save local draft' }));
    expect(screen.getByText('Saved locally: Example draft')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close details popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Popover outside action' }));
    expect(screen.getByText('Outside action ran.')).toBeInTheDocument();
  });
  it('nests and closes independent popover content', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PopoverExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open details popover' }));
    await user.click(screen.getByRole('button', { name: 'Open nested popover' }));
    expect(await screen.findByRole('dialog', { name: 'Nested details' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close nested popover' }));
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Nested details' }),
      ).not.toBeInTheDocument(),
    );
    await user.click(screen.getByRole('button', { name: 'Close details popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Popover outside action' }));
    expect(screen.getByText('Outside action ran.')).toBeInTheDocument();
  });
  it('restores a controlled child when its retained parent reopens', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PopoverExample />
      </ReacdProvider>,
    );
    await user.click(
      screen.getByRole('button', { name: 'Open popover parent dialog' }),
    );
    await user.click(screen.getByRole('button', { name: 'Open dialog popover' }));
    const popup = within(await screen.findByRole('dialog', { name: 'Dialog details' }));
    await user.click(popup.getByRole('button', { name: 'Dialog popover action' }));
    await user.click(popup.getByRole('button', { name: 'Hide parent dialog' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(
      screen.getByRole('button', { name: 'Open popover parent dialog' }),
    );
    await screen.findByRole('dialog', { name: 'Dialog details' });
    await user.click(popup.getByRole('button', { name: 'Close dialog popover' }));
    await user.click(
      screen.getByRole('button', { name: 'Close popover parent dialog' }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByText('Dialog popover action ran.')).toBeInTheDocument();
  });
});
