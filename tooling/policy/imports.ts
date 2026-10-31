import type { VisitorObject } from 'oxc-parser';

export interface ImportReference {
  value: string | null;
  offset: number;
  typeOnly?: boolean;
  runtimeNames?: readonly string[];
}

export function importVisitor(
  visit: (reference: ImportReference) => void,
): VisitorObject {
  return {
    ImportDeclaration(node) {
      visit({
        value: node.source.value,
        offset: node.start,
        typeOnly: node.importKind === 'type',
        runtimeNames:
          node.specifiers.length === 0
            ? ['*']
            : node.specifiers.flatMap((specifier) => {
                if (specifier.type !== 'ImportSpecifier') return ['*'];
                if (specifier.importKind === 'type') return [];
                return [
                  specifier.imported.type === 'Identifier'
                    ? specifier.imported.name
                    : specifier.imported.value,
                ];
              }),
      });
    },
    ExportAllDeclaration(node) {
      visit({
        value: node.source.value,
        offset: node.start,
        typeOnly: node.exportKind === 'type',
      });
    },
    ExportNamedDeclaration(node) {
      if (node.source) {
        visit({
          value: node.source.value,
          offset: node.start,
          typeOnly: node.exportKind === 'type',
          runtimeNames: node.specifiers.flatMap((specifier) => {
            if (specifier.exportKind === 'type') return [];
            return [
              specifier.local.type === 'Identifier'
                ? specifier.local.name
                : specifier.local.value,
            ];
          }),
        });
      }
    },
    ImportExpression(node) {
      visit({
        value:
          node.source.type === 'Literal' && typeof node.source.value === 'string'
            ? node.source.value
            : null,
        offset: node.start,
      });
    },
    TSImportType(node) {
      visit({ value: node.source.value, offset: node.start, typeOnly: true });
    },
    TSImportEqualsDeclaration(node) {
      if (node.moduleReference.type === 'TSExternalModuleReference') {
        visit({
          value: node.moduleReference.expression.value,
          offset: node.start,
          typeOnly: node.importKind === 'type',
        });
      }
    },
    CallExpression(node) {
      if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
        return;
      }
      const argument = node.arguments[0];
      visit({
        value:
          argument?.type === 'Literal' && typeof argument.value === 'string'
            ? argument.value
            : null,
        offset: node.start,
      });
    },
  };
}
