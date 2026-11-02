import { atom, Provider, useAtom } from 'jotai';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { MuiInputDate } from './input-date.adapter.js';
import { MuiCalendar } from '../calendar/calendar.adapter.js';

const dateAtom = atom<string | null>('2026-11-16');
const calendarAtom = atom<string | null>(null);

function ControlledDate() {
  return <Provider><DateControl /></Provider>;
}

function DateControl() {
  const [value, setValue] = useAtom(dateAtom);
  const [calendar, setCalendar] = useAtom(calendarAtom);
  return <form aria-label="Delivery">
    <MuiCalendar label="Calendar" value={calendar} onValueChange={setCalendar}
      referenceDate="2026-11-01" />
    <MuiInputDate label="Date" value={value} onValueChange={setValue}
      name="date" referenceDate="2026-11-01" />
    <output>{value}</output>
  </form>;
}

afterEach(() => vi.restoreAllMocks());

it.each(['mobile', 'desktop'] as const)(
  'retains a controlled popup selection through native %s close', async (variant) => {
    if (variant === 'desktop') vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({
      matches: query.includes('pointer: fine'), media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    render(<ControlledDate />);
    await userEvent.click(screen.getByRole('gridcell', { name: '18' }));
    await userEvent.click(screen.getByRole('button', { name: /Choose date/ }));
    await userEvent.click(within(screen.getByRole('dialog'))
      .getByRole('gridcell', { name: '20' }));
    expect(screen.getByText('2026-11-20')).toBeInTheDocument();
    if (variant === 'mobile')
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByRole('status')).toHaveTextContent('2026-11-20');
    const form = screen.getByRole('form');
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
    expect(new FormData(form).get('date')).toBe('2026-11-20');
  },
);
