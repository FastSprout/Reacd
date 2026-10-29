import { useId } from 'react';
import type { ChatMessageProps } from '../../../components/chat-message/index.js';
import { CHAT_DEFAULTS } from '../../../core/chat-policy.js';
import { useChatLoadingRole } from '../../../renderer/chat-feedback/loading-scope.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { Button } from '../vendor/ui/button.js';
import { Card } from '../vendor/ui/card.js';

export function ShadcnChatMessage({
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
                <ShadcnChatAttachment {...attachment} />
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
