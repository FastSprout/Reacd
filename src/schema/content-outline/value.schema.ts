import { z } from 'zod';
import type { ContentOutlineItem } from '../../core/content-outline.js';
import { contentOutlineItems } from '../../core/content-outline.js';
import { TREE_POLICY } from '../../core/tree-policy.js';
import { identifierSchema } from '../shared/identifier.js';

export const contentExpandedKeysSchema = z
  .array(identifierSchema)
  .max(TREE_POLICY.maxNodes)
  .readonly()
  .refine(
    (keys) => new Set(keys).size === keys.length,
    'Expanded keys must be unique.',
  );

export function contentCurrentSchema(items: readonly ContentOutlineItem[]) {
  const keys = new Set(contentOutlineItems(items).map((item) => item.key));
  return z
    .string()
    .refine(
      (key) => key === '' || keys.has(key),
      'Current key must identify a declared document.',
    );
}

export function contentExpansionSchema(items: readonly ContentOutlineItem[]) {
  const branches = new Set(
    contentOutlineItems(items)
      .filter((item) => item.children !== undefined)
      .map((item) => item.key),
  );
  return contentExpandedKeysSchema.refine(
    (keys) => keys.every((key) => branches.has(key)),
    'Only declared branches may be expanded.',
  );
}

export const contentCurrentChangeSchema = z.custom<(key: string) => boolean | void>(
  (value) => typeof value === 'function',
  'Current callback must be a function.',
);
