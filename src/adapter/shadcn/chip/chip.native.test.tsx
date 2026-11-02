import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChip } from './chip.adapter.js';
import { Button } from '../vendor/ui/button.js';

it('reserves a native indicator edge without replacing wrapped actions', () => {
  const view = render(
    <ShadcnChip label="Messages" text={0}>
      <Button>Inbox</Button>
    </ShadcnChip>,
  );
  expect(screen.getByRole('img', { name: 'Messages: 0' })).toHaveAttribute(
    'title',
    'Messages: 0',
  );
  expect(screen.getByRole('img').className).toContain('inline-flex');
  expect(screen.getByRole('button', { name: 'Inbox' })).not.toBeDisabled();
  view.rerender(
    <ShadcnChip label="Messages" show={false}>
      <Button>Inbox</Button>
    </ShadcnChip>,
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
        <ShadcnChip
          label="Online"
          corner={corner}
          size={size}
          inset
          intent="secondary"
        />,
      );
      expect(screen.getByRole('img', { name: 'Online' })).toBeVisible();
    }
  }
  view.rerender(
    <ShadcnChip label="Errors" text="Full value" standalone intent="danger" />,
  );
  expect(screen.getByRole('img', { name: 'Errors: Full value' })).toBeVisible();
});
