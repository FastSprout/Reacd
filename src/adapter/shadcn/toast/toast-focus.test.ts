import { afterEach, expect, it, vi } from 'vitest';
import { createToastFocus } from './toast-focus.js';
const hosts: HTMLElement[] = [];
afterEach(() => {
  for (const host of hosts) host.remove();
  hosts.length = 0;
});
function scene() {
  const host = document.createElement('div');
  const origin = document.createElement('button');
  const viewport = document.createElement('div');
  const current = document.createElement('div');
  const next = document.createElement('div');
  current.tabIndex = 0;
  next.tabIndex = 0;
  viewport.append(current, next);
  host.append(origin, viewport);
  document.body.append(host);
  hosts.push(host);
  return { host, origin, viewport, current, next };
}
it('restores connected targets after DOM removal', async () => {
  const { origin, viewport, current, next } = scene();
  const focus = createToastFocus();
  focus.remember(viewport, origin);
  const guard = document.createElement('span');
  guard.setAttribute('data-base-ui-focus-guard', '');
  focus.remember(viewport, guard);
  focus.remember(viewport, current);
  focus.remember(viewport, null);
  current.focus();
  focus.close(
    'current',
    [
      { id: 'current', ref: { current } },
      { id: 'next', ref: { current: next } },
    ],
    () => current.remove(),
  );
  await Promise.resolve();
  expect(next).toHaveFocus();
  focus.close('next', [{ id: 'next', ref: { current: next } }], () => next.remove());
  await Promise.resolve();
  expect(origin).toHaveFocus();
});
it('skips ending, limited, missing and disconnected sibling roots', async () => {
  const { origin, viewport, current, next } = scene();
  const focus = createToastFocus();
  focus.remember(viewport, origin);
  const detached = document.createElement('div');
  current.focus();
  focus.close(
    'current',
    [
      { id: 'before', ref: { current: next } },
      { id: 'current', ref: { current } },
      { id: 'limited', limited: true, ref: { current: next } },
      { id: 'ending', transitionStatus: 'ending', ref: { current: next } },
      { id: 'missing' },
      { id: 'empty', ref: { current: null } },
      { id: 'detached', ref: { current: detached } },
    ],
    () => current.remove(),
  );
  await Promise.resolve();
  expect(next).toHaveFocus();
});
it('avoids stale or unrelated focus targets', async () => {
  const { origin, viewport, current, next } = scene();
  const focus = createToastFocus();
  const dismiss = vi.fn();
  origin.focus();
  focus.close('missing', [], dismiss);
  focus.close('null', [{ id: 'null', ref: { current: null } }], dismiss);
  focus.close('no-ref', [{ id: 'no-ref' }], dismiss);
  focus.close('current', [{ id: 'current', ref: { current } }], dismiss);
  expect(dismiss).toHaveBeenCalledTimes(4);
  await Promise.resolve();
  expect(origin).toHaveFocus();
  focus.remember(viewport, origin);
  current.focus();
  focus.close(
    'current',
    [
      { id: 'current', ref: { current } },
      { id: 'next', ref: { current: next } },
    ],
    () => {
      current.remove();
      next.remove();
      origin.remove();
    },
  );
  await Promise.resolve();
  expect(document.activeElement).toBe(document.body);
});
it('respects newer host focus choices', async () => {
  const { origin, viewport, current, next } = scene();
  const focus = createToastFocus();
  focus.remember(viewport, origin);
  const records = [{ id: 'current', ref: { current } }];
  current.focus();
  focus.close('current', records, () => next.focus());
  await Promise.resolve();
  expect(next).toHaveFocus();
  current.focus();
  focus.close('current', records, vi.fn());
  await Promise.resolve();
  expect(origin).toHaveFocus();
});
