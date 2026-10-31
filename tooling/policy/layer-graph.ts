import { resolve } from 'node:path';
import { adapterRuntimeError } from './adapter-runtime.js';
import {
  checkArchitecture,
  checkFacade,
  NATIVE_UI_DEPENDENCY_ERROR,
} from './architecture.js';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import { importVisitor } from './imports.js';
import {
  isProductionModule,
  isPublicEntry,
  isTestModule,
  isVendorModule,
} from './layers.js';
import { internalPath, isCodeReference, resolveModule } from './module-path.js';
import { checkModuleCycles } from './module-cycles.js';
import type { ModuleNode } from './module-cycles.js';
import { inspectSource } from './parse.js';

interface LayerSource {
  readonly path: string;
  readonly source: string;
}

export function checkLayerGraph(
  sources: readonly LayerSource[],
  root: string,
): PolicyDiagnostic[] {
  const nodes = new Map<string, ModuleNode>();
  for (const { path, source } of sources) {
    const absolute = resolve(root, path);
    if (isProductionModule(absolute, root)) {
      nodes.set(absolute, { path: absolute, source, edges: [] });
    }
  }
  const issues: PolicyDiagnostic[] = [];
  for (const node of nodes.values()) {
    const facade = isPublicEntry(node.path, root);
    const local = facade
      ? checkFacade(node.path, node.source)
      : checkArchitecture(node.path, node.source, root);
    issues.push(...local);
    if (local.some((issue) => issue.rule === 'syntax')) continue;
    inspectSource(
      node.path,
      node.source,
      importVisitor(({ value, offset }) => {
        if (value === null || adapterRuntimeError(value) !== null) return;
        const target = internalPath(value, node.path, root);
        if (target === null || !isCodeReference(target)) return;
        if (isTestModule(target) || isVendorModule(target, root)) {
          if (facade) {
            issues.push(
              diagnostic(
                node.path,
                node.source,
                offset,
                'architecture',
                isTestModule(target)
                  ? 'Production code cannot depend on tests.'
                  : NATIVE_UI_DEPENDENCY_ERROR,
              ),
            );
          }
          return;
        }
        const dependency = resolveModule(target, nodes);
        if (dependency === undefined) {
          issues.push(
            diagnostic(
              node.path,
              node.source,
              offset,
              'architecture-resolution',
              `Cannot resolve owned module: ${value}.`,
            ),
          );
        } else node.edges.push({ target: dependency, offset });
      }),
    );
  }
  return [...issues, ...checkModuleCycles([...nodes.values()], root)];
}
