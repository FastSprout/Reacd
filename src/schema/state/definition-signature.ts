import type { StateDefinition } from './definitions.schema.js';

export function definitionSignature(definitions: readonly StateDefinition[]) {
  return JSON.stringify(
    definitions
      .map(({ key, kind, access }) => ({
        key,
        kind,
        access,
      }))
      .sort((first, second) =>
        first.key < second.key ? -1 : first.key > second.key ? 1 : 0,
      ),
  );
}
