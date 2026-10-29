import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FooterColumns, ReacdProvider, Text } from '../../../index.js';

describe('shadcn FooterColumns', () => {
  it('renders named columns, slots and disabled native targets', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ReacdProvider>
        <FooterColumns
          label="Site resources"
          left={<Text>Left slot</Text>}
          right={<Text>Right slot</Text>}
          columns={[
            {
              key: 'docs',
              label: 'Documentation',
              children: [
                {
                  key: 'current',
                  label: 'Current page',
                  href: '/current',
                  active: true,
                },
                {
                  key: 'new',
                  label: 'External resource',
                  href: 'https://reacd.dev/',
                  newWindow: true,
                },
                {
                  key: 'disabled',
                  label: 'Disabled page',
                  href: '/disabled',
                  disabled: true,
                },
                { key: 'label', label: 'Information' },
                { key: 'run', label: 'Run action', onPress: action },
                {
                  key: 'blocked',
                  label: 'Blocked action',
                  onPress: action,
                  disabled: true,
                },
              ],
            },
          ]}
        />
      </ReacdProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'Site resources' });
    expect(
      within(nav).getByRole('list', { name: 'Documentation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Current page' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'External resource' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(screen.queryByRole('link', { name: 'Disabled page' })).toBeNull();
    expect(screen.getByText('Disabled page')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Left slot')).toBeInTheDocument();
    expect(screen.getByText('Right slot')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Run action' }));
    await user.click(screen.getByRole('button', { name: 'Blocked action' }));
    expect(action).toHaveBeenCalledOnce();
  });
  it('supports an empty footer without phantom headings or slots', () => {
    render(
      <ReacdProvider>
        <FooterColumns label="Empty footer" columns={[]} />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
