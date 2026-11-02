import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnSlider } from './slider.adapter.js';

it.each(['horizontal', 'vertical'] as const)(
  'keeps the native %s track inside a policy-sized interaction root',
  (orientation) => {
    render(
      <ShadcnSlider
        label="Volume"
        value={5}
        min={0}
        max={10}
        orientation={orientation}
        onValueChange={vi.fn()}
      />,
    );
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    const root = thumb.closest('[data-slot="slider"]');
    expect(root).toHaveStyle(
      orientation === 'vertical'
        ? { minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px` }
        : { minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px` },
    );
    expect(thumb.className).toContain('size-4');
  },
);
