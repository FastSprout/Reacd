import { CHAT_FEEDBACK_POLICY } from '../../core/chat-feedback-policy.js';

export function chatFeedbackVariables() {
  return {
    '--reacd-chat-feedback-details': `${CHAT_FEEDBACK_POLICY.detailsRem}rem`,
    '--reacd-chat-feedback-duration': `${CHAT_FEEDBACK_POLICY.pulseDurationMs}ms`,
    '--reacd-chat-feedback-iterations': CHAT_FEEDBACK_POLICY.pulseIterations,
    '--reacd-chat-feedback-decoration': `${CHAT_FEEDBACK_POLICY.decorationBlockPx}px`,
    '--reacd-chat-feedback-rest': CHAT_FEEDBACK_POLICY.decorationOpacity.rest,
    '--reacd-chat-feedback-peak': CHAT_FEEDBACK_POLICY.decorationOpacity.peak,
  };
}
