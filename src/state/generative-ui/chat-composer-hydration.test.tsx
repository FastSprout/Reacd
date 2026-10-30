import * as Scene from '../../../tooling/conformance/catalog/chat-composer-examples.js';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';

import { ChatComposerNodeView } from './chat-composer-node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

it('hydrates labelled drafts and switches direction', async () => {
  const user = userEvent.setup();
  for (const templateId of ['saas-modern-light', 'erp-compact']) {
    const element = (
      <ReacdProvider templateId={templateId}>
        <Scene.ChatComposerExamples />
      </ReacdProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.appendChild(container);
    const errors: unknown[] = [];
    const view = render(element, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(screen.getByRole('textbox', { name: 'Example message' })).toHaveValue('');
    await user.click(
      screen.getByRole('switch', { name: 'Right to left chat composer' }),
    );
    await user.click(
      screen.getByRole('switch', { name: 'Right to left chat composer' }),
    );
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  }
});

it('uses literal transport status without a status state dependency', () => {
  const registry = success(
    createStateRegistry([
      { key: 'draft', kind: 'text', initial: 'Draft', access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider>
      <ChatComposerNodeView
        node={{
          type: 'ChatPrompt',
          label: 'Literal status',
          value: { state: 'draft', mode: 'readWrite' },
          status: 'ready',
          submitAction: 'send',
        }}
        registry={registry}
        actions={{ send: () => undefined }}
        renderChild={() => null}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Send message' })).not.toBeDisabled();
});
