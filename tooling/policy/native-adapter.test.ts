import { expect, it } from 'vitest';
import { checkArchitecture, checkFacade } from './architecture.js';
import { checkLayerGraph } from './layer-graph.js';
import { inspectRepository } from './repository.js';

const root = '/workspace';
const file = `${root}/src/adapter/mui/button.tsx`;
const inspect = (source: string) => checkArchitecture(file, source, root);

it.each([
  "import { SharedButton as Button } from '../shared/button.js';",
  "import '../shared/button.js';",
  "export * from '../shared/button.js';",
  "export type { Props } from '../shared/button.js';",
  "const Button = import('../shared/button.js');",
  "const Button = require('../shared/button.js');",
  "import Button = require('../shared/button.js');",
  "type Props = import('../shared/button.js').Props;",
  "import '@/adapter/shared/button.js';",
  "import '@fastsprout/reacd/adapter/shared/button.js';",
  "import '/workspace/src/adapter/shared/button.js';",
])('rejects retired shared UI dependencies: %s', (source) => {
  expect(inspect(source)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it.each([
  "import { SharedButton as Button } from '../../renderer/legacy.js';",
  "import { bindPrimitives as bind } from './legacy.js';",
  "export { SharedButton } from './legacy.js';",
  "export * as SharedButton from './legacy.js';",
  'const Button = () => <SharedButton />;',
  'const Button = () => <UI.SharedButton />;',
  'const Button = () => <UI.bindPrimitives />;',
  'const Button = () => <legacy:SharedButton />;',
  'const Button = SharedButton(props);',
  'const Button = legacy.SharedButton(props);',
  'const Button = legacy.bindPrimitives(props);',
  "const Button = legacy['bindPrimitives'](props);",
  "export { Button as 'SharedButton' } from './legacy.js';",
  "export * as 'SharedButton' from './legacy.js';",
  'function SharedButton() { return null; }',
  'class SharedButton {}',
  'const SharedButton = () => null;',
  'function bindPrimitives() {}',
  'const bindPrimitives = () => null;',
])('rejects reintroduced shared UI wrappers: %s', (source) => {
  expect(inspect(source)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it('rejects an orphaned production file in the retired Shared tree', () => {
  expect(
    checkLayerGraph(
      [{ path: `${root}/src/adapter/shared/button.tsx`, source: 'export {};' }],
      root,
    ),
  ).toContainEqual(expect.objectContaining({ rule: 'architecture' }));
});

it.each([
  "import '../../renderer/styles.css';",
  "export * from '../../renderer/styles/controls.css';",
  "const css = import('@/renderer/styles/input.css');",
  "const css = require('../../renderer/styles.css?inline');",
  "import '@fastsprout/reacd/renderer/styles/toggle.css#raw';",
  "import '/workspace/src/renderer/styles/choice.css';",
])('rejects common renderer control CSS imports: %s', (source) => {
  expect(inspect(source)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it.each([
  "export * from './adapter/shared/button.js';",
  "export { SharedButton as Button } from './renderer/legacy.js';",
  "export { bindPrimitives } from './renderer/legacy.js';",
  "export * from './renderer/styles.css';",
])('rejects shared UI facade escape hatches: %s', (source) => {
  expect(checkFacade(`${root}/src/index.ts`, source)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it('enforces native boundaries through the layer graph and repository policy', () => {
  const sources = [{ path: file, source: "import '../shared/button.js';" }];
  expect(checkLayerGraph(sources, root)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
  expect(inspectRepository(sources, root)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it.each([
  "import { Box, Stack } from '@mui/material';",
  "import { NumberField } from '@base-ui/react/number-field';",
  "import { createTheme } from '@mui/material/styles';",
  "import { Button } from './button/button.adapter.js';",
  "import type { SharedProps } from '../../renderer/contracts/menu.js';",
  "export type { SharedProps } from '../../renderer/contracts/menu.js';",
  "import { type SharedProps, value } from '../../renderer/contracts/menu.js';",
  "export { type SharedProps } from '../../renderer/contracts/menu.js';",
  'type Contract = { SharedMetadata: string; bindPrimitives: boolean };',
  "const message = 'SharedButton bindPrimitives';",
  'const Button = () => <Button />;',
  'function Button() { return null; }',
  'class Button {}',
  'const value = getValue();',
  'const { value } = getValue();',
  'export default function () {}',
  'export default class {}',
  'factory()();',
  'legacy[0]();',
  'legacy[name]();',
  "import './styles.css';",
  "import '../../renderer/theme/tokens.css';",
])('preserves SDK composition and non-UI contracts: %s', (source) => {
  expect(inspect(source)).toEqual([]);
});

it('preserves shared metadata outside adapter UI and public type facades', () => {
  expect(
    checkArchitecture(
      `${root}/src/core/shared-contract.ts`,
      'export interface SharedMetadata { readonly label: string; }',
      root,
    ),
  ).toEqual([]);
  expect(
    checkFacade(
      `${root}/src/index.ts`,
      "export type { SharedProps } from './renderer/contracts/menu.js';",
    ),
  ).toEqual([]);
});
