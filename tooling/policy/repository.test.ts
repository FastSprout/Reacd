import { describe, expect, it } from 'vitest';
import { inspectRepository } from './repository.js';

describe('repository enforcement', () => {
  it('limits the generated-format exemption to the release changelog', () => {
    const source = `${'Generated release link '.repeat(10)}\n`.repeat(301);
    expect(
      inspectRepository([{ path: '/repo/docs/changelog.md', source }], '/repo'),
    ).toEqual([]);
    for (const path of ['/repo/docs/guide.md', '/repo/tooling/changelog.ts']) {
      expect(
        inspectRepository([{ path, source }], '/repo').map((issue) => issue.rule),
      ).toContain('lines');
    }
  });
  it('checks application boundaries, layer imports, and source rules', () => {
    const issues = inspectRepository(
      [
        {
          path: '/repo/src/components/a.ts',
          source: "import { x } from '../state/x.js';",
        },
        { path: '/repo/demo/a.tsx', source: 'export const A = () => <div />;' },
        { path: '/repo/demo/a.css', source: '\t.a {}' },
      ],
      '/repo',
    );
    expect(issues.map((issue) => issue.rule)).toEqual([
      'architecture',
      'application',
      'tabs',
      'indent',
    ]);
  });

  it('permits pure public facades and colocated integration tests', () => {
    expect(
      inspectRepository(
        [
          { path: '/repo/src/index.ts', source: "export * from './state/index.js';" },
          {
            path: '/repo/src/generative.ts',
            source: "export { UI } from './state/ui.js';",
          },
          {
            path: '/repo/src/renderer.tsx',
            source: "'use client'; export { UI } from './state/ui.js';",
          },
          {
            path: '/repo/src/core/core.test.ts',
            source: "import { x } from '../state/x.js';",
          },
          { path: '/repo/demo/e2e/a.spec.ts', source: 'const a = document.body;' },
          { path: '/repo/src/adapter/shadcn/vendor/ui.ts', source: '\ttrusted;' },
        ],
        '/repo',
      ),
    ).toEqual([]);
  });

  it('keeps vendor imports in trusted layers and rejects them in apps', () => {
    const source = "import { Root as Label } from '@radix-ui/react-label';";
    expect(
      inspectRepository(
        [
          { path: '/repo/src/renderer/label/vendor.ts', source },
          { path: '/repo/src/adapter/shadcn/label/vendor.ts', source },
          { path: '/repo/docs/examples/vendor-label.tsx', source },
        ],
        '/repo',
      ),
    ).toEqual([
      expect.objectContaining({
        file: '/repo/docs/examples/vendor-label.tsx',
        rule: 'application',
      }),
    ]);
  });

  it('rejects logic in public facades and invalid syntax', () => {
    expect(
      inspectRepository(
        [
          { path: '/repo/src/index.ts', source: 'export const unsafe = 1;' },
          { path: '/repo/src/generative.ts', source: 'export {' },
        ],
        '/repo',
      ).map((issue) => issue.rule),
    ).toEqual(['facade', 'syntax']);
  });
});
