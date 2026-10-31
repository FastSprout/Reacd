import { render, screen } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it } from 'vitest';
import { SharedSeparator } from './separator.adapter.js';

describe('Separator adapter', () => {
  it('renders a semantic horizontal boundary by default', () => {
    render(<SharedSeparator />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('supports labeled vertical boundaries', () => {
    render(
      <SharedSeparator
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
    render(<SharedSeparator decorative>Section</SharedSeparator>);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByText('Section')).toBeVisible();
  });
});
