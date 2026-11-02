import { expect, it, vi } from 'vitest';
import { registrationId } from './registration-id.js';
import { createRegistrationScope } from './registration-scope.js';

it('encodes private identities without RHF path syntax or collisions', () => {
  const dotted = registrationId('profile.name[0]');
  expect(dotted).not.toMatch(/[.[\]]/);
  expect(dotted).not.toBe(registrationId('profile%2Ename[0]'));
  expect(dotted).toBe(registrationId('profile.name[0]'));
});

it('restores committed owners and removes only declared orphans', () => {
  const unregister = vi.fn();
  const restore = vi.fn();
  const scope = createRegistrationScope(unregister);
  scope.declare('retained');
  scope.declare('discarded');
  const release = scope.commit('retained', restore);
  expect(restore).toHaveBeenCalledTimes(1);
  scope.prepare();
  expect(unregister).toHaveBeenCalledExactlyOnceWith(['discarded']);
  expect(restore).toHaveBeenCalledTimes(2);
  scope.prepare();
  expect(unregister).toHaveBeenCalledTimes(1);
  expect(restore).toHaveBeenCalledTimes(3);
  release();
  scope.prepare();
  expect(unregister).toHaveBeenLastCalledWith(['retained']);
  expect(restore).toHaveBeenCalledTimes(3);
});

it('isolates sibling forms and StrictMode owner re-commit', () => {
  const unregisterA = vi.fn();
  const unregisterB = vi.fn();
  const a = createRegistrationScope(unregisterA);
  const b = createRegistrationScope(unregisterB);
  const first = vi.fn();
  const second = vi.fn();
  a.declare('same');
  b.declare('same');
  const release = a.commit('same', first);
  release();
  a.commit('same', second);
  a.prepare();
  b.prepare();
  expect(unregisterA).not.toHaveBeenCalled();
  expect(unregisterB).toHaveBeenCalledExactlyOnceWith(['same']);
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(2);
});
