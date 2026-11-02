import { expect, it } from 'vitest';
import { inspectRepository } from './repository.js';
import { checkLayerGraph } from './layer-graph.js';

const root = '/workspace';
const file = `${root}/src/adapter/mui/styles.css`;
const inspect = (source: string) => inspectRepository([{ path: file, source }], root);

it.each([
  "@import '../../renderer/styles.css';",
  '@import "../../renderer/styles/controls.css";',
  '@import url(../../renderer/styles/input.css);',
  '@import url("../../renderer/styles.css") layer(controls);',
  "@IMPORT URL( '../../renderer/styles/toggle.css' ) screen;",
  "@import/**/'../../renderer/styles.css';",
  "@import '@/renderer/styles/choice.css';",
  "@import '@fastsprout/reacd/renderer/styles.css';",
  "@import '/workspace/src/renderer/styles/input.css?inline';",
  "@import '../../renderer/styles/../styles.css';",
  String.raw`@import '../../renderer/\73 tyles.css';`,
  String.raw`@\69mport '../../renderer/styles.css';`,
  String.raw`@import \75 rl("../../renderer/styles.css");`,
  "@import '../shared/controls.css';",
  "@import '../shadcn/styles.css';",
])('rejects shared control CSS dependencies in adapter styles: %s', (source) => {
  expect(inspect(source)).toContainEqual(
    expect.objectContaining({ rule: 'architecture' }),
  );
});

it.each([
  "@import 'tailwindcss';",
  "@import './tokens.css';",
  "@import '../../renderer/theme/tokens.css';",
  "@import url('https://sdk.example/theme.css');",
  "@source './vendor';",
  ':root { --primary: red; }',
  "/* @import '../../renderer/styles.css'; */",
  String.raw`.label::after { content: '@import "../../renderer/styles.css"'; }`,
  ".label::after { content: '@import ../../renderer/styles.css'; }",
  String.raw`@import './\74 okens.css';`,
  String.raw`@import './tokens\.css';`,
  String.raw`@import './\0.css';`,
  String.raw`@import './\110000.css';`,
  String.raw`@import './\d800.css';`,
  String.raw`@import './\dfff.css';`,
  String.raw`@import './\e000.css';`,
])('preserves native SDK styles and theme token configuration: %s', (source) => {
  expect(inspect(source)).toEqual([]);
});

it('enforces CSS dependencies in the existing layer graph', () => {
  expect(
    checkLayerGraph(
      [{ path: file, source: "@import '../../renderer/styles.css';" }],
      root,
    ),
  ).toContainEqual(expect.objectContaining({ rule: 'architecture' }));
});

it('rejects a retained Shared UI stylesheet without dependencies', () => {
  expect(
    inspectRepository(
      [{ path: `${root}/src/adapter/shared/styles.css`, source: ':root {}' }],
      root,
    ),
  ).toContainEqual(expect.objectContaining({ rule: 'architecture' }));
});

it('reports the location of each forbidden CSS import', () => {
  expect(inspect("\n  @import '../../renderer/styles.css';")).toContainEqual(
    expect.objectContaining({ file, line: 2, column: 3, rule: 'architecture' }),
  );
});

it('does not crash when a CSS import has no destination', () => {
  expect(inspect('@import;')).toEqual([]);
});
