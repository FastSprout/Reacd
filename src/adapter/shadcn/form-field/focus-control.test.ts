import { expect, it } from 'vitest';
import { focusFieldControl } from './focus-control.js';

it('focuses eligible scoped controls and skips bridges', () => {
  expect(() => focusFieldControl(null)).not.toThrow();
  const root = document.createElement('fieldset');
  root.tabIndex = -1;
  root.innerHTML =
    '<input type="hidden"><input hidden><input disabled>' +
    '<div hidden><input></div><button aria-disabled="true">Blocked</button>' +
    '<div aria-hidden="true"><input></div><input aria-label="Visible">';
  document.body.appendChild(root);
  try {
    focusFieldControl(root);
    expect(root.querySelector('[aria-label="Visible"]')).toHaveFocus();
    root.replaceChildren();
    focusFieldControl(root);
    expect(root).toHaveFocus();
  } finally {
    root.remove();
  }
});
