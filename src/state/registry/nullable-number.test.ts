import { describe, expect, it } from 'vitest';
import { createStateRegistry } from './state-registry.js';
describe('nullable numeric registry values', () => {
  it('keeps null distinct from finite numbers and enforces binding permissions', () => {
    const created = createStateRegistry([
      { key: 'amount', kind: 'nullableNumber', access: 'readWrite', initial: null },
      { key: 'finite', kind: 'number', access: 'readWrite', initial: 1 },
    ]);
    if (!created.success) throw new Error('Registry creation failed.');
    const registry = created.data;
    expect(registry.read('amount')).toMatchObject({ data: { value: null } });
    expect(registry.update('amount', 1.25).success).toBe(true);
    expect(registry.update('amount', null).success).toBe(true);
    expect(registry.update('finite', null).success).toBe(false);
    expect(registry.update('amount', Infinity).success).toBe(false);
    const binding = registry.bind(
      { state: 'amount', mode: 'read' },
      { kinds: ['nullableNumber'], mode: 'read' },
    );
    if (!binding.success) throw new Error('Read binding failed.');
    expect('write' in binding.data).toBe(false);
    expect(registry.reset().success).toBe(true);
    expect(registry.read('amount')).toMatchObject({ data: { value: null } });
  });
});
