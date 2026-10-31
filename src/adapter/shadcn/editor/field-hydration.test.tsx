import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { atom, createStore, useAtom } from 'jotai';
import { expect, it, vi } from 'vitest';
import { Editor, FormField, ReacdProvider } from '@fastsprout/reacd';
import type { EditorDocument } from '@fastsprout/reacd';

const initial: EditorDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'note',
      content: [{ type: 'text', text: 'First request' }],
    },
  ],
};
const second: EditorDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'note',
      content: [{ type: 'text', text: 'Second request' }],
    },
  ],
};
const valueAtom = atom(initial);

it('isolates inherited protection and Jotai values across SSR stores', async () => {
  const changed = vi.fn();
  function View({ blocked, label }: { blocked: boolean; label: string }) {
    const [value, setValue] = useAtom(valueAtom);
    return (
      <FormField name="notes" disabled={blocked} description={`${label} help`}>
        <Editor
          label={label}
          value={value}
          disabled={false}
          onValueChange={(next) => {
            changed(next);
            setValue(next);
          }}
        />
      </FormField>
    );
  }
  const firstStore = createStore();
  const secondStore = createStore();
  secondStore.set(valueAtom, second);
  const application = (
    <>
      <ReacdProvider adapter={shadcnAdapter} store={firstStore}>
        <View blocked label="First" />
      </ReacdProvider>
      <ReacdProvider adapter={shadcnAdapter} store={secondStore}>
        <View blocked={false} label="Second" />
      </ReacdProvider>
    </>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(application);
  expect(container.textContent).toContain('First request');
  expect(container.textContent).toContain('Second request');
  document.body.appendChild(container);
  const errors = vi.fn();
  const root = hydrateRoot(container, application, { onRecoverableError: errors });
  try {
    const first = await within(container).findByRole('textbox', { name: 'First' });
    const other = await within(container).findByRole('textbox', { name: 'Second' });
    expect(first).toHaveAttribute('contenteditable', 'false');
    expect(other).toHaveAttribute('contenteditable', 'true');
    await act(async () => {
      secondStore.set(valueAtom, initial);
    });
    await waitFor(() => expect(other).toHaveTextContent('First request'));
    expect(firstStore.get(valueAtom)).toBe(initial);
    expect(changed).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
