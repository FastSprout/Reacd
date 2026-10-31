import { useId } from 'react';
import type { ChatMessageProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-message/index.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { useChatLoadingRole } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { SharedChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';

export function SharedChatMessage({
  id,
  author,
  role,
  content,
  attachments,
  actions,
  status = CHAT_DEFAULTS.messageStatus,
  error,
}: ChatMessageProps) {
  const authorId = useId();
  const loadingRole = useChatLoadingRole();
  return (
    <article
      className="reacd-node reacd-chat-message"
      data-message-id={id}
      data-role={role}
      data-status={status}
      aria-labelledby={authorId}
    >
      <Card className="reacd-chat-message-content">
        <header className="reacd-chat-message-author">
          <strong id={authorId}>{author}</strong>
          <span>{role}</span>
        </header>
        <p className="reacd-chat-message-text" aria-busy={status === 'streaming'}>
          {content}
        </p>
        {attachments !== undefined && (
          <ul className="reacd-chat-attachments" aria-label="Message attachments">
            {attachments.map((attachment, index) => (
              <li key={index}>
                <SharedChatAttachment {...attachment} />
              </li>
            ))}
          </ul>
        )}
        {status === 'streaming' && (
          <p role={loadingRole}>{CHAT_DEFAULTS.streamingLabel}</p>
        )}
        {status === 'error' && <p role="alert">{error ?? CHAT_DEFAULTS.errorLabel}</p>}
        {actions !== undefined && (
          <div className="reacd-chat-actions" role="group" aria-label="Message actions">
            {actions.map((action) => (
              <Button
                key={action.id}
                className="reacd-button"
                variant="outline"
                type="button"
                onClick={() => action.onPress()}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </article>
  );
}
