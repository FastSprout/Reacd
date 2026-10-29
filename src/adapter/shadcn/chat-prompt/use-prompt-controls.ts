import { useContext, useRef, type KeyboardEvent } from 'react';
import type { ChatPromptProps } from '../../../components/chat-prompt/index.js';
import { canSendPrompt, promptKeyIntent } from '../../../core/chat-composer.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_POLICY,
} from '../../../core/chat-composer-policy.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { usePromptEscape } from './use-prompt-escape.js';

export function usePromptControls(properties: ChatPromptProps) {
  const {
    value,
    onSubmit,
    onValueChange,
    onClose,
    onStop,
    onRetry,
    attachments = [],
    status = CHAT_COMPOSER_DEFAULTS.status,
    disabled = CHAT_COMPOSER_DEFAULTS.disabled,
    readOnly = CHAT_COMPOSER_DEFAULTS.readOnly,
    submitOnEnter = CHAT_COMPOSER_DEFAULTS.submitOnEnter,
  } = properties;
  const form = useRef<HTMLFormElement>(null);
  const composing = useRef(false);
  const active = useContext(PortalActiveContext);
  const unavailable = disabled || !active;
  const canSend =
    attachments.every((file) => file.status === undefined || file.status === 'idle') &&
    canSendPrompt(value, attachments.length, status, unavailable, readOnly);
  const submit = () => {
    if (canSend) onSubmit(value);
  };
  const change = (next: string) => {
    if (!unavailable && !readOnly && next.length <= CHAT_COMPOSER_POLICY.maxDraftLength)
      onValueChange(next);
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const intent = promptKeyIntent(
      {
        key: event.key,
        composing: composing.current || event.nativeEvent.isComposing,
        keyCode: event.keyCode,
        shift: event.shiftKey,
        control: event.ctrlKey,
        meta: event.metaKey,
        alt: event.altKey,
      },
      submitOnEnter,
    );
    if (intent === 'submit') {
      event.preventDefault();
      submit();
    } else if (intent === 'close' && onClose !== undefined && !unavailable) {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };
  const { focus, blur } = usePromptEscape(form, composing, onClose, unavailable);
  const compositionStart = () => {
    composing.current = true;
  };
  const compositionEnd = () => {
    composing.current = false;
  };
  return {
    form,
    focus,
    blur,
    keyDown,
    change,
    compositionStart,
    compositionEnd,
    unavailable,
    readOnly,
    status,
    scope: {
      status,
      disabled: unavailable || readOnly,
      canSend,
      submit,
      stop: onStop,
      retry: onRetry,
    },
  };
}
