import { expect, it } from 'vitest';
import { focusTimeDraft } from './focus-draft.js';

it.each(['spinbutton', 'textbox'])(
  'focuses a scoped %s placeholder without moving into other fields',
  (role) => {
    expect(focusTimeDraft(null)).toBe(false);
    const root = document.createElement('div');
    expect(focusTimeDraft(root)).toBe(false);
    const complete = document.createElement('span');
    complete.setAttribute('role', 'spinbutton');
    const missing = document.createElement('span');
    missing.setAttribute('role', role);
    missing.setAttribute('data-placeholder', 'true');
    missing.tabIndex = 0;
    root.append(complete, missing);
    document.body.appendChild(root);
    expect(focusTimeDraft(root)).toBe(true);
    expect(missing).toHaveFocus();
    root.remove();
  },
);
