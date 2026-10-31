import { useAtom, atom, Provider, createStore } from 'jotai';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { createPortal } from 'react-dom';
import { TrustedFormBoundary } from '../../../renderer/form/form-boundary.js';
import { CHAT_COMPOSER_POLICY } from '../../../core/chat-composer-policy.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { SharedModal } from '../modal/modal.adapter.js';
import { SharedChatPromptSubmit } from
  '../chat-prompt-submit/chat-prompt-submit.adapter.js';
import { SharedChatPrompt } from './chat-prompt.adapter.js';

const draftAtom = atom('Draft');
function Controlled() {
  const [value, change] = useAtom(draftAtom);
  return (
    <SharedChatPrompt
      label="Message"
      value={value}
      onValueChange={change}
      onSubmit={() => undefined}
      footer={<SharedChatPromptSubmit label="Send draft" />}
    />
  );
}

it('isolates native submission in a physically outside portal form', async () => {
  const outer = vi.fn();
  const inner = vi.fn();
  const portal = document.createElement('div');
  document.body.appendChild(portal);
  const view = render(
    <TrustedFormBoundary>
      <form aria-label="Outer form" onSubmit={outer}>
        {createPortal(
          <SharedChatPrompt
            label="Portal draft"
            value="Draft"
            onSubmit={inner}
            onValueChange={() => undefined}
          />,
          portal,
        )}
      </form>
    </TrustedFormBoundary>,
  );
  const form = await screen.findByRole('form', { name: 'Portal draft' });
  fireEvent.submit(form);
  expect(inner).toHaveBeenCalledExactlyOnceWith('Draft');
  expect(outer).not.toHaveBeenCalled();
  view.unmount();
  portal.remove();
});

it('isolates controlled drafts and inherits custom footer capabilities', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Provider store={createStore()}>
        <Controlled />
      </Provider>
      <Provider store={createStore()}>
        <Controlled />
      </Provider>
    </>,
  );
  const [first, second] = screen.getAllByRole('textbox');
  if (first === undefined || second === undefined)
    throw new Error('Two drafts required');
  await user.type(first, '!');
  expect(first).toHaveValue('Draft!');
  expect(second).toHaveValue('Draft');
  expect(screen.getAllByRole('button', { name: 'Send draft' })).toHaveLength(2);
});

it('rejects nested prompts and protects inactive or oversized edits', () => {
  const submit = vi.fn();
  const change = vi.fn();
  const view = render(
    <SharedChatPrompt
      label="Outer"
      value="Draft"
      onSubmit={submit}
      onValueChange={change}
      footer={
        <SharedChatPrompt
          label="Inner"
          value="Inner"
          onSubmit={submit}
          onValueChange={change}
        />
      }
    />,
  );
  expect(screen.queryByRole('textbox', { name: 'Inner' })).toBeNull();
  expect(screen.getByRole('alert')).toHaveTextContent('nested');
  expect(view.container.querySelectorAll('form')).toHaveLength(1);
  view.rerender(
    <PortalActiveContext.Provider value={false}>
      <SharedChatPrompt
        label="Inactive"
        value="Draft"
        onSubmit={submit}
        onValueChange={change}
      />
    </PortalActiveContext.Provider>,
  );
  const hidden = screen.getByRole('textbox', { name: 'Inactive' });
  fireEvent.change(hidden, { target: { value: 'Edited' } });
  fireEvent.keyDown(hidden, { key: 'Enter' });
  expect(submit).not.toHaveBeenCalled();
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <SharedChatPrompt
      label="Active"
      value="Draft"
      onSubmit={submit}
      onValueChange={change}
    />,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Active' }), {
    target: { value: 'x'.repeat(CHAT_COMPOSER_POLICY.maxDraftLength + 1) },
  });
  expect(change).not.toHaveBeenCalled();
});

it('claims Escape inside a Modal without closing the enclosing layer', async () => {
  const user = userEvent.setup();
  const close = vi.fn();
  const modal = vi.fn();
  const view = render(
    <SharedModal title="Conversation" description="Chat" open onOpenChange={modal}>
      <SharedChatPrompt
        label="Message"
        value="Draft"
        onValueChange={() => undefined}
        onSubmit={() => undefined}
        onClose={close}
      />
    </SharedModal>,
  );
  const draft = await screen.findByRole('textbox', { name: 'Message' });
  await user.click(draft);
  await user.keyboard('{Escape}');
  expect(close).toHaveBeenCalledExactlyOnceWith();
  expect(modal).not.toHaveBeenCalled();
  fireEvent.compositionStart(draft);
  await user.keyboard('{Escape}');
  expect(close).toHaveBeenCalledOnce();
  expect(modal).not.toHaveBeenCalled();
  fireEvent.compositionEnd(draft);
  view.rerender(
    <SharedModal title="Conversation" description="Chat" open onOpenChange={modal}>
      <SharedChatPrompt
        label="Message"
        value="Draft"
        onValueChange={() => undefined}
        onSubmit={() => undefined}
      />
    </SharedModal>,
  );
  await user.keyboard('{Escape}');
  expect(modal).toHaveBeenCalledExactlyOnceWith(false);
});
