import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useContext } from 'react';
import type { ChatPromptSubmitProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-prompt-submit/index.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_ERRORS,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatPromptSubmitProps = ChatPromptSubmitProps;

export function ShadcnChatPromptSubmit(props: ChatPromptSubmitProps) {
  const scope = useContext(PromptScopeContext);
  const field = useNativeField(props);
  if (
    scope !== null &&
    (props.status !== undefined ||
      props.onSubmit !== undefined ||
      props.onStop !== undefined ||
      props.onRetry !== undefined)
  ) {
    throw new Error(CHAT_COMPOSER_ERRORS.conflictingScope);
  }
  const status = scope?.status ?? props.status ?? CHAT_COMPOSER_DEFAULTS.status;
  const submit = scope?.submit ?? props.onSubmit;
  const stop = scope?.stop ?? props.onStop;
  const retry = scope?.retry ?? props.onRetry;
  if (scope === null && status === 'ready' && submit === undefined)
    throw new Error(CHAT_COMPOSER_ERRORS.missingScope);
  const pending = status === 'submitted' || status === 'streaming';
  const action = pending ? stop : status === 'error' ? retry : submit;
  const label = pending
    ? stop === undefined
      ? CHAT_COMPOSER_DEFAULTS.pendingLabel
      : CHAT_COMPOSER_DEFAULTS.stopLabel
    : status === 'error'
      ? retry === undefined
        ? CHAT_COMPOSER_DEFAULTS.unavailableLabel
        : CHAT_COMPOSER_DEFAULTS.retryLabel
      : CHAT_COMPOSER_DEFAULTS.sendLabel;
  const blocked =
    field.blocked ||
    Boolean(scope?.disabled) ||
    action === undefined ||
    (status === 'ready' && scope !== null && !scope.canSend);
  return (
    <Button
      style={{
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
        minInlineSize: LAYOUT_POLICY.controlTargetPx,
      }}
      className={WRAPPING_BUTTON_CLASSES}
      type="button"
      disabled={blocked}
      onClick={action === undefined ? undefined : () => action()}
    >
      {props.label ?? label}
    </Button>
  );
}
