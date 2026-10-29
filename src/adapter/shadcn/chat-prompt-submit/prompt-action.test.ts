import { expect, it, vi } from 'vitest';
import { success } from '../../../../test-support/data-table.js';
import { resolvePromptAction } from './prompt-action.js';

const scope = {
  status: 'ready',
  canSend: true,
  disabled: false,
  submit: vi.fn(),
  stop: undefined,
  retry: undefined,
} as const;

it('resolves explicit standalone capabilities without invoking them', () => {
  const action = vi.fn();
  expect(resolvePromptAction({}, null).success).toBe(false);
  expect(success(resolvePromptAction({ onSubmit: action }, null))).toMatchObject({
    label: 'Send message',
    disabled: false,
    run: action,
  });
  for (const status of ['submitted', 'streaming'] as const) {
    expect(success(resolvePromptAction({ status }, null))).toMatchObject({
      label: 'Response in progress',
      disabled: true,
    });
    expect(
      success(resolvePromptAction({ status, onStop: action }, null)),
    ).toMatchObject({ label: 'Stop response', disabled: false, run: action });
  }
  expect(success(resolvePromptAction({ status: 'error' }, null))).toMatchObject({
    label: 'Retry unavailable',
    disabled: true,
  });
  expect(
    success(resolvePromptAction({ status: 'error', onRetry: action }, null)),
  ).toMatchObject({ label: 'Retry response', disabled: false, run: action });
  expect(action).not.toHaveBeenCalled();
});

it('inherits scope and prevents capabilities/status from bypassing its gate', () => {
  expect(success(resolvePromptAction({}, scope)).run).toBe(scope.submit);
  expect(success(resolvePromptAction({}, { ...scope, canSend: false })).disabled).toBe(
    true,
  );
  expect(success(resolvePromptAction({}, { ...scope, disabled: true })).disabled).toBe(
    true,
  );
  expect(success(resolvePromptAction({ disabled: true }, scope)).disabled).toBe(true);
  expect(success(resolvePromptAction({ label: 'Send draft' }, scope)).label).toBe(
    'Send draft',
  );
  for (const properties of [
    { status: 'streaming' },
    { onSubmit() {} },
    { onStop() {} },
    { onRetry() {} },
  ] as const)
    expect(resolvePromptAction(properties, scope).success).toBe(false);
  expect(success(resolvePromptAction({ status: 'ready' }, scope)).disabled).toBe(false);
  expect(
    success(
      resolvePromptAction({}, { ...scope, status: 'streaming', stop: scope.submit }),
    ).run,
  ).toBe(scope.submit);
  expect(
    success(resolvePromptAction({}, { ...scope, status: 'error', retry: scope.submit }))
      .run,
  ).toBe(scope.submit);
});
