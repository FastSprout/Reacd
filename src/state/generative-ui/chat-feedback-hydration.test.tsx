import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import * as Scene from '../../../tooling/conformance/catalog/chat-feedback-examples.js';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';

it('hydrates feedback previews with stable disclosure labels', async () => {
  const user = userEvent.setup();
  for (const templateId of ['saas-modern-light', 'erp-compact']) {
    const element = (
      <ReacdProvider adapter={shadcnAdapter} templateId={templateId}>
        <Scene.ChatFeedbackExamples />
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
    expect(screen.getByRole('button', { name: 'Reasoning summary' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(
      screen.getByRole('button', { name: 'Example reference reader' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Processing an example request.')).toBeVisible();
    await user.click(
      screen.getByRole('switch', {
        name: 'Right to left chat feedback',
      }),
    );
    await user.click(
      screen.getByRole('switch', {
        name: 'Right to left chat feedback',
      }),
    );
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  }
});
