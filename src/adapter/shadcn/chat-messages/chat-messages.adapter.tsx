import type { ChatMessagesProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-messages/chat-messages.props.js';
import {
  CHAT_DEFAULTS,
  CHAT_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import {
  ChatLoadingScopeContext,
  useChatLoadingRole,
} from '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { CardFooter } from '../vendor/ui/card.js';
import { FieldContent, FieldDescription } from '../vendor/ui/field.js';
import { Button } from '../vendor/ui/button.js';
import {
  MessageScroller,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  useMessageScroller,
} from '../vendor/ui/message-scroller.js';
import { ShadcnChatMessage } from '../chat-message/chat-message.adapter.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatMessagesProps = ChatMessagesProps;

function LatestButton() {
  const { scrollToEnd } = useMessageScroller();
  const field = useNativeField({});
  return (
    <Button
      type="button"
      variant="outline"
      className={
        'h-auto min-h-9 min-w-0 max-w-full whitespace-normal ' +
        '[overflow-wrap:anywhere]'
      }
      disabled={field.blocked}
      onClick={() => {
        scrollToEnd({ behavior: 'auto' });
      }}
    >
      {CHAT_DEFAULTS.latestLabel}
    </Button>
  );
}

export function ShadcnChatMessages({
  label,
  messages,
  error,
  onRetry,
  status = CHAT_DEFAULTS.status,
  emptyLabel = CHAT_DEFAULTS.emptyLabel,
  followLatest = CHAT_DEFAULTS.followLatest,
}: ChatMessagesProps) {
  const field = useNativeField({});
  const loadingRole = useChatLoadingRole();
  const busy = status === 'submitted' || status === 'streaming';
  return (
    <MessageScrollerProvider
      autoScroll={followLatest}
      defaultScrollPosition={followLatest ? 'end' : 'start'}
      scrollEdgeThreshold={CHAT_POLICY.bottomDistancePx}
    >
      <FieldContent className="min-w-0 max-w-full">
        <MessageScroller style={{ blockSize: `${CHAT_POLICY.viewportRem}rem` }}>
          <MessageScrollerViewport aria-label={label}>
            <ChatLoadingScopeContext value={busy || loadingRole === undefined}>
              <MessageScrollerContent
                aria-label={label}
                aria-live="polite"
                aria-busy={busy}
              >
                {messages.length === 0 && (
                  <MessageScrollerItem>
                    <FieldDescription>{emptyLabel}</FieldDescription>
                  </MessageScrollerItem>
                )}
                {messages.map((message) => (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
                    <ShadcnChatMessage {...message} />
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </ChatLoadingScopeContext>
          </MessageScrollerViewport>
        </MessageScroller>
        {busy && (
          <FieldDescription role={loadingRole}>
            {status === 'submitted'
              ? CHAT_DEFAULTS.submittedLabel
              : CHAT_DEFAULTS.streamingLabel}
          </FieldDescription>
        )}
        {status === 'error' && (
          <FieldDescription role="alert">
            {error ?? CHAT_DEFAULTS.errorLabel}
          </FieldDescription>
        )}
        <CardFooter className="min-w-0 max-w-full flex-wrap gap-2 p-0">
          {followLatest && <LatestButton />}
          {status === 'error' && onRetry !== undefined && (
            <Button type="button" disabled={field.blocked} onClick={() => onRetry()}
              className={
                'h-auto min-h-9 min-w-0 max-w-full whitespace-normal ' +
                '[overflow-wrap:anywhere]'
              }>
              {CHAT_DEFAULTS.retryLabel}
            </Button>
          )}
        </CardFooter>
      </FieldContent>
    </MessageScrollerProvider>
  );
}
