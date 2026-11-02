import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TOOLTIP_POLICY } from '../../../core/tooltip-policy.js';
import { ShadcnTooltip } from './tooltip.adapter.js';

it('bounds native SDK content without truncating long help', async () => {
  render(
    <ShadcnTooltip
      text={'Detailed help '.repeat(100)}
      open
      onOpenChange={() => undefined}
    >
      <button>Help</button>
    </ShadcnTooltip>,
  );
  await screen.findByRole('tooltip');
  const content = document.querySelector('[data-slot=tooltip-content]');
  expect(content).toHaveStyle({
    overflowWrap: 'anywhere',
    overflowY: 'visible',
  });
  expect(content).toHaveStyle({
    maxInlineSize: `min(${TOOLTIP_POLICY.widthRem}rem, ` +
      'var(--radix-tooltip-content-available-width))',
    maxBlockSize: 'var(--radix-tooltip-content-available-height)',
  });
  const scroll = content?.querySelector('[data-reacd-tooltip-scroll]');
  expect(scroll).toHaveStyle({ overflowY: 'auto', overflowWrap: 'anywhere' });
  expect(scroll).toHaveTextContent('Detailed help');
});
