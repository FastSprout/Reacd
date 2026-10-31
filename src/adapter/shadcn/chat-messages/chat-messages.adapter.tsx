import type { ChatMessagesProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-messages/index.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { ChatLoadingScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { ShadcnChatMessage } from '../chat-message/chat-message.adapter.js';
import { Button } from '../vendor/ui/button.js';
import { useFollowLatest } from './use-follow-latest.js';

export function ShadcnChatMessages({
  label,
  messages,
  status = CHAT_DEFAULTS.status,
  error,
  onRetry,
  followLatest = CHAT_DEFAULTS.followLatest,
  emptyLabel = CHAT_DEFAULTS.emptyLabel,
}: ChatMessagesProps) {
  const { viewport, latest, scroll, showLatest } = useFollowLatest(
    followLatest,
    messages,
    status,
  );
  const pending = status === 'submitted' || status === 'streaming';
  return (
    <section className="reacd-node reacd-chat-messages" aria-label={label}>
      <ChatLoadingScopeContext value={pending}>
        <div
          className="reacd-chat-log"
          ref={viewport}
          role="log"
          aria-label={label}
          aria-live="polite"
          aria-atomic="false"
          aria-busy={pending}
          tabIndex={0}
          onScroll={scroll}
        >
          {messages.length === 0 && status === 'ready' && <p>{emptyLabel}</p>}
          {messages.map((message) => (
            <ShadcnChatMessage key={message.id} {...message} />
          ))}
        </div>
      </ChatLoadingScopeContext>
      {pending && (
        <p role="status">
          {status === 'submitted'
            ? CHAT_DEFAULTS.submittedLabel
            : CHAT_DEFAULTS.streamingLabel}
        </p>
      )}
      {status === 'error' && (
        <div className="reacd-chat-error">
          <p role="alert">{error ?? CHAT_DEFAULTS.errorLabel}</p>
          {onRetry !== undefined && (
            <Button className="reacd-button" type="button" onClick={() => onRetry()}>
              {CHAT_DEFAULTS.retryLabel}
            </Button>
          )}
        </div>
      )}
      {showLatest && (
        <Button
          className="reacd-button"
          variant="outline"
          type="button"
          onClick={latest}
        >
          {CHAT_DEFAULTS.latestLabel}
        </Button>
      )}
    </section>
  );
}
