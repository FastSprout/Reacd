import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { File } from 'lucide-react';
import type { ChatAttachmentProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-attachment/index.js';
import {
  CHAT_DEFAULTS,
  CHAT_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { useChatLoadingRole } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { Avatar, AvatarFallback, AvatarImage } from '../vendor/ui/avatar.js';
import {
  Attachment,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentActions,
  AttachmentAction,
} from '../vendor/ui/attachment.js';
import { FieldContent, FieldDescription } from '../vendor/ui/field.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatAttachmentProps = ChatAttachmentProps;

export function ShadcnChatAttachment({
  name,
  mediaType,
  url,
  description,
  onRemove,
  disabled,
  status = CHAT_DEFAULTS.attachmentStatus,
}: ChatAttachmentProps) {
  const field = useNativeField({ disabled });
  const loadingRole = useChatLoadingRole();
  const busy = status === 'uploading';
  const image = mediaType.startsWith('image/');
  return (
    <FieldContent className="min-w-0 max-w-full">
      <Attachment
        role="group"
        aria-label={name}
        state={status === 'idle' ? 'done' : status}
        className="min-w-0"
      >
        <AttachmentMedia
          variant={image ? 'image' : 'icon'}
          style={image ? { inlineSize: `${CHAT_POLICY.imageRem}rem` } : undefined}
        >
          {image ? (
            <Avatar
              role="img"
              aria-label={name}
              aria-busy={busy}
              style={{
                inlineSize: `${CHAT_POLICY.imageRem}rem`,
                blockSize: `${CHAT_POLICY.imageRem}rem`,
              }}
            >
              <AvatarImage src={url} alt="" />
              <AvatarFallback>
                <File aria-hidden />
              </AvatarFallback>
            </Avatar>
          ) : (
            <File aria-hidden />
          )}
        </AttachmentMedia>
        <AttachmentContent aria-busy={busy}>
          <AttachmentTitle
            className={'whitespace-normal overflow-visible [overflow-wrap:anywhere]'}
          >
            {name}
          </AttachmentTitle>
          <AttachmentDescription
            className={'whitespace-normal overflow-visible [overflow-wrap:anywhere]'}
          >
            {description ?? mediaType}
          </AttachmentDescription>
        </AttachmentContent>
        {onRemove !== undefined && (
          <AttachmentActions className="min-w-0 max-w-full flex-wrap">
            <AttachmentAction
              type="button"
              style={{
                minBlockSize: LAYOUT_POLICY.controlTargetPx,
                minInlineSize: LAYOUT_POLICY.controlTargetPx,
              }}
              size="sm"
              disabled={field.blocked}
              className={
                'h-auto min-h-8 min-w-0 max-w-full whitespace-normal ' +
                '[overflow-wrap:anywhere]'
              }
              onClick={() => onRemove()}
            >
              {`${CHAT_DEFAULTS.removePrefix} ${name}`}
            </AttachmentAction>
          </AttachmentActions>
        )}
      </Attachment>
      {busy && (
        <FieldDescription role={loadingRole}>
          {CHAT_DEFAULTS.uploadingLabel}
        </FieldDescription>
      )}
      {status === 'error' && (
        <FieldDescription role="alert">
          {CHAT_DEFAULTS.uploadErrorLabel}
        </FieldDescription>
      )}
    </FieldContent>
  );
}
