import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SITE_POLICY } from '../policy.js';
import { DEFAULT_DESIGN_PREFERENCES } from '../design/preferences.js';
import { applyInitialAppearance, updateInitialDesign } from './initial-appearance.js';
import { readAppearance, readDesign } from './preferences.js';

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  const style = document.createElement('style');
  style.id = SITE_POLICY.initialDesignId;
  document.head.append(style);
});

afterEach(() => {
  document.getElementById(SITE_POLICY.initialDesignId)?.remove();
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('prepares exact SDK dark tokens without loading the application', () => {
  localStorage.setItem(SITE_POLICY.appearancePreference, 'dark');
  applyInitialAppearance(window);
  const css = document.getElementById(SITE_POLICY.initialDesignId)?.textContent;
  expect(css).toContain('html{color-scheme:dark}');
  expect(css).toContain('body{background:#0a0a0a;color:#fafafa}');
  expect(css).toContain('--background:#0a0a0a!important');
  expect(css).toContain('html[data-reacd-boot] #reacd-site');
  expect(readDesign(window)).toEqual(DEFAULT_DESIGN_PREFERENCES);
});

it('uses saved light and falls back from invalid appearance to the system', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  localStorage.setItem(SITE_POLICY.appearancePreference, 'light');
  expect(readAppearance(window)).toBe('light');
  localStorage.setItem(SITE_POLICY.appearancePreference, 'invalid');
  expect(readAppearance(window)).toBe('dark');
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  expect(readAppearance(window)).toBe('light');
});

it('rejects malformed design data and accepts a valid named preset', () => {
  localStorage.setItem(SITE_POLICY.designPreference, '{broken');
  expect(readDesign(window)).toEqual(DEFAULT_DESIGN_PREFERENCES);
  const design = { ...DEFAULT_DESIGN_PREFERENCES, primary: 'blue' };
  localStorage.setItem(SITE_POLICY.designPreference, JSON.stringify(design));
  expect(readDesign(window)).toEqual(design);
});

it('keeps system appearance when preference storage is blocked', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Blocked');
  });
  expect(readAppearance(window)).toBe('dark');
  expect(readDesign(window)).toEqual(DEFAULT_DESIGN_PREFERENCES);
  expect(() => applyInitialAppearance(window)).not.toThrow();
});

it('does not create an unrelated stylesheet if the host element is missing', () => {
  document.getElementById(SITE_POLICY.initialDesignId)?.remove();
  updateInitialDesign(document, 'light', DEFAULT_DESIGN_PREFERENCES);
  expect(document.getElementById(SITE_POLICY.initialDesignId)).toBeNull();
});

it('runs the standalone entry against the same host implementation', async () => {
  vi.resetModules();
  await import('./appearance-entry.js');
  expect(document.getElementById(SITE_POLICY.initialDesignId)?.textContent).toContain(
    'html{color-scheme:light}',
  );
});
