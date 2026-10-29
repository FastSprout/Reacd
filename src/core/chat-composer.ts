import type { CHAT_STATUSES } from './chat-policy.js';
import { CHAT_COMPOSER_POLICY } from './chat-composer-policy.js';

export type ChatComposerStatus = (typeof CHAT_STATUSES)[number];

export interface PromptKey {
  key: string;
  composing: boolean;
  keyCode: number;
  shift: boolean;
  control: boolean;
  meta: boolean;
  alt: boolean;
}

export function canSendPrompt(
  value: string,
  attachmentCount: number,
  status: ChatComposerStatus,
  disabled: boolean,
  readOnly: boolean,
): boolean {
  return (
    !disabled &&
    !readOnly &&
    status === 'ready' &&
    (value.trim().length > 0 || attachmentCount > 0)
  );
}

export function promptKeyIntent(
  input: PromptKey,
  submitOnEnter: boolean,
): 'submit' | 'close' | 'none' {
  if (input.composing || input.keyCode === CHAT_COMPOSER_POLICY.compositionKeyCode)
    return 'none';
  if (input.key === 'Escape') return 'close';
  if (input.key !== 'Enter' || input.shift || input.alt) return 'none';
  return submitOnEnter || input.control || input.meta ? 'submit' : 'none';
}
