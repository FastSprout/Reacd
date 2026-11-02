import { expect, it } from 'vitest';
import { readSiteConfig } from './config.js';

it('reads a strict owned navigation tree and preserves public routes', () => {
  const config = readSiteConfig(`title: reacd
description: Closed components
origin: https://reacd.dev/
navigation:
  - Start: index.md
  - Components:
      - Button: components/button.md
`);
  const [start, group] = config.navigation;
  expect(start).toMatchObject({ label: 'Start', href: '/' });
  expect(start?.key).toMatch(/^page-[a-f0-9]{64}$/);
  expect(group?.label).toBe('Components');
  expect(group?.key).toMatch(/^group-[a-f0-9]{64}$/);
  expect(group?.children?.[0]).toMatchObject({
    label: 'Button', href: '/components/button/',
  });
  expect(group?.children?.[0]?.key).toMatch(/^page-[a-f0-9]{64}$/);
});

it.each([
  'title: Test',
  'title: Test\ndescription: Test\norigin: javascript:alert(1)\nnavigation: []',
  'title: Test\ndescription: Test\norigin: https://reacd.dev/\nnav: []',
  `title: Test
description: Test
origin: https://reacd.dev/
navigation:
  - Bad: ../outside.md`,
  `title: Test
description: Test
origin: https://reacd.dev/
navigation:
  - Bad: { A: index.md, B: test.md }`,
])('rejects invalid or unsafe configuration %s', (source) => {
  expect(() => readSiteConfig(source)).toThrow();
});
