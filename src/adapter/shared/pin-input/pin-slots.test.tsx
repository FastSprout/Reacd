import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { PinSlots } from './pin-slots.js';

it('renders a static caret with active visual-only slots', () => {
  const { container } = render(
    <PinSlots
      slots={[
        { char: null, placeholderChar: null, isActive: true, hasFakeCaret: true },
      ]}
      mask={false}
      separatorEvery={undefined}
    />,
  );
  expect(container.querySelector('.reacd-pin-caret')).not.toBeNull();
  expect(screen.getByText('○')).toHaveAttribute('data-active', 'true');
});
