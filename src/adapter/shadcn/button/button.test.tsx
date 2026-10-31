import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button, ReacdProvider } from '../../../index.js';

it('activates with pointer/keyboard and protects busy controls', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Button label="Save" onPress={action} />
    </ReacdProvider>,
  );
  const button = screen.getByRole('button', { name: 'Save' });
  await user.click(button);
  expect(action).toHaveBeenCalledExactlyOnceWith();
  await user.keyboard('{Enter} ');
  expect(action).toHaveBeenCalledTimes(3);
  expect(action.mock.calls).toEqual([[], [], []]);
  expect(button).toHaveAttribute('type', 'button');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Button label="Save" onPress={action} disabled />
    </ReacdProvider>,
  );
  await user.click(button);
  expect(action).toHaveBeenCalledTimes(3);
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Button label="Save" onPress={action} loading loadingLabel="Saving" />
    </ReacdProvider>,
  );
  const busy = screen.getByRole('button', { name: 'Saving' });
  expect(busy).toBeDisabled();
  expect(busy).toHaveAttribute('aria-busy', 'true');
  await user.click(busy);
  expect(action).toHaveBeenCalledTimes(3);
});

it('keeps icon decoration separate from the supplied visible label', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Button
        label="Download"
        onPress={() => undefined}
        leadingIcon="download"
        trailingIcon="external"
        intent="secondary"
      />
    </ReacdProvider>,
  );
  expect(
    screen
      .getByRole('button', { name: 'Download' })
      .querySelectorAll('[aria-hidden="true"]'),
  ).toHaveLength(2);
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Button label="Delete" onPress={() => undefined} loading intent="danger" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
});
