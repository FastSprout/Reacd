import { Editor } from '@tiptap/core';
import { expect, it, vi } from 'vitest';
import { createEditorExtensions } from './extensions.js';
import { createEditorResources } from './resources.js';

it('disposes SDK resources without touching neighbors', () => {
  const resources = createEditorResources();
  const complete = new Editor({
    injectCSS: false,
    extensions: createEditorExtensions(),
    onBeforeCreate: ({ editor }) => {
      resources.capture(editor);
    },
  });
  const neighbor = new Editor({
    injectCSS: false,
    extensions: createEditorExtensions(),
  });
  const destroyed = vi.fn();
  const observe = vi
    .spyOn(MutationObserver.prototype, 'observe')
    .mockImplementationOnce(() => {
      throw new Error('Startup observer failure');
    });
  try {
    expect(
      () =>
        new Editor({
          injectCSS: false,
          extensions: createEditorExtensions(),
          onBeforeCreate: ({ editor }) => {
            resources.capture(editor);
          },
          onDestroy: destroyed,
        }),
    ).toThrow('Startup observer failure');
    expect(destroyed).not.toHaveBeenCalled();
    resources.dispose();
    expect(destroyed).toHaveBeenCalledExactlyOnceWith();
    expect(complete.isDestroyed).toBe(true);
    expect(neighbor.isDestroyed).toBe(false);
    resources.dispose();
    expect(destroyed).toHaveBeenCalledOnce();
  } finally {
    observe.mockRestore();
    neighbor.destroy();
    resources.dispose();
  }
});
