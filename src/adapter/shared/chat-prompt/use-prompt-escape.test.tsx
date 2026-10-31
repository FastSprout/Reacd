import { useRef } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { usePromptEscape } from './use-prompt-escape.js';

function Harness({
  onClose,
  disabled = false,
}: {
  onClose?: (() => void) | undefined;
  disabled?: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  const composing = useRef(false);
  const { focus, blur } = usePromptEscape(form, composing, onClose, disabled);
  return (
    <>
      <form ref={form} onFocusCapture={focus} onBlurCapture={blur}>
        <textarea
          aria-label="Draft"
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={() => {
            composing.current = false;
          }}
        />
        <button type="button">Inside prompt</button>
      </form>
      <button type="button">Outside prompt</button>
    </>
  );
}

it('claims Escape only while active focus belongs to its physical form', async () => {
  const scope = createEscapeScope();
  const close = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <EscapeScopeContext.Provider value={scope}>
      <Harness onClose={close} />
    </EscapeScopeContext.Provider>,
  );
  expect(scope.dismiss()).toBe(false);
  const draft = screen.getByRole('textbox', { name: 'Draft' });
  await user.click(draft);
  act(() => {
    expect(scope.dismiss()).toBe(true);
  });
  expect(close).toHaveBeenCalledExactlyOnceWith();
  fireEvent.compositionStart(draft);
  act(() => {
    expect(scope.dismiss()).toBe(true);
  });
  expect(close).toHaveBeenCalledOnce();
  fireEvent.compositionEnd(draft);
  await user.click(screen.getByRole('button', { name: 'Inside prompt' }));
  act(() => {
    scope.dismiss();
  });
  expect(close).toHaveBeenCalledTimes(2);
  await user.click(screen.getByRole('button', { name: 'Outside prompt' }));
  expect(scope.dismiss()).toBe(false);
  await user.click(draft);
  view.unmount();
  expect(scope.dismiss()).toBe(false);
});

it('releases inactive claims and keeps callbacks current', async () => {
  const scope = createEscapeScope();
  const close = vi.fn();
  const newer = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <EscapeScopeContext.Provider value={scope}>
      <Harness onClose={close} />
    </EscapeScopeContext.Provider>,
  );
  await user.click(screen.getByRole('textbox', { name: 'Draft' }));
  view.rerender(
    <EscapeScopeContext.Provider value={scope}>
      <Harness onClose={newer} />
    </EscapeScopeContext.Provider>,
  );
  act(() => {
    scope.dismiss();
  });
  expect(newer).toHaveBeenCalledExactlyOnceWith();
  expect(close).not.toHaveBeenCalled();
  view.rerender(
    <EscapeScopeContext.Provider value={scope}>
      <Harness onClose={close} disabled />
    </EscapeScopeContext.Provider>,
  );
  expect(scope.dismiss()).toBe(false);
  view.rerender(
    <EscapeScopeContext.Provider value={scope}>
      <Harness />
    </EscapeScopeContext.Provider>,
  );
  expect(scope.dismiss()).toBe(false);
  view.rerender(
    <EscapeScopeContext.Provider value={scope}>
      <PortalActiveContext.Provider value={false}>
        <Harness onClose={close} />
      </PortalActiveContext.Provider>
    </EscapeScopeContext.Provider>,
  );
  await user.click(screen.getByRole('textbox', { name: 'Draft' }));
  expect(scope.dismiss()).toBe(false);
  view.rerender(<Harness onClose={close} />);
  await user.click(screen.getByRole('textbox', { name: 'Draft' }));
  expect(close).not.toHaveBeenCalled();
});
