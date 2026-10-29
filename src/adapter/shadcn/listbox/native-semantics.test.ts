import { expect, it } from 'vitest';
import { maintainListboxSemantics } from './native-semantics.js';

const flags = {
  readOnly: true,
  required: true,
  invalid: true,
  disabled: false,
  busy: true,
};

it('applies closed semantic attributes and tolerates an absent root', () => {
  const root = document.createElement('div');
  const releaseMissing = maintainListboxSemantics(null, flags);
  releaseMissing();
  const release = maintainListboxSemantics(root, flags);
  for (const attribute of ['readonly', 'required', 'invalid', 'busy']) {
    expect(root.getAttribute(`aria-${attribute}`)).toBe('true');
  }
  expect(root.getAttribute('aria-disabled')).toBe('false');
  expect(root.hasAttribute('tabindex')).toBe(false);
  release();
});

it('enforces disabled Tab exclusion across SDK rerenders and disconnects', async () => {
  const root = document.createElement('div');
  root.tabIndex = 0;
  document.body.append(root);
  const release = maintainListboxSemantics(root, { ...flags, disabled: true });
  expect(root.tabIndex).toBe(-1);
  root.tabIndex = 0;
  await Promise.resolve();
  expect(root.tabIndex).toBe(-1);
  root.setAttribute('aria-label', 'SDK update outside the filter');
  await Promise.resolve();
  expect(root.tabIndex).toBe(-1);
  release();
  expect(root.tabIndex).toBe(0);
  root.tabIndex = 0;
  await Promise.resolve();
  expect(root.tabIndex).toBe(0);
  root.remove();
});

it('retains the SDK roving tab stop when releasing a disabled root', () => {
  const root = document.createElement('div');
  const option = document.createElement('div');
  option.setAttribute('role', 'option');
  option.tabIndex = 0;
  root.append(option);
  root.tabIndex = -1;
  const release = maintainListboxSemantics(root, { ...flags, disabled: true });
  release();
  expect(root.tabIndex).toBe(-1);
});
