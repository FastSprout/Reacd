import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ContainerExample } from './container.js';

describe('documented Container example', () => {
  it('renders its public declaration', () => {
    render(
      <ReacdProvider>
        <ContainerExample />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.getByText('Readable content follows the active template.'),
    ).toBeVisible();
  });
});
