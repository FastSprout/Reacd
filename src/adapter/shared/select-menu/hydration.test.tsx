import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';

it('hydrates canonical labels and IDs without changing independent query', () => {
  const ui = (
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        label="Server records"
        mode="multiple"
        items={[{ value: '42', label: 'Answer' }]}
        value={['42']}
        query="Unrelated search"
        onQueryChange={() => undefined}
        onValueChange={() => undefined}
      />
    </ReacdProvider>
  );
  const root = document.createElement('div');
  root.innerHTML = renderToString(ui);
  document.body.appendChild(root);
  const id = root.querySelector('[role="combobox"]')?.id;
  const errors: unknown[] = [];
  const view = render(ui, {
    container: root,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('combobox', { name: 'Server records' })).toHaveAttribute(
    'id',
    id,
  );
  expect(screen.getByRole('combobox', { name: 'Server records' })).toHaveTextContent(
    'Answer',
  );
  expect(errors).toEqual([]);
  view.unmount();
  root.remove();
});
