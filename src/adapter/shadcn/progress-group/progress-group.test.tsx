import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { ProgressGroup } from '../../../components/progress-group/progress-group.js';

describe('shadcn ProgressGroup', () => {
  it('shows accessible aggregate and clamped segment values with every intent', () => {
    const view = render(
      <ReacdProvider>
        <ProgressGroup
          label="Storage"
          items={[
            { id: 'apps', label: 'Apps', value: 24 },
            { id: 'media', label: 'Media', value: 16, intent: 'secondary' },
            { id: 'reserved', label: 'Reserved', value: -2, intent: 'danger' },
          ]}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
    expect(screen.getByRole('list', { name: 'Storage breakdown' })).toHaveTextContent(
      'Reserved0 / 100',
    );
    expect(screen.getByText('40 / 100')).toBeInTheDocument();
    view.rerender(
      <ReacdProvider templateId="erp-compact">
        <ProgressGroup
          label="Storage"
          max={128}
          showStatus={false}
          items={[
            { id: 'apps', label: 'Apps', value: 300 },
            { id: 'media', label: 'Media', value: 128 },
          ]}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '128');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '128');
    expect(screen.getAllByText('128 / 128')).toHaveLength(2);
  });
});
