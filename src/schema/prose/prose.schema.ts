import { z } from 'zod';
import type { ProseDocument } from '../../core/prose.js';
import { PROSE_POLICY } from '../../core/prose-policy.js';
import { boundedProse } from './budget.js';
import { proseBlocksSchema } from './block.schema.js';

function uniqueHeadings(document: ProseDocument): boolean {
  const pending = [...document];
  const ids = new Set<string>();
  for (const block of pending) {
    if (block.type === 'heading') {
      if (ids.has(block.id)) return false;
      ids.add(block.id);
    } else if (block.type === 'quote') pending.push(...block.children);
    else if (block.type === 'list') {
      for (const item of block.items) pending.push(...item.children);
    }
  }
  return true;
}
export const proseDocumentSchema = z
  .unknown()
  .refine(boundedProse, {
    message: PROSE_POLICY.budgetMessage,
    abort: true,
  })
  .pipe(proseBlocksSchema)
  .refine(uniqueHeadings, PROSE_POLICY.headingMessage);
export const proseSchema = z.strictObject({ document: proseDocumentSchema });
