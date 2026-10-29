import type { Node } from '@tiptap/pm/model';
import type { Selection } from '@tiptap/pm/state';
import type { EditorPosition, EditorSelection } from '../../../core/editor-document.js';
import type { Result } from '../../../core/result.js';
import { editorPositionSchema } from '../../../schema/editor/document/index.js';
import { stateKeySchema } from '../../../schema/state/shared/definition.js';
import { boundedSdkDocument } from '../editor-conversion/budget.js';

interface EditableBlock {
  readonly id: string;
  readonly start: number;
  readonly end: number;
}
type EditableBlocks = readonly [EditableBlock, ...EditableBlock[]];
const EDITABLE_TYPES = new Set(['paragraph', 'heading', 'codeBlock']);
const POSITION_POLICY = {
  openingTokenSize: 1,
  path: 'Editor.selection',
  invalid:
    'Editor selection must resolve to editable blocks and valid logical offsets.',
} as const;

function editableBlocks(document: Node): EditableBlocks | undefined {
  if (!boundedSdkDocument(document)) return undefined;
  try {
    const blocks: EditableBlock[] = [];
    const ids = new Set<string>();
    let duplicate = false;
    document.descendants((node, position) => {
      if (!EDITABLE_TYPES.has(node.type.name)) return true;
      const raw: unknown = node.attrs['reacdId'];
      const id = stateKeySchema.safeParse(raw);
      if (!id.success) return false;
      if (ids.has(id.data)) {
        duplicate = true;
        return false;
      }
      ids.add(id.data);
      const start = position + POSITION_POLICY.openingTokenSize;
      blocks.push({ id: id.data, start, end: start + node.content.size });
      return false;
    });
    if (duplicate) return undefined;
    const first = blocks.shift();
    return first === undefined ? undefined : [first, ...blocks];
  } catch {
    return undefined;
  }
}

function nearest(blocks: EditableBlocks, point: number): EditorPosition {
  let chosen = blocks[0];
  let offset = 0;
  let distance = Infinity;
  for (const block of blocks) {
    const snapped = Math.min(block.end, Math.max(block.start, point));
    const currentDistance = Math.abs(point - snapped);
    if (currentDistance < distance) {
      chosen = block;
      offset = snapped - block.start;
      distance = currentDistance;
    }
  }
  return Object.freeze({ blockId: chosen.id, offset });
}

function nativePoint(document: Node, value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= document.content.size;
}

export function sdkSelectionToDomain(
  document: Node,
  selection: Pick<Selection, 'anchor' | 'head'>,
): EditorSelection | undefined {
  const blocks = editableBlocks(document);
  if (
    blocks === undefined ||
    !nativePoint(document, selection.anchor) ||
    !nativePoint(document, selection.head)
  )
    return undefined;
  return Object.freeze({
    anchor: nearest(blocks, selection.anchor),
    focus: nearest(blocks, selection.head),
  });
}

function resolve(blocks: EditableBlocks, point: EditorPosition): number | undefined {
  const parsed = editorPositionSchema.safeParse(point);
  if (!parsed.success) return undefined;
  const block = blocks.find((candidate) => candidate.id === parsed.data.blockId);
  if (block === undefined || parsed.data.offset > block.end - block.start)
    return undefined;
  return block.start + parsed.data.offset;
}

export function domainSelectionToSdk(
  document: Node,
  selection: EditorSelection,
): Result<{ readonly anchor: number; readonly head: number }> {
  const blocks = editableBlocks(document);
  if (blocks !== undefined) {
    const anchor = resolve(blocks, selection.anchor);
    const head = resolve(blocks, selection.focus);
    if (anchor !== undefined && head !== undefined)
      return { success: true, data: Object.freeze({ anchor, head }) };
  }
  return {
    success: false,
    issues: [{ path: POSITION_POLICY.path, message: POSITION_POLICY.invalid }],
  };
}
