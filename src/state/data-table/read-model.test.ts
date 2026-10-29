import { describe, expect, it } from 'vitest';
import {
  TABLE_BINDINGS,
  TABLE_MODEL,
  success,
  tableDefinitions,
} from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { readTableModel } from './read-model.js';

describe('table state projection', () => {
  it('rejects missing keys and incompatible state kinds', () => {
    const missing = success(createStateRegistry([]));
    expect(
      readTableModel(missing.read, TABLE_MODEL.columns, TABLE_BINDINGS).success,
    ).toBe(false);
    const definitions = tableDefinitions().filter((item) => item.kind !== 'tableRows');
    const wrong = success(
      createStateRegistry([
        ...definitions,
        { key: 'orders.rows', kind: 'text', initial: '', access: 'read' },
      ]),
    );
    expect(
      readTableModel(wrong.read, TABLE_MODEL.columns, TABLE_BINDINGS).success,
    ).toBe(false);
  });
});
