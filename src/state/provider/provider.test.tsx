import { atom, useAtom } from 'jotai';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from './provider.js';
import { createReacdStore, isReacdStore } from '../store.js';
import { Text } from '../../components/text/text.js';
import { Input } from '../../components/input/input.js';
import { shadcnAdapter } from '../../adapter/shadcn/shadcn.adapter.js';
import { templates } from '../../schema/design/templates.schema.js';
import { jsx } from '../../jsx-runtime.js';

const nameAtom = atom('');

function Editor() {
  const [name, setName] = useAtom(nameAtom);
  return <Input label="Name" value={name} onValueChange={setName} />;
}

describe('Jotai composition root', () => {
  it('isolates app stores and preserves state when designs change', async () => {
    const user = userEvent.setup();
    const first = render(
      <ReacdProvider>
        <Editor />
      </ReacdProvider>,
    );
    const second = render(
      <ReacdProvider>
        <Editor />
      </ReacdProvider>,
    );
    await user.type(within(first.container).getByLabelText('Name'), 'Illia');
    expect(within(second.container).getByLabelText('Name')).toHaveValue('');
    first.rerender(
      <ReacdProvider templateId="erp-compact">
        <Editor />
      </ReacdProvider>,
    );
    expect(within(first.container).getByLabelText('Name')).toHaveValue('Illia');
  });

  it('supports explicit stores and adapter changes without resetting atoms', () => {
    const store = createReacdStore();
    store.set(nameAtom, 'Initial');
    const { rerender } = render(
      <ReacdProvider store={store} adapter={shadcnAdapter} templates={templates}>
        <Editor />
      </ReacdProvider>,
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Initial');
    rerender(
      <ReacdProvider store={store} adapter={{ ...shadcnAdapter, id: 'second' }}>
        <Editor />
      </ReacdProvider>,
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Initial');
  });

  it('keeps explicit SSR request stores independent', () => {
    const first = createReacdStore();
    const second = createReacdStore();
    first.set(nameAtom, 'Request A');
    second.set(nameAtom, 'Request B');
    expect(
      renderToStaticMarkup(
        <ReacdProvider store={first}>
          <Editor />
        </ReacdProvider>,
      ),
    ).toContain('Request A');
    expect(
      renderToStaticMarkup(
        <ReacdProvider store={second}>
          <Editor />
        </ReacdProvider>,
      ),
    ).toContain('Request B');
  });

  it.each(['missing', 'toString', '__proto__'])(
    'rejects unregistered or inherited template %s',
    (templateId) => {
      render(
        <ReacdProvider templateId={templateId}>
          <Text>Hidden</Text>
        </ReacdProvider>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      expect(screen.queryByText('Hidden')).toBeNull();
    },
  );

  it.each([
    { adapter: {} },
    { store: {} },
    { style: {} },
    { templates: { invalid: {} } },
  ])('rejects invalid composition properties: %o', (properties) => {
    render(jsx(ReacdProvider, properties));
    expect(screen.getByRole('alert')).toHaveTextContent('ReacdProvider');
  });

  it('recognizes stores and exercises Jotai subscriptions', () => {
    const store = createReacdStore();
    const listener = vi.fn();
    const unsubscribe = store.sub(nameAtom, listener);
    store.set(nameAtom, 'Updated');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(isReacdStore(store)).toBe(true);
    for (const value of [null, [], 1, {}, { get() {} }, { get() {}, set() {} }]) {
      expect(isReacdStore(value)).toBe(false);
    }
  });
});
