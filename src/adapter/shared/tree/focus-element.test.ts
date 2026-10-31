import { expect, it } from 'vitest';
import { focusTreeElement } from './focus-element.js';
it('focuses available nodes and tolerates a removed or absent target', () => {
  const element = document.createElement('div');
  element.tabIndex = 0;
  document.body.appendChild(element);
  const nodes = new Map([['available', element]]);
  focusTreeElement(nodes, 'available');
  expect(element).toHaveFocus();
  focusTreeElement(nodes, 'removed');
  focusTreeElement(nodes, undefined);
  expect(element).toHaveFocus();
  element.remove();
});
