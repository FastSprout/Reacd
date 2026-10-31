import { describe, expect, it } from 'vitest';
import { checkApplication } from './application.js';
import { checkArchitecture, checkFacade } from './architecture.js';
import { LAYERS } from './layers.js';

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
const error =
  'Concrete adapter packages are selected by applications, not engine modules.';

describe('independent adapter package ownership', () => {
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
