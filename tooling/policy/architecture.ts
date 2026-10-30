import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import { importVisitor } from './imports.js';
import { inspectSource } from './parse.js';
import { LAYERS, layerOf, isTestModule, isVendorModule } from './layers.js';
import { internalPath } from './module-path.js';
import { isTrustedUiDependency } from './ui-dependencies.js';

export { LAYERS } from './layers.js';

export const NATIVE_UI_DEPENDENCY_ERROR =
  'Native UI and styling dependencies belong to renderer or adapter.';

export function checkArchitecture(
  file: string,
  source: string,
  root: string,
): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const layer = layerOf(file, root);
  const add = (offset: number, message: string) => {
    issues.push(diagnostic(file, source, offset, 'architecture', message));
  };
  if (layer < 0) {
    add(0, 'Owned implementation must belong to a declared layer.');
    return issues;
  }
  const name = LAYERS[layer];
  const nativeUi = name === 'renderer' || name === 'adapter';
  const visitor = importVisitor(({ value, offset }) => {
    if (value === null) {
      add(offset, 'Computed imports cannot be verified. Use a literal path.');
      return;
    }
    if (!nativeUi && isTrustedUiDependency(value)) {
      add(offset, NATIVE_UI_DEPENDENCY_ERROR);
      return;
    }
    const target = internalPath(value, file, root);
    if (target === null) return;
    if (isTestModule(target)) {
      add(offset, 'Production code cannot depend on tests.');
      return;
    }
    if (isVendorModule(target, root) && !nativeUi) {
      add(offset, NATIVE_UI_DEPENDENCY_ERROR);
      return;
    }
    const dependency = layerOf(target, root);
    if (dependency < 0) {
      add(offset, `Import bypasses a declared layer: ${value}.`);
    } else if (dependency > layer) {
      add(offset, `Dependency points right: ${value}.`);
    }
  });
  const syntax = inspectSource(file, source, visitor);
  return [...issues, ...syntax];
}

export function checkFacade(file: string, source: string): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const references = importVisitor(({ value, offset }) => {
    if (value !== null && isTrustedUiDependency(value)) {
      issues.push(
        diagnostic(file, source, offset, 'architecture', NATIVE_UI_DEPENDENCY_ERROR),
      );
    }
  });
  const syntax = inspectSource(file, source, {
    ...references,
    Program(program) {
      for (const statement of program.body) {
        if (
          statement.type === 'ExpressionStatement' &&
          statement.expression.type === 'Literal' &&
          statement.expression.value === 'use client'
        )
          continue;
        if (
          (statement.type === 'ExportNamedDeclaration' && statement.source) ||
          statement.type === 'ExportAllDeclaration'
        )
          continue;
        issues.push(
          diagnostic(
            file,
            source,
            statement.start,
            'facade',
            'Public entry files may only re-export declared modules.',
          ),
        );
      }
    },
  });
  return [...issues, ...syntax];
}
