import { relative } from 'node:path';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';

export interface ModuleEdge {
  readonly target: ModuleNode;
  readonly offset: number;
}

export interface ModuleNode {
  readonly path: string;
  readonly source: string;
  readonly edges: ModuleEdge[];
}

export function checkModuleCycles(
  nodes: readonly ModuleNode[],
  root: string,
): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const finished = new Set<ModuleNode>();
  const active: ModuleNode[] = [];
  function visit(node: ModuleNode): void {
    active.push(node);
    for (const edge of node.edges) {
      const start = active.indexOf(edge.target);
      if (start >= 0) {
        const chain = [...active.slice(start), edge.target]
          .map((member) => relative(root, member.path))
          .join(' -> ');
        issues.push(
          diagnostic(
            node.path,
            node.source,
            edge.offset,
            'architecture-cycle',
            `Dependency cycle: ${chain}.`,
          ),
        );
      } else if (!finished.has(edge.target)) visit(edge.target);
    }
    active.pop();
    finished.add(node);
  }
  for (const node of nodes) {
    if (!finished.has(node)) visit(node);
  }
  return issues;
}
