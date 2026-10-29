import type { ChatPromptSubmitProps } from '../../../components/index.js';
import type { ChatComposerStatus } from '../../../core/chat-composer.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_ERRORS,
} from '../../../core/chat-composer-policy.js';
import type { Result } from '../../../core/result.js';
import type { PromptScope } from '../../../renderer/chat-prompt/prompt-context.js';

interface PromptAction {
  label: string;
  disabled: boolean;
  status: ChatComposerStatus;
  run: (() => void) | undefined;
}

export function resolvePromptAction(
  properties: ChatPromptSubmitProps,
  scope: PromptScope | null,
): Result<PromptAction> {
  if (
    scope !== null &&
    ((properties.status !== undefined && properties.status !== scope.status) ||
      properties.onSubmit !== undefined ||
      properties.onStop !== undefined ||
      properties.onRetry !== undefined)
  )
    return {
      success: false,
      issues: [
        { path: 'ChatPromptSubmit', message: CHAT_COMPOSER_ERRORS.conflictingScope },
      ],
    };
  const status = scope?.status ?? properties.status ?? CHAT_COMPOSER_DEFAULTS.status;
  const busy = status === 'submitted' || status === 'streaming';
  const run = busy
    ? (scope?.stop ?? properties.onStop)
    : status === 'error'
      ? (scope?.retry ?? properties.onRetry)
      : (scope?.submit ?? properties.onSubmit);
  if (scope === null && status === 'ready' && run === undefined)
    return {
      success: false,
      issues: [
        { path: 'ChatPromptSubmit', message: CHAT_COMPOSER_ERRORS.missingScope },
      ],
    };
  const label = busy
    ? run === undefined
      ? CHAT_COMPOSER_DEFAULTS.pendingLabel
      : CHAT_COMPOSER_DEFAULTS.stopLabel
    : status === 'error'
      ? run === undefined
        ? CHAT_COMPOSER_DEFAULTS.unavailableLabel
        : CHAT_COMPOSER_DEFAULTS.retryLabel
      : CHAT_COMPOSER_DEFAULTS.sendLabel;
  const disabled =
    properties.disabled === true ||
    scope?.disabled === true ||
    run === undefined ||
    (status === 'ready' && scope?.canSend === false);
  return {
    success: true,
    data: { status, disabled, run, label: properties.label ?? label },
  };
}
