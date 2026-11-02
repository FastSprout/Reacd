import { afterEach, expect, it, vi } from 'vitest';
import { browserActions } from './actions.js';
import { SITE_POLICY } from '../policy.js';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('uses an explicit preference and writes only the owned appearance key', () => {
  const actions = browserActions(window);
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  expect(actions.readAppearance()).toBe('light');
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  expect(actions.readAppearance()).toBe('dark');
  actions.persistAppearance('light');
  expect(actions.readAppearance()).toBe('light');
  expect(localStorage.getItem(SITE_POLICY.appearancePreference)).toBe('light');
  actions.persistAppearance('dark');
  expect(actions.readAppearance()).toBe('dark');
});

it('retains device appearance when preference reads and writes are blocked', () => {
  const actions = browserActions(window);
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Blocked');
  });
  expect(actions.readAppearance()).toBe('dark');
  expect(() => actions.persistAppearance('light')).not.toThrow();
});

it('delegates source copying to the browser clipboard API', async () => {
  const writeText = vi.fn(async () => undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  await browserActions(window).copyText('Content');
  expect(writeText).toHaveBeenCalledWith('Content');
});

it('rejects copying asynchronously when the clipboard API is unavailable', async () => {
  vi.stubGlobal('navigator', {});
  const result = browserActions(window).copyText('Content');
  await expect(result).rejects.toThrow();
});

it('binds Ctrl/Meta K and removes the exact document listener', () => {
  const notify = vi.fn();
  const add = vi.spyOn(document, 'addEventListener');
  const remove = vi.spyOn(document, 'removeEventListener');
  const actions = browserActions(window);
  const unsubscribe = actions.subscribeSearchShortcut?.(notify);
  if (!unsubscribe) throw new Error('The browser must expose the search shortcut');
  for (const modifiers of [
    { ctrlKey: true },
    { metaKey: true },
    { ctrlKey: true, metaKey: true, shiftKey: true },
  ]) {
    const event = new KeyboardEvent('keydown', {
      key: modifiers.shiftKey ? 'K' : 'k',
      ...modifiers,
      cancelable: true,
    });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  }
  expect(notify).toHaveBeenCalledTimes(3);
  const listener = add.mock.calls.find(([type]) => type === 'keydown')?.[1];
  unsubscribe();
  expect(remove).toHaveBeenCalledWith('keydown', listener);
  const afterCleanup = new KeyboardEvent('keydown', {
    key: 'k',
    ctrlKey: true,
    cancelable: true,
  });
  document.dispatchEvent(afterCleanup);
  expect(afterCleanup.defaultPrevented).toBe(false);
  expect(notify).toHaveBeenCalledTimes(3);
});

it('preserves unrelated keys, Alt combinations and IME composition', () => {
  const notify = vi.fn();
  const actions = browserActions(window);
  const unsubscribe = actions.subscribeSearchShortcut?.(notify);
  if (!unsubscribe) throw new Error('The browser must expose the search shortcut');
  const cases: KeyboardEventInit[] = [
    { key: 'k' },
    { key: 'x', ctrlKey: true },
    { key: 'k', ctrlKey: true, altKey: true },
    { key: 'k', metaKey: true, isComposing: true },
  ];
  for (const properties of cases) {
    const event = new KeyboardEvent('keydown', { ...properties, cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  }
  expect(notify).not.toHaveBeenCalled();
  unsubscribe();
});
