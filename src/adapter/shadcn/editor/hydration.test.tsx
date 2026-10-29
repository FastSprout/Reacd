import { StrictMode } from 'react';
import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { ShadcnEditor } from './editor.adapter.js';

it('hydrates escaped text without initialization callbacks', async () => {
  const change = vi.fn();
  const value = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [{ type: 'text', text: '<script>Literal</script>' }],
      },
    ],
  });
  const element = (
    <StrictMode>
      <ShadcnEditor label="Notes" value={value} onValueChange={change} />
    </StrictMode>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  expect(container.textContent).toContain('<script>Literal</script>');
  expect(container.querySelector('script')).toBeNull();
  const errors = vi.fn();
  const root = hydrateRoot(container, element, { onRecoverableError: errors });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(errors).not.toHaveBeenCalled();
  expect(change).not.toHaveBeenCalled();
  await act(async () => root.unmount());
});
