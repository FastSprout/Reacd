import { inspectJsonBudget } from '../../core/json-budget.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import type { ValidationIssue } from '../../core/render-port.js';
import type { Result } from '../../core/result.js';
import { generativeDocumentSchema, visitGenerativeNodes } from './document.schema.js';
import type { GenerativeDocument } from './document.schema.js';
import { nodeBindings } from './binding-contracts.js';
import { validateInitialTable } from '../data-table/validate-initial.js';

export function validateGenerativeDocument(input: unknown): Result<GenerativeDocument> {
  const budget = inspectJsonBudget(input);
  if (budget.length > 0) return { success: false, issues: budget };
  const parsed = generativeDocumentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: ['$', ...issue.path.map(String)].join('.'),
        message: issue.message,
      })),
    };
  }
  const definitions = new Map(
    parsed.data.state.map((definition) => [definition.key, definition] as const),
  );
  const issues: ValidationIssue[] = [];
  visitGenerativeNodes(parsed.data.root, (node, path) => {
    if (node.type === 'DataTable' ||
      (node.type === 'Table' && node.mode === 'interactive')) {
      const table = validateInitialTable(node.columns, node.bindings, definitions);
      if (!table.success)
        issues.push(
          ...table.issues.map((issue) => ({
            ...issue,
            path: `${path}.${issue.path}`,
          })),
        );
    }
    for (const contract of nodeBindings(node)) {
      const definition = definitions.get(contract.reference.state);
      const issuePath = `${path}.${contract.property}`;
      if (definition === undefined) {
        issues.push({ path: issuePath, message: 'State key is not registered.' });
      } else if (!contract.kinds.includes(definition.kind)) {
        issues.push({ path: issuePath, message: 'Incompatible state kind.' });
      } else if (contract.mode === 'readWrite' && definition.access !== 'readWrite') {
        issues.push({ path: issuePath, message: 'Component cannot write this state.' });
      } else if (!contract.schema.safeParse(definition.initial).success) {
        issues.push({
          path: issuePath,
          message: 'Initial value is invalid for this property.',
        });
      }
    }
  });
  return issues.length > 0
    ? { success: false, issues }
    : { success: true, data: parsed.data };
}

export function parseGenerativeJson(source: string): Result<GenerativeDocument> {
  if (source.length > DOCUMENT_POLICY.maxCharacters) {
    return {
      success: false,
      issues: [{ path: '$', message: 'Document character budget exceeded.' }],
    };
  }
  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch {
    return { success: false, issues: [{ path: '$', message: 'Invalid JSON syntax.' }] };
  }
  return validateGenerativeDocument(input);
}
