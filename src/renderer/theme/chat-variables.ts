import { CHAT_POLICY } from '../../core/chat-policy.js';

export function chatVariables() {
  return {
    '--reacd-chat-viewport': `${CHAT_POLICY.viewportRem}rem`,
    '--reacd-chat-image': `${CHAT_POLICY.imageRem}rem`,
    '--reacd-chat-file-track': `${CHAT_POLICY.metadataTrackRem}rem`,
  };
}
