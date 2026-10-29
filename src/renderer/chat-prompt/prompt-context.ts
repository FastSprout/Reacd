import { createContext } from 'react';
import type { ChatComposerStatus } from '../../core/chat-composer.js';

export interface PromptScope {
  readonly status: ChatComposerStatus;
  readonly disabled: boolean;
  readonly canSend: boolean;
  readonly submit: () => void;
  readonly stop: (() => void) | undefined;
  readonly retry: (() => void) | undefined;
}

export const PromptScopeContext = createContext<PromptScope | null>(null);
