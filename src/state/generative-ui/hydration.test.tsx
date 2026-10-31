import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { success } from '../../../test-support/data-table.js';

describe('generative state hydration', () => {
  it('hydrates server values and isolates client edits', async () => {
    const user = userEvent.setup();
    const document = defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [
        { key: 'name', kind: 'text', initial: 'Server snapshot', access: 'readWrite' },
      ],
      root: {
        type: 'VStack',
        children: [
          { type: 'Input', label: 'Name', value: { state: 'name', mode: 'readWrite' } },
          { type: 'Text', content: { state: 'name', mode: 'read' } },
        ],
      },
    });
    const server = createDocumentState(document);
    const html = renderToString(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={server} />,
    );
    const container = globalThis.document.createElement('div');
    container.innerHTML = html;
    globalThis.document.body.appendChild(container);
    const client = createDocumentState(document);
    const errors: unknown[] = [];
    const view = render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={client} />,
      {
        container,
        hydrate: true,
        onRecoverableError: (error) => {
          errors.push(error);
        },
      },
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Server snapshot');
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Client edit');
    expect(screen.getByText('Client edit')).toBeInTheDocument();
    expect(success(server.read('name')).value).toBe('Server snapshot');
    expect(success(client.read('name')).value).toBe('Client edit');
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  });
});
