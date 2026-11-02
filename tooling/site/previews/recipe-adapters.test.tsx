import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { muiAdapter } from '../../../src/adapter/mui/mui.adapter.js';
import { COMPONENT_NAMES } from '../../../src/components/component-names.js';
import { importVisitor } from '../../policy/imports.js';
import { inspectSource } from '../../policy/parse.js';
import { recipeRegistry } from './recipes.js';
import { RECIPE_NAMES } from './recipe-names.js';

function recipeDependencies(source: string) {
  const visited = new Set<string>();
  const dependencies = new Set<string>();
  const components = new Set<string>(COMPONENT_NAMES);
  function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);
    const issues = inspectSource(file, readFileSync(file, 'utf8'), importVisitor(
      ({ value, typeOnly, runtimeNames }) => {
        if (typeOnly || value === null) return;
        if (value === '@fastsprout/reacd') {
          for (const name of runtimeNames ?? []) {
            if (components.has(name)) dependencies.add(name);
          }
        } else if (value.startsWith('.')) {
          const base = resolve(dirname(file), value).replace(/\.js$/, '');
          visit(existsSync(`${base}.tsx`) ? `${base}.tsx` : `${base}.ts`);
        }
      },
    ));
    expect(issues).toEqual([]);
  }
  visit(resolve('docs', source));
  return [...dependencies];
}

it.each(RECIPE_NAMES)('supports every native dependency of %s', (name) => {
  const missing = recipeDependencies(recipeRegistry[name].source)
    .filter(component => !Object.hasOwn(muiAdapter.components, component)).sort();
  expect(missing).toEqual([]);
});

it.each(RECIPE_NAMES)('actually renders the complete %s recipe in Material UI',
  async (name) => {
    const report = vi.spyOn(console, 'error');
    try {
      const { default: View } = await recipeRegistry[name].load();
      const view = render(<ReacdProvider adapter={muiAdapter}><View /></ReacdProvider>);
      expect(view.container.querySelector('[data-adapter="material-ui"]'))
        .toBeVisible();
      expect(screen.queryByText(/Cannot render/)).toBeNull();
      expect(report).not.toHaveBeenCalled();
    } finally { report.mockRestore(); }
  });
