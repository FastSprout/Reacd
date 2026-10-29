import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Form, ReacdProvider, Text } from '../../index.js';

it('rejects raw native ancestry before mounting a form', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  render(
    <form aria-label="Host form">
      <ReacdProvider>
        <Form label="Nested application form" onSubmit={vi.fn()}>
          <Text>Inner controls</Text>
        </Form>
      </ReacdProvider>
    </form>,
  );
  expect(screen.queryByRole('form', { name: 'Nested application form' })).toBeNull();
  expect(screen.getByRole('alert')).toHaveTextContent(/nested/i);
  expect(errors).not.toHaveBeenCalled();
  errors.mockRestore();
});
