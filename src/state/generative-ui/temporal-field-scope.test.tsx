import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

for (const kind of ['date', 'time'] as const) {
  const initial = kind === 'date' ? '2026-10-14' : '12:30:00';
  const replacement = kind === 'date' ? '2026-10-20' : '14:00:00';
  it(`${kind} binding blocks disabled edits but accepts host updates`, async () => {
    const definitions = [
      { key: 'value', kind, initial, access: 'readWrite' },
      { key: 'error', kind: 'text', initial: 'Scope review', access: 'readWrite' },
    ];
    const registry = success(createStateRegistry(definitions));
    const control = {
      type: kind === 'date' ? 'InputDate' : 'InputTime',
      ...(kind === 'date' ? { referenceDate: initial } : {}),
      label: 'Bound temporal value',
      disabled: false,
      value: { state: 'value', mode: 'readWrite' },
    };
    const { container } = render(
      <GenerativeUI
        registry={registry}
        document={{
          schemaVersion: '0.2',
          state: definitions,
          root: {
            type: 'FormField',
            name: 'inherited',
            disabled: true,
            error: { state: 'error', mode: 'read' },
            children: [control],
          },
        }}
      />,
    );
    const segment = screen.getAllByRole('spinbutton')[0];
    if (!segment) throw new Error('Expected a segmented control.');
    expect(segment).toHaveAttribute('aria-disabled', 'true');
    expect(segment).toHaveAttribute('aria-invalid', 'true');
    expect(segment).toHaveAccessibleDescription(/Scope review/);
    segment.focus();
    await userEvent.setup().keyboard('{ArrowUp}');
    expect(success(registry.read('value')).value).toBe(initial);
    act(() => {
      expect(registry.update('value', replacement).success).toBe(true);
      expect(registry.update('error', '').success).toBe(true);
    });
    expect(container.querySelector('input[name="inherited"]')).toHaveValue(replacement);
    expect(segment).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Scope review')).toBeNull();
  });
}
