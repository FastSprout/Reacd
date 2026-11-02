import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { browserActions } from './actions.js';
import { SITE_POLICY } from '../policy.js';
import { DEFAULT_DESIGN_PREFERENCES } from '../design/preferences.js';

beforeEach(() => vi.stubGlobal('matchMedia', () => ({ matches: false })));
afterEach(() => {
  localStorage.clear();
  document.getElementById(SITE_POLICY.initialDesignId)?.remove();
  document.documentElement.removeAttribute('data-reacd-boot');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('can release startup styling without earlier preference reads', () => {
  document.documentElement.setAttribute('data-reacd-boot', '');
  browserActions(window).appearanceReady?.();
  expect(document.documentElement.hasAttribute('data-reacd-boot')).toBe(false);
});

it.each([false, true])('retains live design when blocked storage is %s', (blocked) => {
  const style = document.createElement('style');
  style.id = SITE_POLICY.initialDesignId;
  document.head.append(style);
  document.documentElement.setAttribute('data-reacd-boot', '');
  const actions = browserActions(window);
  expect(actions.readDesign?.()).toEqual(DEFAULT_DESIGN_PREFERENCES);
  if (blocked)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked');
    });
  actions.persistDesign?.({ ...DEFAULT_DESIGN_PREFERENCES, primary: 'blue' });
  actions.persistAppearance('dark');
  expect(style.textContent).toContain('--background:#0a0a0a!important');
  expect(style.textContent).not.toContain('--primary:#fafafa!important');
  actions.appearanceReady?.();
  expect(document.documentElement).not.toHaveAttribute('data-reacd-boot');
  if (!blocked)
    expect(
      JSON.parse(localStorage.getItem(SITE_POLICY.designPreference) ?? 'null'),
    ).toEqual({ ...DEFAULT_DESIGN_PREFERENCES, primary: 'blue' });
});
