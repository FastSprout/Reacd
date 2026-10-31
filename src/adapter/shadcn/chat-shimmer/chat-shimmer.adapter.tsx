import type { ChatShimmerProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-shimmer/index.js';
import { CHAT_FEEDBACK_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/chat-feedback-policy.js';

export function ShadcnChatShimmer({
  text,
  active = CHAT_FEEDBACK_DEFAULTS.active,
}: ChatShimmerProps) {
  return (
    <span
      className="reacd-chat-shimmer"
      data-active={active}
      role={active ? 'status' : undefined}
      aria-live={active ? 'polite' : undefined}
    >
      {text}
    </span>
  );
}
