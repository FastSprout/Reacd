import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Provider, atom, useAtom, createStore } from 'jotai';
import { expect, it, vi } from 'vitest';
import { ShadcnChatReasoning } from './chat-reasoning.adapter.js';

const openAtom = atom(false);
function ControlledReasoning() {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <ShadcnChatReasoning
      text="<script>Not executed</script>"
      open={open}
      onOpenChange={setOpen}
    />
  );
}

it('supports keyboard disclosure with escaped controlled summary content', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <Provider store={createStore()}>
      <ControlledReasoning />
    </Provider>,
  );
  const trigger = screen.getByRole('button', { name: 'Reasoning summary' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await user.tab();
  await user.keyboard('{Enter}');
  expect(
    await screen.findByRole('region', { name: 'Reasoning summary' }),
  ).toHaveTextContent('<script>Not executed</script>');
  expect(container.querySelector('script')).toBeNull();
  await user.keyboard(' ');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

it('preserves empty/streaming summaries and protected host state', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ShadcnChatReasoning
      text=""
      open
      onOpenChange={change}
      label="Response summary"
      streaming
    />,
  );
  expect(screen.getByRole('region', { name: 'Response summary' })).toHaveTextContent(
    'No reasoning summary is available.',
  );
  expect(screen.getByRole('status')).toHaveTextContent('Response summary');
  await user.click(screen.getByRole('button', { name: 'Response summary' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(false);
  expect(screen.getByRole('region', { name: 'Response summary' })).toBeVisible();
  view.rerender(
    <ShadcnChatReasoning
      text="Summary"
      open={false}
      onOpenChange={change}
      disabled
      streaming
      autoOpen
      autoClose
    />,
  );
  const disabled = screen.getByRole('button', { name: 'Reasoning summary' });
  expect(disabled).toBeDisabled();
  await user.click(disabled);
  expect(change).toHaveBeenCalledOnce();
});
