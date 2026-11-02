import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

for (const name of [
  'v-stack',
  'h-stack',
  'grid',
  'text',
  'app',
  'theme',
  'page',
  'section',
  'toolbar',
  'container',
]) {
  it(`${name} is composed within the selected SDK`, () => {
    const source = readFileSync(
      `src/adapter/shadcn/${name}/${name}.adapter.tsx`,
      'utf8',
    );
    expect(source).not.toMatch(/Shared|bindPrimitives|\.\.\/\.\.\/shared/);
    expect(source).toMatch(/vendor\/ui|ShadcnSurface/);
  });
}
