import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { App, Input, Modal, ReacdProvider } from '../../../index.js';

function Example({ direction }: { direction: 'ltr' | 'rtl' }) {
  return (
    <ReacdProvider>
      <App direction={direction}>
        <Modal
          title="Scoped modal"
          description="Scoped portal direction"
          open
          onOpenChange={vi.fn()}
        >
          <Input label="Scoped query" value="" onValueChange={vi.fn()} />
        </Modal>
      </App>
    </ReacdProvider>
  );
}

it('captures and updates App direction across the native portal boundary', () => {
  const view = render(<Example direction="rtl" />);
  const dialog = screen.getByRole('dialog', { name: 'Scoped modal' });
  expect(document.documentElement.dir).not.toBe('rtl');
  expect(dialog).toHaveAttribute('dir', 'rtl');
  expect(dialog.closest('[data-base-ui-portal]')).toHaveAttribute('dir', 'rtl');
  view.rerender(<Example direction="ltr" />);
  expect(dialog).toHaveAttribute('dir', 'ltr');
  expect(dialog.closest('[data-base-ui-portal]')).toHaveAttribute('dir', 'ltr');
});
