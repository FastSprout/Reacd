import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';

it('hydrates explicit text without shared state or unstable label IDs', () => {
  const ui = (
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu
        label="Server text"
        value="Custom place"
        items={[]}
        onValueChange={() => undefined}
      />
    </ReacdProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  const before = container.querySelector('input[role="combobox"]')?.id;
  const errors: unknown[] = [];
  const view = render(ui, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('combobox', { name: 'Server text' })).toHaveAttribute(
    'id',
    before,
  );
  expect(screen.getByRole('combobox', { name: 'Server text' })).toHaveValue(
    'Custom place',
  );
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
