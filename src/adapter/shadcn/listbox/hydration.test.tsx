import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnListbox } from './listbox.adapter.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'b', label: 'Beta' },
];

it('hydrates stable lists without focus or selection cross-talk', async () => {
  const user = userEvent.setup();
  const first = vi.fn();
  const second = vi.fn();
  const errors: unknown[] = [];
  const ui = (
    <DirectionProvider dir="rtl">
      <ShadcnListbox
        label="First"
        items={items}
        value="42"
        locale="ar-EG"
        onValueChange={first}
        description="Explicit locale"
      />
      <ShadcnListbox
        mode="multiple"
        label="Second"
        items={items}
        value={[]}
        onValueChange={second}
      />
    </DirectionProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  const labels = [...container.querySelectorAll('[role="listbox"]')].map((node) =>
    node.getAttribute('aria-labelledby'),
  );
  const view = render(ui, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(
    [...container.querySelectorAll('[role="listbox"]')].map((node) =>
      node.getAttribute('aria-labelledby'),
    ),
  ).toEqual(labels);
  expect(document.activeElement).toBe(document.body);
  expect(screen.getByRole('listbox', { name: 'First' })).toHaveAccessibleDescription(
    /Explicit locale/,
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'First' })).getByRole('option', {
      name: 'Beta',
    }),
  );
  expect(first).toHaveBeenCalledExactlyOnceWith('b');
  expect(second).not.toHaveBeenCalled();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
