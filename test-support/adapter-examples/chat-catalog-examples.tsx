import { CHAT_EXAMPLES } from './chat-examples.js';
import { CHAT_FEEDBACK_EXAMPLES } from './chat-feedback-examples.js';
import { CHAT_COMPOSER_EXAMPLES } from './chat-composer-examples.js';

export const CHAT_CATALOG_EXAMPLES = {
  ...CHAT_EXAMPLES,
  ...CHAT_FEEDBACK_EXAMPLES,
  ...CHAT_COMPOSER_EXAMPLES,
} as const;
