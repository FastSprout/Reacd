import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ColorHex } from './color-hex.js';
it('validates drafts on blur and submit then resets on Escape', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(
    <form>
      <ColorHex
        label="Color"
        mode="rgb"
        value="#123456"
        onValueChange={changed}
        disabled={false}
        readOnly={false}
      />
      <button type="submit">Submit</button>
    </form>,
  );
  const hex = screen.getByRole('textbox');
  await user.clear(hex);
  await user.type(hex, '#bad');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByRole('alert')).toBeVisible();
  expect(hex).toHaveFocus();
  expect(changed).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(hex).toHaveValue('#123456');
  await user.clear(hex);
  await user.type(hex, '#ABCDEF');
  await user.tab();
  expect(changed).toHaveBeenCalledExactlyOnceWith('#abcdef');
  view.rerender(
    <ColorHex
      label="Color"
      mode="rgb"
      value="#ffffff"
      onValueChange={changed}
      disabled={false}
      readOnly
    />,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '#000000' } });
  fireEvent.blur(screen.getByRole('textbox'));
  expect(changed).toHaveBeenCalledTimes(1);
  view.rerender(
    <ColorHex
      label="Color"
      mode="rgb"
      value="#ffffff"
      onValueChange={changed}
      disabled
      readOnly={false}
    />,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '#000000' } });
  fireEvent.blur(screen.getByRole('textbox'));
  await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
});
