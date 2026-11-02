import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { GenerativeUI, defineGenerativeDeclaration } from '../../../generative.js';
import { createDocumentState } from
  '../../../state/generative-ui/create-document-state.js';

it.each([shadcnAdapter, muiAdapter])(
  'displays canonical registered state with $id',
  (adapter) => {
    const declaration = defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [{ key: 'key', kind: 'text', initial: 'meta', access: 'readWrite' }],
      root: { type: 'Kbd', platform: 'apple', value: { state: 'key', mode: 'read' } },
    });
    const registry = createDocumentState(declaration);
    render(
      <GenerativeUI adapter={adapter} document={declaration} registry={registry} />,
    );
    expect(screen.getByRole('img', { name: 'Command' })).toHaveTextContent('⌘');
    act(() => {
      expect(registry.update('key', 'shift').success).toBe(true);
    });
    expect(screen.getByRole('img', { name: 'Shift' })).toHaveTextContent('⇧');
  },
);
