import type { ChatShimmerProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-shimmer/chat-shimmer.props.js';
import {
  CHAT_FEEDBACK_DEFAULTS,
  CHAT_FEEDBACK_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-feedback-policy.js';
import { useChatLoadingRole } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { FieldContent, FieldDescription } from '../vendor/ui/field.js';
import { Skeleton } from '../vendor/ui/skeleton.js';

export type ShadcnChatShimmerProps = ChatShimmerProps;

export function ShadcnChatShimmer({
  text,
  active = CHAT_FEEDBACK_DEFAULTS.active,
}: ChatShimmerProps) {
  const loadingRole = useChatLoadingRole();
  return (
    <FieldContent
      role={active ? loadingRole : undefined}
      className="min-w-0 max-w-full"
    >
      <FieldDescription className="[overflow-wrap:anywhere]">{text}</FieldDescription>
      {active && (
        <Skeleton
          aria-hidden
          className="bg-foreground motion-reduce:animate-none"
          style={{
            blockSize: CHAT_FEEDBACK_POLICY.decorationBlockPx,
            animationDuration: `${CHAT_FEEDBACK_POLICY.pulseDurationMs}ms`,
            animationIterationCount: CHAT_FEEDBACK_POLICY.pulseIterations,
          }}
        />
      )}
    </FieldContent>
  );
}
