import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShadcnSeparator } from './separator.adapter.js';

describe('Separator adapter', () => {
  it('renders a semantic horizontal boundary by default', () => {
    render(<ShadcnSeparator />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('supports labeled vertical boundaries', () => {
    render(
      <ShadcnSeparator
        orientation="vertical"
        label="Continue"
        position="end"
        lineStyle="dotted"
        size="large"
        intent="primary"
      />,
    );
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    expect(screen.getByText('Continue')).toBeVisible();
  });

  it('hides decorative boundaries and supports composed content', () => {
    render(<ShadcnSeparator decorative>Section</ShadcnSeparator>);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByText('Section')).toBeVisible();
  });
});
