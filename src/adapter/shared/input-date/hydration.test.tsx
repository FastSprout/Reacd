import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from '../../../../test-support/shared-adapter-server.js';
import { getLocalTimeZone, setLocalTimeZone } from '@internationalized/date';
import { expect, it, vi } from 'vitest';
import { SharedInputDate } from './input-date.adapter.js';

it('hydrates Gregorian dates across clock and timezone changes', () => {
  const originalZone = getLocalTimeZone();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2011-12-30T12:00:00Z'));
  const errors: unknown[] = [];
  const container = document.createElement('div');
  try {
    setLocalTimeZone('Pacific/Apia');
    const ui = (
      <SharedInputDate
        label="Stable date"
        locale="ja-JP-u-ca-japanese"
        referenceDate="2011-12-29"
        value="2011-12-30"
        onValueChange={() => undefined}
      />
    );
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    const year = container.querySelector('[data-type="year"]');
    if (year === null) throw new Error('Expected an SSR year segment.');
    const serverId = year.id;
    expect(year).toHaveAttribute('aria-valuenow', '2011');
    setLocalTimeZone('America/Los_Angeles');
    vi.setSystemTime(new Date('2026-10-29T01:00:00Z'));
    const view = render(ui, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(container.querySelector('[data-type="year"]')?.id).toBe(serverId);
    expect(container.querySelector('[data-type="year"]')).toHaveAttribute(
      'aria-valuenow',
      '2011',
    );
    expect(container.querySelector('[data-type="day"]')).toHaveAttribute(
      'aria-valuenow',
      '30',
    );
    expect(screen.getByRole('group', { name: 'Stable date' })).toBeInTheDocument();
    expect(errors).toEqual([]);
    view.unmount();
  } finally {
    container.remove();
    setLocalTimeZone(originalZone);
    vi.useRealTimers();
  }
});

it('preserves the earliest Gregorian year without native Date remapping', () => {
  const { container } = render(
    <SharedInputDate
      label="Early date"
      referenceDate="0001-01-01"
      value="0001-01-01"
      onValueChange={vi.fn()}
    />,
  );
  expect(container.querySelector('[data-type="year"]')).toHaveAttribute(
    'aria-valuenow',
    '1',
  );
});
