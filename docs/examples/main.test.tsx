import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { MainExample } from './main.js';

describe('documented Main example', () => {
  it('renders its public declaration', () => {
    render(
      <ReacdProvider>
        <MainExample />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Main application content')).toBeVisible();
  });
});
