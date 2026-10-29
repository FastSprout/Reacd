import type { Node } from '@tiptap/pm/model';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { stateKeySchema } from '../../../schema/state/shared/definition.js';
import { EDITOR_SDK_BLOCK_TYPES } from '../editor-sdk/block-types.js';
import { sdkAttribute } from './attribute.js';

const BLOCKS: ReadonlySet<string> = new Set(EDITOR_SDK_BLOCK_TYPES);
const identitySchema = stateKeySchema.nullish();

export function createSdkIdAllocator(document: Node): (node: Node) => string {
  const used = new Set<string>();
  document.descendants((node) => {
    if (!BLOCKS.has(node.type.name)) return;
    const id = identitySchema.parse(sdkAttribute(node, 'reacdId'));
    if (id != null) used.add(id);
  });
  let ordinal = 0;
  return (node) => {
    const current = identitySchema.parse(sdkAttribute(node, 'reacdId'));
    if (current != null) return current;
    let id: string;
    do {
      ordinal += 1;
      id = `${EDITOR_POLICY.blockIdPrefix}-${ordinal}`;
    } while (used.has(id));
    used.add(id);
    return id;
  };
}
