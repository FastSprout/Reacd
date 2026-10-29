import { CHAT_COMPOSER_POLICY } from '../../core/chat-composer-policy.js';

export function chatComposerVariables() {
  return {
    '--reacd-chat-palette-block': `${CHAT_COMPOSER_POLICY.paletteBlockRem}rem`,
  };
}
