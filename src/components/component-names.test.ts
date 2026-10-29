import { globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { expect, it } from 'vitest';
import { importVisitor } from '../../tooling/policy/imports.js';
import { inspectSource } from '../../tooling/policy/parse.js';
import { findModuleCycle } from '../../test-support/module-cycles.js';

it('rejects module cycles including type-only imports and facade re-exports', () => {
  const files = globSync('src/**/*.{ts,tsx}')
    .filter((name) => !/(?:__tests__|test-support)\/|\.(?:test|spec)\./.test(name))
    .map((name) => resolve(name));
  const known = new Set(files);
  const graph = new Map<string, string[]>();
  for (const file of files) {
    const edges: string[] = [];
    inspectSource(
      file,
      readFileSync(file, 'utf8'),
      importVisitor(({ value }) => {
        if (value === null || !value.startsWith('.')) return;
        const stem = resolve(dirname(file), value).replace(/\.js$/, '');
        const target = [`${stem}.ts`, `${stem}.tsx`, stem].find((candidate) =>
          known.has(candidate),
        );
        if (target !== undefined) edges.push(target);
      }),
    );
    graph.set(file, edges);
  }
  expect(findModuleCycle(graph)).toBeUndefined();
});

it('distinguishes cyclic graphs from shared acyclic dependencies', () => {
  expect(
    findModuleCycle(
      new Map([
        ['a', ['b', 'c']],
        ['b', ['d']],
        ['c', ['d']],
        ['d', []],
      ]),
    ),
  ).toBeUndefined();
  expect(findModuleCycle(new Map([['a', ['a']]]))).toEqual(['a', 'a']);
  expect(
    findModuleCycle(
      new Map([
        ['a', ['b']],
        ['b', ['a']],
      ]),
    ),
  ).toEqual(['a', 'b', 'a']);
});
