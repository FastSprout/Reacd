import { expect, it } from 'vitest';
import { captureRangeFocus } from './range-reset-focus.js';

function fixture() {
  const root = document.createElement('fieldset');
  const segment = document.createElement('input');
  segment.setAttribute('role', 'spinbutton');
  root.append(segment);
  document.body.append(root);
  return { root, segment };
}

it('restores a recreated segment without scrolling', () => {
  const { root, segment } = fixture();
  segment.focus();
  const restore = captureRangeFocus(root);
  const replacement = document.createElement('input');
  replacement.setAttribute('role', 'textbox');
  segment.replaceWith(replacement);
  restore();
  expect(document.activeElement).toBe(replacement);
  restore();
  expect(document.activeElement).toBe(replacement);
  root.remove();
});

it('preserves connected original focus and handles a missing restored segment', () => {
  const { root, segment } = fixture();
  segment.focus();
  const restore = captureRangeFocus(root);
  restore();
  expect(document.activeElement).toBe(segment);
  segment.remove();
  restore();
  expect(document.activeElement).toBe(document.body);
  root.remove();
});

it('does not steal host focus or focus outside/detached ranges', () => {
  const { root, segment } = fixture();
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  const outsideRestore = captureRangeFocus(root);
  segment.focus();
  const restore = captureRangeFocus(root);
  outside.focus();
  outsideRestore();
  restore();
  expect(document.activeElement).toBe(outside);
  root.remove();
  restore();
  expect(document.activeElement).toBe(outside);
  outside.remove();
});
