import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider, Skeleton } from '../../../index.js';

describe('shadcn Skeleton', () => {
  it('is decorative by default and announces only an explicit loading label', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Skeleton />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('status')).toBeNull();
    expect(view.container.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(view.container.querySelectorAll('.reacd-skeleton-shape')).toHaveLength(3);
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Skeleton label="Loading records" />
      </ReacdProvider>,
    );
    const status = screen.getByRole('status', { name: 'Loading records' });
    expect(status.closest('[aria-busy="true"]')).toBeNull();
    expect(status).not.toHaveAttribute('aria-hidden');
    expect(status).not.toHaveAttribute('tabindex');
    expect(status).toHaveTextContent('Loading records');
  });
  it('supports every shape/size and removes a hidden status completely', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Skeleton />
      </ReacdProvider>,
    );
    for (const shape of ['text', 'avatar', 'rectangle'] as const)
      for (const size of ['small', 'medium', 'large'] as const) {
        view.rerender(
          <ReacdProvider adapter={shadcnAdapter} templateId="erp-compact">
            <Skeleton shape={shape} size={size} animated={false} />
          </ReacdProvider>,
        );
        expect(view.container.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
          'data-size',
          size,
        );
        expect(view.container.querySelectorAll('.reacd-skeleton-shape')).toHaveLength(
          shape === 'text' ? 3 : 1,
        );
      }
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Skeleton lines={1} />
      </ReacdProvider>,
    );
    expect(view.container.querySelector('[data-short="true"]')).toBeNull();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Skeleton show={false} label="Hidden" />
      </ReacdProvider>,
    );
    expect(view.container.querySelector('[data-slot="skeleton"]')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
