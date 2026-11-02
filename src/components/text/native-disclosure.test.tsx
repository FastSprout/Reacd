import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider, Text } from '../../index.js';

describe.each([shadcnAdapter, muiAdapter])('$id full text', (adapter) => {
  it('reveals complete text with the native SDK disclosure and keyboard', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={adapter}>
        <Text role="headline" lineLimit={1}>
          Complete long text
        </Text>
      </ReacdProvider>,
    );
    expect(screen.getAllByText('Complete long text')).toHaveLength(1);
    const trigger = screen.getByRole('button', { name: 'Full text' });
    const heading = screen.getByRole('heading', { name: 'Complete long text' });
    expect(heading.parentElement?.contains(trigger)).toBe(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByText('Complete long text')).toHaveLength(2);
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => {
      expect(screen.getAllByText('Complete long text')).toHaveLength(1);
    });
  });

  it('does not add a disclosure to text without a line limit', () => {
    render(
      <ReacdProvider adapter={adapter}>
        <Text>Short text</Text>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});
