import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import { importVisitor } from './imports.js';
import { isSharedAdapterPath, SHARED_UI_ERROR } from './native-adapter.js';
import { inspectSource } from './parse.js';

export function checkNativeUiSource(
  file: string,
  source: string,
  root: string,
): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const add = (offset: number) => {
    issues.push(diagnostic(file, source, offset, 'architecture', SHARED_UI_ERROR));
  };
  const check = (name: string, offset: number) => {
    if (name === 'bindPrimitives' || /^Shared[A-Z]/.test(name)) add(offset);
  };
  if (isSharedAdapterPath(file, root)) add(0);
  const imports = importVisitor(({ typeOnly, runtimeNames, offset }) => {
    if (!typeOnly && runtimeNames) {
      for (const name of runtimeNames) check(name, offset);
    }
  });
  inspectSource(file, source, {
    ...imports,
    ImportDeclaration(node) {
      imports.ImportDeclaration(node);
      if (node.importKind === 'type') return;
      for (const specifier of node.specifiers) {
        if (specifier.type !== 'ImportSpecifier' || specifier.importKind !== 'type') {
          check(specifier.local.name, specifier.start);
        }
      }
    },
    ExportNamedDeclaration(node) {
      imports.ExportNamedDeclaration(node);
      if (node.exportKind === 'type') return;
      for (const specifier of node.specifiers) {
        if (specifier.exportKind !== 'type') {
          check(
            specifier.exported.type === 'Identifier'
              ? specifier.exported.name
              : specifier.exported.value,
            specifier.start,
          );
        }
      }
    },
    ExportAllDeclaration(node) {
      imports.ExportAllDeclaration(node);
      if (node.exportKind !== 'type' && node.exported) {
        check(
          node.exported.type === 'Identifier'
            ? node.exported.name
            : node.exported.value,
          node.start,
        );
      }
    },
    FunctionDeclaration(node) {
      if (node.id) check(node.id.name, node.start);
    },
    ClassDeclaration(node) {
      if (node.id) check(node.id.name, node.start);
    },
    VariableDeclarator(node) {
      if (node.id.type === 'Identifier') check(node.id.name, node.start);
    },
    JSXOpeningElement(node) {
      const name = node.name;
      check(
        name.type === 'JSXIdentifier'
          ? name.name
          : name.type === 'JSXMemberExpression'
            ? name.property.name
            : name.name.name,
        node.start,
      );
    },
    CallExpression(node) {
      imports.CallExpression(node);
      const callee = node.callee;
      if (callee.type === 'Identifier') check(callee.name, node.start);
      else if (callee.type === 'MemberExpression') {
        const property = callee.property;
        if (!callee.computed && property.type === 'Identifier') {
          check(property.name, node.start);
        } else if (property.type === 'Literal' && typeof property.value === 'string') {
          check(property.value, node.start);
        }
      }
    },
  });
  return issues;
}
