import { expect, it } from 'vitest';
import { RECIPE_NAMES } from './recipe-names.js';
import { recipeRegistry } from './recipes.js';

it('registers every documented application example', () => {
  expect(Object.keys(recipeRegistry).sort()).toEqual([...RECIPE_NAMES].sort());
});

for (const entry of Object.values(recipeRegistry)) {
  it(`loads the displayed TSX source: ${entry.source}`, async () => {
    const module = await entry.load();
    expect(module.default).toBeTypeOf('function');
    expect(entry.source).toMatch(/^examples\/[a-z-]+\.tsx$/);
  });
}
