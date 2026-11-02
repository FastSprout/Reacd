import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useId } from 'react';
import type { ChatMessageProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-message/chat-message.props.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import {
  ChatLoadingScopeContext,
  useChatLoadingRole,
} from '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import {
  Message,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from '../vendor/ui/message.js';
import { Bubble, BubbleContent } from '../vendor/ui/bubble.js';
import { Button } from '../vendor/ui/button.js';
import { Badge } from '../vendor/ui/badge.js';
import { FieldDescription, FieldTitle } from '../vendor/ui/field.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatMessageProps = ChatMessageProps;

export function ShadcnChatMessage({
  id,
  author,
  role,
  content,
  attachments,
  actions,
  error,
  status = CHAT_DEFAULTS.messageStatus,
}: ChatMessageProps) {
  const field = useNativeField({});
  const titleId = useId();
  const loadingRole = useChatLoadingRole();
  const busy = status === 'streaming';
  return (
    <Message
      role="article"
      aria-labelledby={titleId}
      align={role === 'user' ? 'end' : 'start'}
      data-message-id={id}
      className="min-w-0 max-w-full"
    >
      <MessageContent>
        <MessageHeader className="min-w-0 flex-wrap gap-2 [overflow-wrap:anywhere]">
          <FieldTitle id={titleId}>{author}</FieldTitle>
          <Badge>{role}</Badge>
        </MessageHeader>
        <ChatLoadingScopeContext value={busy || loadingRole === undefined}>
          <Bubble
            variant={role === 'user' ? 'default' : 'secondary'}
            className="max-w-full"
          >
            <BubbleContent
              aria-busy={busy}
              className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]"
            >
              <FieldDescription aria-busy={busy}>{content}</FieldDescription>
            </BubbleContent>
          </Bubble>
          {attachments?.map((attachment, index) => (
            <ShadcnChatAttachment key={`${attachment.name}-${index}`} {...attachment} />
          ))}
        </ChatLoadingScopeContext>
        {busy && (
          <FieldDescription role={loadingRole}>
            {CHAT_DEFAULTS.streamingLabel}
          </FieldDescription>
        )}
        {status === 'error' && (
          <FieldDescription role="alert">
            {error ?? CHAT_DEFAULTS.errorLabel}
          </FieldDescription>
        )}
        {actions && (
          <MessageFooter className="flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                type="button"
                variant="outline"
                style={{
                  minBlockSize: LAYOUT_POLICY.controlTargetPx,
                  minInlineSize: LAYOUT_POLICY.controlTargetPx,
                }}
                className={WRAPPING_BUTTON_CLASSES}
                disabled={field.blocked || action.disabled}
                onClick={() => action.onPress()}
              >
                {action.label}
              </Button>
            ))}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  );
}
