import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from '../../../../test-support/shared-adapter-server.js';
import { getLocalTimeZone, setLocalTimeZone } from '@internationalized/date';
import { expect, it, vi } from 'vitest';
import { SharedInputTime } from './input-time.adapter.js';

it('hydrates DST-gap time independently of ambient date and timezone', () => {
  const originalZone = getLocalTimeZone();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-03-08T08:00:00Z'));
  const errors: unknown[] = [];
  const container = document.createElement('div');
  try {
    setLocalTimeZone('America/New_York');
    const ui = (
      <SharedInputTime
        label="Stable time"
        value="02:30:00"
        onValueChange={() => undefined}
      />
    );
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    const hour = container.querySelector('[data-type="hour"]');
    if (hour === null) throw new Error('Expected an SSR-rendered hour segment.');
    expect(hour).toHaveAttribute('aria-valuenow', '2');
    const serverId = hour.id;
    setLocalTimeZone('Pacific/Auckland');
    vi.setSystemTime(new Date('2026-10-29T23:45:00Z'));
    const view = render(ui, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(screen.getByRole('spinbutton', { name: /hour, Stable time/i }).id).toBe(
      serverId,
    );
    expect(
      screen.getByRole('spinbutton', { name: /hour, Stable time/i }),
    ).toHaveAttribute('aria-valuenow', '2');
    expect(errors).toEqual([]);
    view.unmount();
  } finally {
    container.remove();
    setLocalTimeZone(originalZone);
    vi.useRealTimers();
  }
});
