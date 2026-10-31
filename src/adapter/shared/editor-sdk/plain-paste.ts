import type { JSONContent } from '@tiptap/core';
import {
  EDITOR_ERRORS,
  EDITOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import type { Result } from '@fastsprout/reacd/adapter-runtime/core/result.js';
import { editorTextChunks } from '../editor-conversion/text-chunks.js';

type PastePart =
  { type: 'hardBreak' } | { type: 'text'; source: string; from: number; to: number };
const PASTE_COST = {
  arrayValues: 1,
  textValues: 3,
  textCharacters: 'typetexttext'.length,
  breakCharacters: 'typehardBreak'.length,
} as const;
const MAX_PARTS = Math.min(
  EDITOR_POLICY.maxInlines,
  Math.floor(
    (EDITOR_POLICY.maxValues - PASTE_COST.arrayValues) / PASTE_COST.textValues,
  ),
);

function failure(): Result<never> {
  return {
    success: false,
    issues: [{ path: 'Editor.value', message: EDITOR_ERRORS.rejected }],
  };
}

function inlinePlan(text: string): readonly PastePart[] | undefined {
  let breaks = 0;
  for (const character of text) {
    if (character === '\n') breaks += 1;
    if (breaks > MAX_PARTS) return undefined;
  }
  const plan: PastePart[] = [];
  let characters = 0;
  function reserve(part: PastePart): boolean {
    const cost =
      part.type === 'text'
        ? PASTE_COST.textCharacters + part.to - part.from
        : PASTE_COST.breakCharacters;
    if (plan.length >= MAX_PARTS || characters + cost > EDITOR_POLICY.maxCharacters)
      return false;
    characters += cost;
    plan.push(part);
    return true;
  }
  let first = true;
  for (const line of text.split('\n')) {
    if (!first && !reserve({ type: 'hardBreak' })) return undefined;
    first = false;
    for (const chunk of editorTextChunks(line))
      if (!reserve({ type: 'text', source: line, ...chunk })) return undefined;
  }
  return plan;
}

export function buildEditorPlainPaste(
  text: string,
  mode: 'inline' | 'code' = 'inline',
): Result<JSONContent[]> {
  if (text.length > EDITOR_POLICY.maxCharacters) return failure();
  const normalized = text.replace(/\r\n?/g, '\n');
  if (normalized.length === 0) return { success: true, data: [] };
  if (mode === 'code')
    return normalized.length > EDITOR_POLICY.maxTextLength
      ? failure()
      : { success: true, data: [{ type: 'text', text: normalized }] };
  const plan = inlinePlan(normalized);
  if (plan === undefined) return failure();
  return {
    success: true,
    data: plan.map((part) =>
      part.type === 'hardBreak'
        ? { type: 'hardBreak' }
        : { type: 'text', text: part.source.slice(part.from, part.to) },
    ),
  };
}
