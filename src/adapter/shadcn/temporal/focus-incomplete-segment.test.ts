import { expect, it } from 'vitest';
import { focusIncompleteSegment } from './focus-incomplete-segment.js';

it.each(['spinbutton', 'textbox'])('focuses scoped incomplete %s segments', (role) => {
  expect(focusIncompleteSegment(null)).toBe(false);
  const root = document.createElement('div');
  expect(focusIncompleteSegment(root)).toBe(false);
  const segment = document.createElement('span');
  segment.tabIndex = 0;
  segment.setAttribute('role', role);
  segment.setAttribute('data-placeholder', 'true');
  root.appendChild(segment);
  document.body.appendChild(root);
  expect(focusIncompleteSegment(root)).toBe(true);
  expect(segment).toHaveFocus();
  root.remove();
});
