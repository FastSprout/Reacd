import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Link, ReacdProvider } from '../../index.js';

describe.each([shadcnAdapter, muiAdapter])('$id native navigation', (adapter) => {
  it('retains native hrefs, current-page and safe new-window state', () => {
    const view = render(
      <ReacdProvider adapter={adapter}>
        <Link label="Reference" href="/" active newWindow />
      </ReacdProvider>,
    );
    const link = screen.getByRole('link', { name: 'Reference' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    view.rerender(
      <ReacdProvider adapter={adapter}>
        <Link label="Reference" href="/" />
      </ReacdProvider>,
    );
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveAttribute('target');
  });

  it('removes disabled navigation for pointer and keyboard users', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={adapter}>
        <Link label="Unavailable reference" href="/" disabled newWindow />
      </ReacdProvider>,
    );
    const link = screen.getByRole('link', { name: 'Unavailable reference' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    await user.tab();
    expect(link).not.toHaveFocus();
    // MUI also blocks pointer hit-testing; synthetic activation must stay inert.
    fireEvent.click(link);
    expect(link).not.toHaveAttribute('href');
  });
});
