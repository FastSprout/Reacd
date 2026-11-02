import { render, screen } from '@testing-library/react';
import Button from '@mui/material/Button';
import { expect, it } from 'vitest';
import { MuiChip } from './chip.adapter.js';

it('reserves a native indicator edge without replacing wrapped actions', () => {
  const view = render(
    <MuiChip label="Messages" text={0}>
      <Button>Inbox</Button>
    </MuiChip>,
  );
  expect(screen.getByRole('img', { name: 'Messages: 0' })).toHaveAttribute(
    'title',
    'Messages: 0',
  );
  expect(screen.getByRole('img').className).toContain('MuiChip-root');
  expect(screen.getByRole('button', { name: 'Inbox' })).not.toBeDisabled();
  view.rerender(
    <MuiChip label="Messages" show={false}>
      <Button>Inbox</Button>
    </MuiChip>,
  );
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByRole('button')).not.toBeDisabled();
  for (const corner of [
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
  ] as const) {
    for (const size of ['small', 'medium', 'large'] as const) {
      view.rerender(
        <MuiChip label="Online" corner={corner} size={size} inset intent="secondary" />,
      );
      expect(screen.getByRole('img', { name: 'Online' })).toBeVisible();
    }
  }
  view.rerender(
    <MuiChip label="Errors" text="Full value" standalone intent="danger" />,
  );
  expect(screen.getByRole('img', { name: 'Errors: Full value' })).toBeVisible();
});
