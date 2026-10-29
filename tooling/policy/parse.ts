import { parseSync, Visitor } from 'oxc-parser';
import type { VisitorObject } from 'oxc-parser';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';

export function inspectSource(
  file: string,
  source: string,
  visitor: VisitorObject,
): PolicyDiagnostic[] {
  const parsed = parseSync(file, source);
  const errors = parsed.errors.map((error) =>
    diagnostic(file, source, 0, 'syntax', error.message),
  );
  if (errors.length === 0) new Visitor(visitor).visit(parsed.program);
  return errors;
}
