import type { GenerativeDeclaration, GenerativeDocument } from './document.schema.js';
import { validateGenerativeDocument } from './validate-document.js';

export function defineGenerativeDeclaration(
  declaration: GenerativeDeclaration,
): GenerativeDocument {
  const result = validateGenerativeDocument(declaration);
  if (!result.success) {
    throw new Error(
      result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n'),
    );
  }
  return result.data;
}
