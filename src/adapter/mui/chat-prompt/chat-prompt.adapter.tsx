import { useId } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { ChatPromptProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-prompt/chat-prompt.props.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import {
  canSendPrompt,
  promptKeyIntent,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer.js';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import {
  ChatLoadingScopeContext,
  useChatLoadingRole,
} from '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { MuiForm } from '../form/form.adapter.js';
import { useNativeField } from '../native-field.js';
import { MuiPromptAction } from './prompt-action.js';
import { MuiPromptAttachment } from './prompt-attachment.js';

export type MuiChatPromptProps = ChatPromptProps;

export function MuiChatPrompt({
  label,
  value,
  onValueChange,
  onSubmit,
  onStop,
  onRetry,
  onClose,
  description,
  placeholder,
  error,
  disabled,
  readOnly,
  attachments,
  onRemoveAttachment,
  footer,
  status = CHAT_COMPOSER_DEFAULTS.status,
  submitOnEnter = CHAT_COMPOSER_DEFAULTS.submitOnEnter,
}: ChatPromptProps) {
  const id = useId();
  const field = useNativeField({ disabled });
  const loadingRole = useChatLoadingRole();
  const protectedInput = field.blocked || Boolean(readOnly);
  const files = attachments ?? [];
  const readyFiles = files.every(
    (file) =>
      file.status === undefined || file.status === CHAT_DEFAULTS.attachmentStatus,
  );
  const canSend =
    readyFiles &&
    canSendPrompt(value, files.length, status, protectedInput, Boolean(readOnly));
  const busy = status === 'submitted' || status === 'streaming';
  const submit = () => {
    if (canSend) onSubmit(value);
  };
  const scope = {
    status,
    disabled: protectedInput,
    canSend,
    submit,
    stop: onStop,
    retry: onRetry,
  };
  const errorId = status === 'error' ? `${id}-error` : undefined;
  const descriptionId = description === undefined ? undefined : `${id}-help`;
  return (
    <MuiForm label={label} disabled={field.disabled} onSubmit={submit}>
      <PromptScopeContext value={scope}>
        <Card>
          <CardContent aria-busy={busy}>
            <ChatLoadingScopeContext value={busy || loadingRole === undefined}>
              <Stack>
                <TextField
                  id={id}
                  multiline
                  fullWidth
                  label={label}
                  value={value}
                  placeholder={placeholder}
                  minRows={CHAT_COMPOSER_POLICY.rows}
                  disabled={field.disabled}
                  error={status === 'error'}
                  inert={field.blocked}
                  slotProps={{
                    input: { readOnly: protectedInput },
                    htmlInput: {
                      maxLength: CHAT_COMPOSER_POLICY.maxDraftLength,
                      'aria-describedby':
                        [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
                    },
                  }}
                  onChange={(event) => {
                    if (!protectedInput) onValueChange(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (protectedInput) return;
                    const intent = promptKeyIntent(
                      {
                        key: event.key,
                        composing: event.nativeEvent.isComposing,
                        keyCode: event.keyCode,
                        shift: event.shiftKey,
                        control: event.ctrlKey,
                        meta: event.metaKey,
                        alt: event.altKey,
                      },
                      submitOnEnter,
                    );
                    if (intent === 'submit') {
                      event.preventDefault();
                      submit();
                    }
                    if (intent === 'close' && onClose !== undefined) {
                      event.preventDefault();
                      event.stopPropagation();
                      onClose();
                    }
                  }}
                />
                {description !== undefined && (
                  <Typography id={descriptionId}>{description}</Typography>
                )}
                {files.map((file) => (
                  <MuiPromptAttachment
                    key={file.id}
                    file={file}
                    disabled={protectedInput}
                    onRemove={onRemoveAttachment}
                  />
                ))}
              </Stack>
            </ChatLoadingScopeContext>
          </CardContent>
          {busy && (
            <CardContent>
              <Typography role={loadingRole}>
                {status === 'submitted'
                  ? CHAT_DEFAULTS.submittedLabel
                  : CHAT_DEFAULTS.streamingLabel}
              </Typography>
            </CardContent>
          )}
          {status === 'error' && (
            <CardContent>
              <Typography role="alert" id={errorId}>
                {error ?? CHAT_COMPOSER_DEFAULTS.errorMessage}
              </Typography>
            </CardContent>
          )}
          <CardActions>
            {footer === undefined ? <MuiPromptAction scope={scope} /> : footer}
          </CardActions>
        </Card>
      </PromptScopeContext>
    </MuiForm>
  );
}
