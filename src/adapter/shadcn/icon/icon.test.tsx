import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { Icon } from '../../../components/icon/index.js';
import { ICON_NAMES } from '../../../core/icon-policy.js';

it.each(ICON_NAMES)(
  'renders semantic %s icons with one explicit accessible name',
  (name) => {
    const view = render(
      <ReacdProvider>
        <Icon name={name} label="Operation" />
      </ReacdProvider>,
    );
    const icon = screen.getByRole('img', { name: 'Operation' });
    expect(icon).toHaveAttribute('focusable', 'false');
    view.rerender(
      <ReacdProvider>
        <Icon name={name} decorative size="small" />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('img')).toBeNull();
    expect(view.container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
);
it('supports closed named sizes without exposing SVG or CSS controls', () => {
  render(
    <ReacdProvider>
      <Icon name="check" label="Complete" size="large" decorative={false} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Complete' })).toHaveAttribute(
    'data-size',
    'large',
  );
});
