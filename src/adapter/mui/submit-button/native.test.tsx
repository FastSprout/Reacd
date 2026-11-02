import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiSubmitButton } from './submit-button.adapter.js';
it.each(['primary', 'secondary', 'danger'] as const)(
  'uses a native submit button with %s intent',
  (intent) => {
    render(<MuiSubmitButton label="Save" intent={intent} />);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'submit',
    );
  },
);
