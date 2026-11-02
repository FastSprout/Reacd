import { expect, it } from 'vitest';
import { nativeSdkChunkGroups } from './native-sdk-groups.js';

function owner(path: string) {
  return nativeSdkChunkGroups.filter(group => group.test.test(path))
    .sort((left, right) => right.priority - left.priority)[0]?.name;
}

it.each([
  ['/repo/src/adapter/mui/mui.adapter.ts', 'mui'],
  ['C:\\repo\\src\\adapter\\shadcn\\shadcn.adapter.ts', 'shadcn'],
  ['/repo/node_modules/@mui/material/Button/Button.mjs', 'material-ui'],
  ['/repo/node_modules/@mui/system/Stack/createStack.mjs', 'material-ui'],
  ['C:\\repo\\node_modules\\@mui\\utils\\esm\\index.mjs', 'material-ui'],
  ['/repo/node_modules/@emotion/react/dist/index.js', 'material-ui'],
  ['/repo/node_modules/@emotion/styled/dist/index.js', 'material-ui'],
  ['/repo/node_modules/@mui/x-charts/BarChart/index.mjs', 'material-charts'],
  ['/repo/node_modules/@mui/x-internal-gestures/index.mjs', 'material-charts'],
  ['/repo/node_modules/@mui/x-internals/index.mjs', 'material-charts'],
  ['/repo/node_modules/@mui/x-date-pickers/DatePicker/index.mjs', 'material-dates'],
  ['/repo/node_modules/date-fns/locale/en-US.mjs', 'date-locales-english'],
  ['/repo/node_modules/date-fns/locale/ar.mjs', 'date-locales-a-m'],
  ['/repo/node_modules/date-fns/locale/pl.mjs', 'date-locales-n-z'],
])('assigns actual SDK ownership without absorbing other entries: %s', (id, name) => {
  expect(owner(id)).toBe(name);
});

it.each([
  '/repo/node_modules/react/index.js',
  '/repo/node_modules/react-dom/client.js',
  '/repo/node_modules/scheduler/index.js',
  '/repo/node_modules/@radix-ui/react-select/dist/index.js',
  '/repo/node_modules/react-aria-components/dist/index.js',
  '/repo/src/renderer/reacd-provider.tsx',
  '/repo/src/components/input/input.tsx',
  '/repo/tooling/conformance/catalog/field-examples.tsx',
])('keeps React identity, other SDKs and application lazy entries separate: %s', id => {
  expect(owner(id)).toBeUndefined();
});

it('does not capture dependencies through native adapter groups', () => {
  for (const name of ['mui', 'shadcn'])
    expect(nativeSdkChunkGroups.find(group => group.name === name))
      .toMatchObject({ includeDependenciesRecursively: false });
});
