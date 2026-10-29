import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isSafeContent(value: unknown, depth = 0): boolean {
  if (depth > DOCUMENT_POLICY.maxDepth) return false;
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  )
    return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (isArray(value)) {
    return value.every((child) => isSafeContent(child, depth + 1));
  }
  if (!isValidElement<Record<string, unknown>>(value) || typeof value.type === 'string')
    return false;
  return isSafeContent(value.props['children'], depth + 1);
}

export const childrenSchema = z
  .custom<ReactNode>(isSafeContent, FRAMEWORK_ERRORS.invalidChildren)
  .optional();
