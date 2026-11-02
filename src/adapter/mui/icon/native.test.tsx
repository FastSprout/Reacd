import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ICON_NAMES } from '../../../core/icon-policy.js';
import { MuiIcon } from './icon.adapter.js';
it.each(ICON_NAMES)('uses the Material %s semantic icon', (name) => {
  render(<MuiIcon name={name} label="Status" />);
  expect(screen.getByRole('img', { name: 'Status' }).classList).toContain(
    'MuiSvgIcon-root',
  );
});
it('keeps decorative Material icons out of the accessibility tree', () => {
  const view = render(<MuiIcon name="check" decorative size="small" />);
  expect(screen.queryByRole('img')).toBeNull();
  expect(view.container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});
