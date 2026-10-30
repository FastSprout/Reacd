import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ContentSurroundExample } from './content-surround.js';

it('preserves host data while the documented adjacent set becomes empty', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContentSurroundExample />
    </ReacdProvider>,
  );
  const input = screen.getByLabelText('Previous reference title');
  await user.clear(input);
  await user.type(input, 'Changed reference');
  expect(
    screen.getByRole('link', { name: /Previous Changed reference/ }),
  ).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'No adjacent documents' }));
  expect(screen.getByText('No adjacent pages.')).toBeVisible();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'No adjacent documents' }));
  expect(input).toHaveValue('Changed reference');
});
