import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Link, ReacdProvider } from '../../index.js';

describe('native navigation boundary', () => {
  it('retains native hrefs, current-page and safe new-window state', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Link label="Reference" href="/" active newWindow />
      </ReacdProvider>,
    );
    const link = screen.getByRole('link', { name: 'Reference' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Link label="Reference" href="/" />
      </ReacdProvider>,
    );
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveAttribute('target');
  });

  it('removes disabled navigation for pointer and keyboard users', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Link label="Unavailable reference" href="/" disabled newWindow />
      </ReacdProvider>,
    );
    const link = screen.getByRole('link', { name: 'Unavailable reference' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('target');
    await user.tab();
    expect(link).not.toHaveFocus();
    await user.click(link);
    expect(link).not.toHaveAttribute('href');
  });
});
