import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TOOLTIP_POLICY } from '../../../core/tooltip-policy.js';
import { MuiTooltip } from './tooltip.adapter.js';

it('bounds native SDK content without truncating long help', async () => {
  render(
    <MuiTooltip text={'Detailed help '.repeat(100)} open onOpenChange={() => undefined}>
      <button>Help</button>
    </MuiTooltip>,
  );
  await screen.findByRole('tooltip');
  const content = document.querySelector('.MuiTooltip-tooltip');
  expect(content).toHaveStyle({
    overflowWrap: 'anywhere',
    overflowY: 'visible',
  });
  const rules = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule);
  const applied = rules.find((rule) => content?.matches(rule.selectorText));
  expect(applied?.style.getPropertyValue('max-width')).toBe(
    `min(${TOOLTIP_POLICY.widthRem}rem, ` +
      `100dvw - ${TOOLTIP_POLICY.collisionPaddingPx * 2}px)`,
  );
  expect(applied?.style.getPropertyValue('max-height')).toBe(
    `calc(100dvh - ${TOOLTIP_POLICY.collisionPaddingPx * 2}px)`,
  );
  const scroll = content?.querySelector('[data-reacd-tooltip-scroll]');
  expect(scroll).toHaveStyle({ overflowY: 'auto', overflowWrap: 'anywhere' });
  expect(scroll).toHaveTextContent('Detailed help');
});
