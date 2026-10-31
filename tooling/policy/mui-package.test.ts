import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { checkApplication } from './application.js';
import { checkArchitecture, checkFacade } from './architecture.js';
import { isConcreteAdapterPackage } from './adapter-package.js';

const root = process.cwd();

it.each(['@fastsprout/reacd-mui', '@fastsprout/reacd-mui/styles'])(
  'keeps %s out of engine and facade imports',
  (name) => {
    expect(isConcreteAdapterPackage(name)).toBe(true);
    const source = `export { muiAdapter } from '${name}';`;
    expect(checkFacade('src/index.ts', source).length).toBeGreaterThan(0);
  },
);

it.each(['@mui/material', '@emotion/react', '@emotion/styled'])(
  'keeps %s inside the trusted UI layers',
  (name) => {
    const source = `import { value } from '${name}'; export { value };`;
    const file = resolve(root, 'src/core/example.ts');
    expect(checkArchitecture(file, source, root).length).toBeGreaterThan(0);
  },
);

it.each([
  ['mui', 'shadcn'],
  ['shadcn', 'mui'],
  ['shared', 'mui'],
  ['shared', 'shadcn'],
])('rejects adapter behavior coupling from %s to %s', (owner, dependency) => {
  const source = `import { view } from '../../${dependency}/view.js';`;
  const file = resolve(root, `src/adapter/${owner}/control/control.tsx`);
  expect(checkArchitecture(file, source, root).length).toBeGreaterThan(0);
});

it.each(['mui', 'shadcn', 'shared'])(
  'allows %s to use shared adapter behavior',
  (owner) => {
    const file = resolve(root, `src/adapter/${owner}/control/control.tsx`);
    const source = "import { view } from '../../shared/view.js';";
    expect(checkArchitecture(file, source, root)).toEqual([]);
  },
);

it.each(['@fastsprout/reacd-mui', '@fastsprout/reacd-mui/styles'])(
  'allows the public %s entry in application views',
  (name) => expect(checkApplication('app.tsx', `import '${name}';`)).toEqual([]),
);
