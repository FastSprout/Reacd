import { useState } from 'react';
import type { ChatAttachmentProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-attachment/index.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { useChatLoadingRole } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';

export function SharedChatAttachment({
  name,
  mediaType,
  url,
  description,
  status = CHAT_DEFAULTS.attachmentStatus,
  onRemove,
  disabled,
}: ChatAttachmentProps) {
  const [failedUrl, setFailedUrl] = useState<string>();
  const loadingRole = useChatLoadingRole();
  const image =
    mediaType.startsWith('image/') && url !== undefined && url !== failedUrl;
  return (
    <Card
      className="reacd-node reacd-chat-attachment"
      data-status={status}
      aria-label={name}
    >
      {image ? (
        <img
          className="reacd-chat-file-image"
          src={url}
          alt={name}
          aria-busy={status === 'uploading'}
          decoding="async"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <span className="reacd-chat-file-kind" aria-hidden="true">
          {CHAT_DEFAULTS.fileLabel}
        </span>
      )}
      <span className="reacd-chat-file-description">
        <span className="reacd-chat-file-name" aria-busy={status === 'uploading'}>
          {name}
        </span>
        <span aria-busy={status === 'uploading'}>{description ?? mediaType}</span>
        {status === 'uploading' && (
          <span role={loadingRole}>{CHAT_DEFAULTS.uploadingLabel}</span>
        )}
        {status === 'error' && (
          <span role="alert">{CHAT_DEFAULTS.uploadErrorLabel}</span>
        )}
      </span>
      {onRemove !== undefined && (
        <Button
          className="reacd-button"
          variant="outline"
          type="button"
          disabled={disabled}
          onClick={() => onRemove()}
        >
          {`${CHAT_DEFAULTS.removePrefix} ${name}`}
        </Button>
      )}
    </Card>
  );
}
