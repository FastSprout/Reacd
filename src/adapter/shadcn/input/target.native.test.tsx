import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnInput } from './input.adapter.js';

it('sizes the actual SDK input target without replacing its native control', () => {
  render(
    <ShadcnInput
      label="Email"
      value="ada@example.com"
      onValueChange={() => undefined}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(input.className).toContain('border-input');
  expect(input).toHaveStyle({ minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px` });
});
