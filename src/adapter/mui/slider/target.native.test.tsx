import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiSlider } from './slider.adapter.js';

it.each(['horizontal', 'vertical'] as const)(
  'uses a policy-sized native %s Slider interaction root',
  (orientation) => {
    render(
      <MuiSlider
        label="Volume"
        value={5}
        min={0}
        max={10}
        orientation={orientation}
        onValueChange={vi.fn()}
      />,
    );
    const input = screen.getByRole('slider', { name: 'Volume' });
    const root = input.closest('.MuiSlider-root');
    expect(root).toHaveStyle(
      orientation === 'vertical'
        ? { minWidth: `${LAYOUT_POLICY.controlTargetPx}px` }
        : { minHeight: `${LAYOUT_POLICY.controlTargetPx}px` },
    );
  },
);
