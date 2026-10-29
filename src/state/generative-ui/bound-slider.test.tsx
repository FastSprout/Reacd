import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundSlider } from './bound-slider.js';

const base = { type: 'Slider', label: 'Level', min: 0, max: 100 } as const;
const GEOMETRY = { width: 200, height: 44 };

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, GEOMETRY.width, GEOMETRY.height),
  );
});

it('shares bounded number and interval state while protecting readers', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'level', kind: 'number', initial: 20, access: 'readWrite' },
      {
        key: 'interval',
        kind: 'numberRange',
        initial: { start: 20, end: 80 },
        access: 'readWrite',
      },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundSlider
        node={{ ...base, value: { state: 'level', mode: 'readWrite' } }}
        registry={registry}
      />
      <BoundSlider
        node={{ ...base, label: 'Reader', value: { state: 'level', mode: 'read' } }}
        registry={registry}
      />
      <BoundSlider
        node={{
          ...base,
          label: 'Price',
          mode: 'range',
          value: { state: 'interval', mode: 'readWrite' },
        }}
        registry={registry}
      />
      <BoundSlider
        node={{
          ...base,
          label: 'Interval reader',
          mode: 'range',
          value: { state: 'interval', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  const writer = await screen.findByRole('slider', { name: 'Level' });
  act(() => writer.focus());
  await user.keyboard('{ArrowRight}');
  expect(success(registry.read('level')).value).toBe(21);
  expect(screen.getByRole('slider', { name: 'Reader' })).toHaveAttribute(
    'aria-valuenow',
    '21',
  );
  const minimum = screen.getByRole('slider', { name: 'Minimum Price' });
  act(() => minimum.focus());
  await user.keyboard('{ArrowRight}');
  expect(success(registry.read('interval')).value).toEqual({ start: 21, end: 80 });
  expect(
    screen.getByRole('slider', { name: 'Minimum Interval reader' }),
  ).toHaveAttribute('aria-readonly', 'true');
  expect(registry.update('level', 101).success).toBe(false);
  expect(registry.update('interval', { start: 0, end: 101 }).success).toBe(false);
});

it('reports unresolved scalar and range references without controls', () => {
  const registry = success(createStateRegistry([]));
  render(
    <ReacdProvider>
      <BoundSlider
        node={{ ...base, value: { state: 'missing', mode: 'read' } }}
        registry={registry}
      />
      <BoundSlider
        node={{ ...base, mode: 'range', value: { state: 'missing', mode: 'read' } }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('slider')).toBeNull();
});
