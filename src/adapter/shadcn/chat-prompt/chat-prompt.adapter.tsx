import { useContext, useId } from 'react';
import { useForm } from 'react-hook-form';
import type { ChatPromptProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-prompt/chat-prompt.props.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';
import {
  canSendPrompt,
  promptKeyIntent,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer.js';
import { CHAT_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { FRAMEWORK_ERRORS } from '@fastsprout/reacd/adapter-runtime/core/errors.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import {
  ChatLoadingScopeContext,
  useChatLoadingRole,
} from '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { Form } from '../vendor/ui/form.js';
import { Card, CardContent, CardFooter } from '../vendor/ui/card.js';
import { FieldContent, FieldDescription } from '../vendor/ui/field.js';
import { Label } from '../vendor/ui/label.js';
import { Textarea } from '../vendor/ui/textarea.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { ShadcnChatPromptSubmit } from
  '../chat-prompt-submit/chat-prompt-submit.adapter.js';

export type ShadcnChatPromptProps = ChatPromptProps;

export function ShadcnChatPrompt({
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
  const form = useForm();
  const insideForm = useContext(FormScopeContext);
  const field = useNativeField({ disabled });
  const loadingRole = useChatLoadingRole();
  if (insideForm) throw new Error(FRAMEWORK_ERRORS.nestedForm);
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
  const remove = onRemoveAttachment;
  const submit = () => {
    if (canSend) onSubmit(value);
  };
  const descriptionId = description === undefined ? undefined : `${id}-help`;
  const errorId = status === 'error' ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <Form {...form}>
      <form
        aria-label={label}
        onSubmit={(event) => {
          event.stopPropagation();
          void form.handleSubmit(submit)(event);
        }}
      >
        <FormScopeContext value={true}>
          <PromptScopeContext
            value={{
              status,
              disabled: protectedInput,
              canSend,
              submit,
              stop: onStop,
              retry: onRetry,
            }}
          >
            <Card className="min-w-0 max-w-full">
              <ChatLoadingScopeContext value={busy || loadingRole === undefined}>
                <CardContent className="grid min-w-0 gap-3 pt-6" aria-busy={busy}>
                  <Label htmlFor={id}>{label}</Label>
                  <Textarea
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    rows={CHAT_COMPOSER_POLICY.rows}
                    maxLength={CHAT_COMPOSER_POLICY.maxDraftLength}
                    disabled={field.disabled}
                    readOnly={readOnly}
                    aria-invalid={status === 'error'}
                    aria-describedby={describedBy}
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
                    <FieldDescription id={descriptionId}>
                      {description}
                    </FieldDescription>
                  )}
                  {files.map(({ id: fileId, removable, ...file }) => (
                    <ShadcnChatAttachment
                      key={fileId}
                      {...file}
                      disabled={protectedInput}
                      onRemove={
                        remove === undefined || removable === false
                          ? undefined
                          : () => remove(fileId)
                      }
                    />
                  ))}
                </CardContent>
              </ChatLoadingScopeContext>
              <CardContent>
                <FieldContent>
                  {busy && (
                    <FieldDescription role={loadingRole}>
                      {status === 'submitted'
                        ? CHAT_DEFAULTS.submittedLabel
                        : CHAT_DEFAULTS.streamingLabel}
                    </FieldDescription>
                  )}
                  {status === 'error' && (
                    <FieldDescription role="alert" id={errorId}>
                      {error ?? CHAT_COMPOSER_DEFAULTS.errorMessage}
                    </FieldDescription>
                  )}
                </FieldContent>
              </CardContent>
              <CardFooter className="min-w-0 flex-wrap gap-2">
                {footer === undefined ? <ShadcnChatPromptSubmit /> : footer}
              </CardFooter>
            </Card>
          </PromptScopeContext>
        </FormScopeContext>
      </form>
    </Form>
  );
}
