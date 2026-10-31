import type { Node } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import type { Selection } from '@tiptap/pm/state';
import { stateKeySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/shared/definition.js';

export function selectedSdkBlockId(selection: Selection): string | undefined {
  if (!(selection instanceof NodeSelection)) return undefined;
  const parsed = stateKeySchema.safeParse(selection.node.attrs['reacdId']);
  return parsed.success ? parsed.data : undefined;
}
export function sdkBlockPosition(document: Node, id: string): number | undefined {
  let found: number | undefined;
  document.descendants((node, position) => {
    if (found !== undefined) return false;
    if (node.attrs['reacdId'] === id) {
      found = position;
      return false;
    }
    return true;
  });
  return found;
}
