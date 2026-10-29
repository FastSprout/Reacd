import type { VisitorObject } from 'oxc-parser';

export interface ImportReference {
  value: string | null;
  offset: number;
}

export function importVisitor(
  visit: (reference: ImportReference) => void,
): VisitorObject {
  return {
    ImportDeclaration(node) {
      visit({ value: node.source.value, offset: node.start });
    },
    ExportAllDeclaration(node) {
      visit({ value: node.source.value, offset: node.start });
    },
    ExportNamedDeclaration(node) {
      if (node.source) {
        visit({ value: node.source.value, offset: node.start });
      }
    },
    ImportExpression(node) {
      visit({
        value: node.source.type === 'Literal' ? String(node.source.value) : null,
        offset: node.start,
      });
    },
    TSImportType(node) {
      visit({ value: node.source.value, offset: node.start });
    },
    CallExpression(node) {
      if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
        return;
      }
      const argument = node.arguments[0];
      visit({
        value: argument?.type === 'Literal' ? String(argument.value) : null,
        offset: node.start,
      });
    },
  };
}
