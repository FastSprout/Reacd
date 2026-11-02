import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTags } from './input-tags.adapter.js';

it('hydrates the same SDK input and preserves canonical server tokens', async () => {
  const change = vi.fn();
  const node = (
    <form>
      <ShadcnInputTags
        label="Topics"
        value={['Vue', 'React']}
        onValueChange={change}
        name="topics"
        description="Choose topics"
      />
    </form>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(node);
  document.body.append(container);
  const input = container.querySelector('[role=combobox]');
  const errors: unknown[] = [];
  const root = hydrateRoot(container, node, {
    onRecoverableError: (error) => errors.push(error),
  });
  await act(async () => {});
  expect(errors).toEqual([]);
  expect(container.querySelector('[role=combobox]')).toBe(input);
  const form = container.querySelector('form');
  if (!form) throw new Error('Missing hydrated native form.');
  expect(Array.from(new FormData(form))).toEqual([
    ['topics', 'Vue'],
    ['topics', 'React'],
  ]);
  expect(change).not.toHaveBeenCalled();
  await act(async () => root.unmount());
  container.remove();
});
