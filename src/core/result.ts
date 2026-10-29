import type { ValidationIssue } from './render-port.js';

export type Result<T> =
  { success: true; data: T } | { success: false; issues: ValidationIssue[] };
