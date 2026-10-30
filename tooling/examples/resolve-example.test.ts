import { join } from 'node:path';
import { expect, it } from 'vitest';
import { resolveExample } from './resolve-example.js';

it.each(['counter', 'form', 'dashboard'])('selects the literal %s entry', (name) => {
  const example = resolveExample(name);
  expect(example.name).toBe(name);
  expect(example.entry).toBe(join(example.repository, 'examples', name, 'main.tsx'));
  expect(example.host).toBe(
    join(example.repository, 'src', 'renderer', 'bootstrap', 'host'),
  );
  expect(example.output).toBe(join(example.repository, '.cache', 'examples', name));
});

it.each(['development', 'production'])(
  'defaults the Vite %s mode to counter',
  (mode) => {
    expect(resolveExample(mode).name).toBe('counter');
  },
);

it.each(['', '../counter', 'unknown', 1, null])('rejects unknown mode %s', (mode) => {
  expect(() => resolveExample(mode)).toThrow('Choose counter, form or dashboard.');
});
