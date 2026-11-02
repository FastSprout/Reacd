import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { GenerativeUI, defineGenerativeDeclaration } from '../../../generative.js';
import { createDocumentState } from
  '../../../state/generative-ui/create-document-state.js';

it('hydrates native Material ratings with shared protected host state', () => {
  const declaration = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [{ key: 'rating', kind: 'number', initial: 2.5, access: 'readWrite' }],
    root: {
      type: 'VStack',
      children: [
        {
          type: 'InputRating',
          label: 'Quality',
          step: 0.5,
          value: { state: 'rating', mode: 'readWrite' },
        },
        {
          type: 'InputRating',
          label: 'Reader',
          step: 0.5,
          value: { state: 'rating', mode: 'read' },
        },
      ],
    },
  });
  const server = createDocumentState(declaration);
  const client = createDocumentState(declaration);
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={muiAdapter} document={declaration} registry={server} />,
  );
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={muiAdapter} document={declaration} registry={client} />,
    { container, hydrate: true, onRecoverableError: (error) => errors.push(error) },
  );
  fireEvent.click(screen.getByRole('radio', { name: '3 Stars' }));
  expect(client.read('rating')).toEqual({
    success: true,
    data: { key: 'rating', kind: 'number', value: 3 },
  });
  expect(server.read('rating')).toEqual({
    success: true,
    data: { key: 'rating', kind: 'number', value: 2.5 },
  });
  expect(
    within(screen.getByRole('group', { name: 'Reader' })).getByRole('img'),
  ).toHaveAttribute('aria-label', '3 Stars');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
