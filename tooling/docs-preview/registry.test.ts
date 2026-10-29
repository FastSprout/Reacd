import { expect, it } from 'vitest';
import { COMPONENT_NAMES } from '../../src/components/component-names.js';
import { previewRegistry } from './registry.js';

it('provides an exhaustive public component preview registry', () => {
  expect(Object.keys(previewRegistry).sort()).toEqual([...COMPONENT_NAMES].sort());
});
for (const [name, entry] of Object.entries(previewRegistry)) {
  it(`loads the actual exported TSX example for ${name}`, async () => {
    expect(entry.source).toMatch(/^examples\/[a-z-]+\.tsx$/);
    const module = await entry.load();
    expect(module.default).toBeTypeOf('function');
  });
}
