import Button from '@mui/material/Button';
import type { PromptScope } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import { CHAT_COMPOSER_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';

export function MuiPromptAction({ scope }: { readonly scope: PromptScope }) {
  const busy = scope.status === 'submitted' || scope.status === 'streaming';
  const action = busy
    ? scope.stop
    : scope.status === 'error'
      ? scope.retry
      : scope.submit;
  const label = busy
    ? scope.stop === undefined
      ? CHAT_COMPOSER_DEFAULTS.pendingLabel
      : CHAT_COMPOSER_DEFAULTS.stopLabel
    : scope.status === 'error'
      ? scope.retry === undefined
        ? CHAT_COMPOSER_DEFAULTS.unavailableLabel
        : CHAT_COMPOSER_DEFAULTS.retryLabel
      : CHAT_COMPOSER_DEFAULTS.sendLabel;
  return (
    <Button
      type="button"
      variant="contained"
      disabled={
        scope.disabled ||
        action === undefined ||
        (scope.status === 'ready' && !scope.canSend)
      }
      onClick={action === undefined ? undefined : () => action()}
    >
      {label}
    </Button>
  );
}
