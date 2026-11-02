import { describe, expect, it } from 'vitest';
import { checkApplication } from './application.js';
import { checkArchitecture, checkFacade } from './architecture.js';
import { LAYERS } from './layers.js';
import { ADAPTER_PACKAGE_ERROR } from './adapter-package.js';

const root = '/workspace';
const imports = [
  "import { shadcnAdapter } from '@fastsprout/reacd-shadcn';",
  "import type { Adapter } from '@fastsprout/reacd-shadcn';",
  "import '@fastsprout/reacd-shadcn/styles';",
  "import '@fastsprout/reacd-shadcn/styles.css';",
  "import '@fastsprout/reacd-shadcn/vendor/ui/button';",
  "export * from '@fastsprout/reacd-shadcn';",
  "export { shadcnAdapter } from '@fastsprout/reacd-shadcn';",
  "export type { Adapter } from '@fastsprout/reacd-shadcn';",
  "const load = import('@fastsprout/reacd-shadcn');",
  "const load = require('@fastsprout/reacd-shadcn/styles');",
  "type Adapter = import('@fastsprout/reacd-shadcn').Adapter;",
  "import Adapter = require('@fastsprout/reacd-shadcn');",
];
const error = ADAPTER_PACKAGE_ERROR;

describe('independent adapter package ownership', () => {
  it('permits only the default adapter browser styles facade', () => {
    expect(
      checkFacade(
        `${root}/src/styles.ts`,
        "export {} from '@fastsprout/reacd-shadcn/styles';",
      ),
    ).toEqual([]);
    for (const source of [
      "export * from '@fastsprout/reacd-shadcn';",
      "export * from '@fastsprout/reacd-mui/styles';",
    ]) {
      expect(checkFacade(`${root}/src/styles.ts`, source)).toEqual([
        expect.objectContaining({ message: ADAPTER_PACKAGE_ERROR }),
      ]);
    }
  });
  it('permits only the declared default adapter composition boundary', () => {
    expect(
      checkArchitecture(
        `${root}/src/state/provider/default-adapter.ts`,
        "export { shadcnAdapter as defaultAdapter } from '@fastsprout/reacd-shadcn';",
        root,
      ),
    ).toEqual([]);
    for (const source of [
      "import { muiAdapter } from '@fastsprout/reacd-mui';",
      "import '@fastsprout/reacd-shadcn/styles';",
      "import '@fastsprout/reacd-shadcn/vendor/ui/button';",
    ])
      expect(
        checkArchitecture(
          `${root}/src/state/provider/default-adapter.ts`,
          source,
          root,
        ),
      ).toEqual([
        expect.objectContaining({
          message: ADAPTER_PACKAGE_ERROR,
        }),
      ]);
  });
  for (const layer of LAYERS) {
    it.each(imports)(
      `${layer} cannot import concrete adapter package: %s`,
      (source) => {
        const file = `${root}/src/${layer}/owned.ts`;
        expect(checkArchitecture(file, `\n${source}`, root)).toEqual([
          expect.objectContaining({
            file,
            line: 2,
            rule: 'architecture',
            message: error,
          }),
        ]);
      },
    );
  }

  it.each([
    "export * from '@fastsprout/reacd-shadcn';",
    "export { shadcnAdapter } from '@fastsprout/reacd-shadcn';",
    "export type { Adapter } from '@fastsprout/reacd-shadcn';",
    "export * from '@fastsprout/reacd-shadcn/styles';",
    "export * from '@fastsprout/reacd-shadcn/vendor/ui/button';",
  ])('facades reject concrete adapter ownership: %s', (source) => {
    expect(checkFacade(`${root}/src/index.ts`, source)).toEqual([
      expect.objectContaining({ rule: 'architecture', message: error }),
    ]);
  });

  it('retains explicit public adapter selection in applications', () => {
    expect(
      checkApplication(
        'application.tsx',
        `
      import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
      import '@fastsprout/reacd-shadcn/styles';
    `,
      ),
    ).toEqual([]);
  });

  it.each([
    '@fastsprout/reacd-shadcn-business',
    '@fastsprout/reacd-shadcn-extra/styles',
    '@business/shadcn',
  ])('does not ban unrelated business packages: %s', (value) => {
    expect(
      checkArchitecture(`${root}/src/core/owned.ts`, `import '${value}';`, root),
    ).toEqual([]);
  });
});
