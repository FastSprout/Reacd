import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { FooterExample } from './footer.js';

describe('documented Footer example', () => {
  it('renders its public declaration', () => {
    render(
      <ReacdProvider>
        <FooterExample />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Application footer')).toBeVisible();
  });
});
