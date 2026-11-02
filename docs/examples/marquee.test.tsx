import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { marqueeSchema } from '../../src/schema/marquee/marquee.schema.js';
import { inputComponentSchema as inputSchema } from
  '../../src/schema/input/input.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { MarqueeExample } from './marquee.js';

it(
  'reports native unavailability and preserves bounded notices and host settings',
  () => {
  expectUnsupportedExample(<MarqueeExample />, 'Marquee');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <MarqueeExample />
    </probe.Surface>,
  );
  const read = () => probe.read('Marquee', marqueeSchema, 'Reference notices');
  const edit = (value: string) =>
    act(() =>
      probe.read('Input', inputSchema, 'Marquee notice text').onValueChange(value),
    );
  const toggle = (label: string) =>
    act(() => {
      const value = probe.read('Toggle', toggleSchema, label);
      value.onCheckedChange(!value.checked);
    });
  expect(read().paused).toBe(true);
  act(() => read().onPausedChange(false));
  expect(read().paused).toBe(false);
  act(() => read().onPausedChange(true));
  edit('Edited notice');
  expect(read().items[0]?.label).toBe('Edited notice');
  edit('x'.repeat(501));
  expect(read().items[0]?.label).toHaveLength(500);
  edit(' ');
  expect(read().items[0]?.label).toBe('Notice content');
  for (const label of [
    'Right to left marquee',
    'Backward marquee',
    'Fast marquee',
    'Readonly marquee',
  ])
    toggle(label);
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  expect(read()).toMatchObject({ direction: 'backward', pace: 'fast', readOnly: true });
  toggle('Empty marquee');
  expect(read().items).toEqual([]);
});
