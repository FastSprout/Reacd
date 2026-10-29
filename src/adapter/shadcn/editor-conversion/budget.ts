import type { Node } from '@tiptap/pm/model';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { EDITOR_SDK_BLOCK_TYPES } from '../editor-sdk/block-types.js';
import { sdkProjectionWeight } from './projection-weight.js';

interface Position {
  node: Node;
  depth: number;
  inCode: boolean;
  leaving: boolean;
}
const BLOCKS: ReadonlySet<string> = new Set(EDITOR_SDK_BLOCK_TYPES);
const INLINE_CONTAINERS = new Set(['paragraph', 'heading', 'codeBlock']);

export function boundedSdkDocument(document: Node): boolean {
  if (document.type.name !== 'doc') return false;
  const pending: Position[] = [];
  const ancestry = new WeakSet<Node>();
  let values = 0;
  let characters = 0;
  let blocks = 0;
  let positions = 0;
  function reserve(node: Node, depth: number, inCode: boolean): boolean {
    if (
      ancestry.has(node) ||
      depth > EDITOR_POLICY.maxDepth ||
      positions >= EDITOR_POLICY.maxValues
    )
      return false;
    const limit = INLINE_CONTAINERS.has(node.type.name)
      ? EDITOR_POLICY.maxInlines
      : EDITOR_POLICY.maxChildren;
    if (
      node.childCount > limit ||
      node.marks.length > EDITOR_POLICY.maxMarks + EDITOR_POLICY.maxLinksPerText
    )
      return false;
    const weight = sdkProjectionWeight(node, inCode);
    values += weight.values;
    characters += weight.characters;
    blocks += BLOCKS.has(node.type.name) ? 1 : 0;
    positions += 1;
    if (
      depth + weight.extraDepth > EDITOR_POLICY.maxDepth ||
      values > EDITOR_POLICY.maxValues ||
      positions > EDITOR_POLICY.maxValues ||
      characters > EDITOR_POLICY.maxCharacters ||
      blocks > EDITOR_POLICY.maxBlocks
    )
      return false;
    pending.push({ node, depth, inCode, leaving: false });
    return true;
  }
  try {
    if (!reserve(document, 0, false)) return false;
    for (
      let position = pending.pop();
      position !== undefined;
      position = pending.pop()
    ) {
      const { node, depth } = position;
      if (position.leaving) {
        ancestry.delete(node);
        continue;
      }
      ancestry.add(node);
      pending.push({ ...position, leaving: true });
      const inCode = node.type.name === 'codeBlock';
      for (let index = node.childCount - 1; index >= 0; index -= 1)
        if (!reserve(node.child(index), depth + (inCode ? 1 : 2), inCode)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
