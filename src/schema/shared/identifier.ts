import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';

export const identifierSchema = z
  .string()
  .min(1)
  .max(CONTENT_POLICY.maxIdentifierLength)
  .regex(/^[A-Za-z][A-Za-z0-9_-]*$/, 'Expected a semantic content identifier.');

export function validPageAnchor(value: {
  anchor?: string | undefined;
  title?: string | undefined;
}): boolean {
  return value.anchor === undefined || value.title !== undefined;
}
