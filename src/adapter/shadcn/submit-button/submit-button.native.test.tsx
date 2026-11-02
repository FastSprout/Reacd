import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSubmitButton } from './submit-button.adapter.js';

it('selects official SDK button intent for a native submit action', () => {
  render(<ShadcnSubmitButton label="Save" />);
  expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
    'type',
    'submit',
  );
});
