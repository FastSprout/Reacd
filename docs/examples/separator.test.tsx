import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { SeparatorExample } from './separator.js';

describe('documented Separator example', () => {
  it('renders its public declaration', () => {
    render(
      <ReacdProvider>
        <SeparatorExample />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Notification preferences')).toBeVisible();
  });
});
