import type { GenerativeDocument } from '../../schema/generative-v2/document.schema.js';
import { initializeStateRegistry } from '../registry/initialize-registry.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { ReacdStore } from '../store.js';

export function createDocumentState(
  document: GenerativeDocument,
  store?: ReacdStore,
): StateRegistry {
  return initializeStateRegistry(document.state, store);
}
