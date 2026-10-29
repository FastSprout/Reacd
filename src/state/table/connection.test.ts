import { expect, it, vi } from 'vitest';
import { tableFixture } from '../../../test-support/data-table.js';
import { stateFailure } from '../registry/transaction.js';
import { createTableConnection } from './connection.js';
it('leases a controller connection and releases it on unsubscribe', () => {
  const { controller, registry } = tableFixture();
  const model = createTableConnection(controller);
  const notify = vi.fn();
  expect(model.serverSnapshot().success).toBe(true);
  expect(model.snapshot()).toBe(model.serverSnapshot());
  const cleanup = model.subscribe(notify);
  expect(model.snapshot().success).toBe(true);
  expect(notify).toHaveBeenCalledExactlyOnceWith();
  expect(registry.update('orders.selection', ['missing']).success).toBe(false);
  cleanup();
  expect(registry.update('orders.selection', ['missing']).success).toBe(true);
});
it('caches errors without creating resources on server reads', () => {
  const { controller } = tableFixture();
  const failure = stateFailure('table', 'Connection unavailable');
  const connect = vi.fn(() => failure);
  const model = createTableConnection({ ...controller, connect });
  expect(model.serverSnapshot().success).toBe(true);
  expect(connect).not.toHaveBeenCalled();
  const cleanup = model.subscribe(() => undefined);
  expect(model.snapshot()).toBe(failure);
  expect(model.snapshot()).toBe(model.snapshot());
  cleanup();
});
