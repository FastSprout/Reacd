import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiBadge } from './badge.adapter.js';
it.each(['primary', 'secondary', 'danger'] as const)(
  'maps %s tags to Material Chip',
  (intent) => {
    const view = render(
      <MuiBadge label="Ready" intent={intent} leadingIcon="check" size="small" />,
    );
    expect(screen.getByText('Ready').closest('.MuiChip-root')).not.toBeNull();
    view.rerender(<MuiBadge label="Ready" />);
    expect(screen.getByText('Ready')).toBeVisible();
  },
);
