import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiTextarea } from './textarea.adapter.js';
it('uses Material multiline with controlled text and row constraints', async () => {
  const change = vi.fn<(value: string) => void>();
  const view = render(
    <MuiTextarea
      label="Notes"
      value=""
      onValueChange={change}
      description="Project details"
      rows={2}
      maxRows={5}
      autoResize
      maxLength={100}
    />,
  );
  const field = screen.getByRole('textbox', { name: 'Notes' });
  expect(field.closest('.MuiTextField-root')).not.toBeNull();
  expect(field.tagName).toBe('TEXTAREA');
  expect(getComputedStyle(field).minBlockSize)
    .toBe(`${LAYOUT_POLICY.controlTargetPx}px`);
  const shadow = view.container.querySelector('textarea[aria-hidden="true"]');
  if (!(shadow instanceof HTMLTextAreaElement))
    throw new Error('Expected native autosize measurement.');
  expect(getComputedStyle(shadow).minBlockSize)
    .not.toBe(`${LAYOUT_POLICY.controlTargetPx}px`);
  expect(field).toHaveAccessibleDescription('Project details');
  await userEvent.type(field, 'a');
  expect(change).toHaveBeenCalledWith('a');
  view.rerender(<MuiTextarea label="Notes" value="" onValueChange={change} readOnly />);
  await userEvent.type(field, 'b');
  expect(change).toHaveBeenCalledTimes(1);
});

it('uses native auto-size defaults without bespoke measurement', () => {
  render(
    <MuiTextarea
      label="Auto"
      value="Text"
      onValueChange={() => undefined}
      autoResize
    />,
  );
  expect(screen.getByRole('textbox', { name: 'Auto' })).toHaveValue('Text');
});
