import { readFileSync } from 'node:fs';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import { expect, it } from 'vitest';
import { z } from 'zod';

const repository = new NodeURL('../../', import.meta.url);
const configurationSchema = z.object({
  compilerOptions: z.object({
    jsxImportSource: z.literal('@fastsprout/reacd'),
    paths: z.record(z.string(), z.array(z.string())),
  }),
});

it.each([
  { project: 'docs/examples', relative: '../../' },
  { project: 'examples', relative: '../' },
  { project: 'tooling/conformance', relative: '../../' },
])('keeps $project closed without compiling trusted native JSX', (entry) => {
  const source = readFileSync(
    fileURLToPath(new NodeURL(`${entry.project}/tsconfig.json`, repository)),
    'utf8',
  );
  const input: unknown = JSON.parse(source);
  const configuration = configurationSchema.parse(input);
  const prefix = '@fastsprout/reacd/adapter-runtime/';
  const expected = {
    '@fastsprout/reacd-mui': [
      `${entry.relative}packages/mui/dist/mui/mui.adapter.d.ts`,
    ],
    '@fastsprout/reacd-mui/styles': [
      `${entry.relative}packages/mui/dist/styles-contract.d.ts`,
    ],
    '@fastsprout/reacd-shadcn': [
      `${entry.relative}packages/shadcn/dist/shadcn/shadcn.adapter.d.ts`,
    ],
    '@fastsprout/reacd-shadcn/styles': [
      `${entry.relative}packages/shadcn/dist/styles-contract.d.ts`,
    ],
    ...Object.fromEntries(
      ['core', 'schema', 'components', 'renderer'].map((layer) => [
        `${prefix}${layer}/*`,
        [`${entry.relative}dist/${layer}/*`],
      ]),
    ),
  };
  expect(configuration.compilerOptions.paths).toEqual(expected);
});
