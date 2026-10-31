import { expect, it } from 'vitest';
import { focusListboxAfterClear } from './clear-focus.js';

it('restores the visible list from an accepted focused Clear action', () => {
  const root = document.createElement('div');
  root.tabIndex = -1;
  const button = document.createElement('button');
  document.body.append(root, button);
  button.focus();
  focusListboxAfterClear(root, button, true);
  expect(document.activeElement).toBe(root);
  button.focus();
  button.blur();
  focusListboxAfterClear(root, button, true);
  expect(document.activeElement).toBe(root);
  root.remove();
  button.remove();
});

it('preserves host focus, nonfocused pointer actions and missing roots', () => {
  const root = document.createElement('div');
  root.tabIndex = -1;
  const button = document.createElement('button');
  const host = document.createElement('input');
  document.body.append(root, button, host);
  host.focus();
  focusListboxAfterClear(root, button, true);
  focusListboxAfterClear(root, button, false);
  focusListboxAfterClear(null, button, true);
  expect(document.activeElement).toBe(host);
  root.remove();
  button.remove();
  host.remove();
});
