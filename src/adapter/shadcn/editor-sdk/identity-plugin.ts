import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Transaction } from '@tiptap/pm/state';
import type { Node } from '@tiptap/pm/model';
import { Transform } from '@tiptap/pm/transform';
import { z } from 'zod';
import { EDITOR_POLICY } from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { boundedSdkDocument } from '../editor-conversion/budget.js';
import { EDITOR_SDK_BLOCK_TYPES } from './block-types.js';

interface MarkupChange {
  readonly position: number;
  readonly attributes: Readonly<Record<string, unknown>>;
}
interface RepairPlan {
  readonly changes: readonly MarkupChange[];
  readonly counter: bigint;
}
interface IdentityState {
  readonly counter: bigint;
  readonly pending: RepairPlan | null;
}
export interface EditorIdentityOptions {
  readonly onRejected?: (() => void) | undefined;
}

const BLOCKS: ReadonlySet<string> = new Set(EDITOR_SDK_BLOCK_TYPES);
const attributesSchema = z.record(z.string(), z.unknown());

function prepareRepair(document: Node, initial: bigint): RepairPlan | null {
  if (!boundedSdkDocument(document)) return null;
  const entries: {
    position: number;
    attributes: Record<string, unknown>;
    id: string | undefined;
  }[] = [];
  let malformed = false;
  const reserved = new Set<string>();
  document.descendants((node, position) => {
    if (malformed) return false;
    if (!BLOCKS.has(node.type.name)) return true;
    const raw: unknown = node.attrs;
    const parsed = attributesSchema.safeParse(raw);
    if (!parsed.success) {
      malformed = true;
      return false;
    }
    const candidate = parsed.data['reacdId'];
    const id = typeof candidate === 'string' ? candidate : undefined;
    if (id !== undefined) reserved.add(id);
    entries.push({ position, attributes: parsed.data, id });
    return true;
  });
  if (malformed) return null;
  let counter = initial;
  const seen = new Set<string>();
  const changes: MarkupChange[] = [];
  for (const entry of entries) {
    if (entry.id !== undefined && !seen.has(entry.id)) {
      seen.add(entry.id);
      continue;
    }
    let id: string;
    do {
      counter += 1n;
      id = `${EDITOR_POLICY.blockIdPrefix}-${counter}`;
    } while (reserved.has(id));
    reserved.add(id);
    seen.add(id);
    changes.push({
      position: entry.position,
      attributes: Object.freeze({ ...entry.attributes, reacdId: id }),
    });
  }
  if (changes.length > 0) {
    const preview = new Transform(document);
    for (const change of changes)
      preview.setNodeMarkup(change.position, undefined, change.attributes);
    if (!boundedSdkDocument(preview.doc)) return null;
  }
  return Object.freeze({ counter, changes: Object.freeze(changes) });
}

function advanceCounter(
  transaction: Transaction,
  current: bigint,
  key: PluginKey<IdentityState>,
): bigint {
  const value: unknown = transaction.getMeta(key);
  return typeof value === 'bigint' && value >= current ? value : current;
}

export function createEditorIdentityPlugin({
  onRejected,
}: EditorIdentityOptions = {}): Plugin<IdentityState> {
  const key = new PluginKey<IdentityState>('reacdIdentity');
  return new Plugin<IdentityState>({
    key,
    state: {
      init: () => Object.freeze({ counter: 0n, pending: null }),
      apply(transaction, previous) {
        const counter = advanceCounter(transaction, previous.counter, key);
        return Object.freeze({
          counter,
          pending: transaction.docChanged
            ? prepareRepair(transaction.doc, counter)
            : previous.pending,
        });
      },
    },
    filterTransaction(transaction, state) {
      if (!transaction.docChanged) return true;
      const current = key.getState(state);
      if (
        current === undefined ||
        prepareRepair(
          transaction.doc,
          advanceCounter(transaction, current.counter, key),
        ) === null
      ) {
        onRejected?.();
        return false;
      }
      return true;
    },
    appendTransaction(transactions, _previous, state) {
      if (!transactions.some((transaction) => transaction.docChanged)) return null;
      const pending = key.getState(state)?.pending;
      if (pending == null || pending.changes.length === 0) return null;
      const transaction = state.tr;
      for (const change of pending.changes)
        transaction.setNodeMarkup(change.position, undefined, change.attributes);
      return transaction.setMeta('addToHistory', false).setMeta(key, pending.counter);
    },
  });
}
