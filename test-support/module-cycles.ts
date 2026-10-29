export function findModuleCycle(
  graph: ReadonlyMap<string, readonly string[]>,
): readonly string[] | undefined {
  const finished = new Set<string>();
  const active = new Set<string>();
  const path: string[] = [];
  function visit(name: string): readonly string[] | undefined {
    if (active.has(name)) return [...path.slice(path.indexOf(name)), name];
    if (finished.has(name)) return undefined;
    active.add(name);
    path.push(name);
    for (const dependency of graph.get(name) ?? []) {
      const cycle = visit(dependency);
      if (cycle !== undefined) return cycle;
    }
    path.pop();
    active.delete(name);
    finished.add(name);
    return undefined;
  }
  for (const name of graph.keys()) {
    const cycle = visit(name);
    if (cycle !== undefined) return cycle;
  }
  return undefined;
}
