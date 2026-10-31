import { useId } from 'react';
import type { ChatPromptProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-prompt/index.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';
import { ChatLoadingScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import { TrustedFormBoundary } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-boundary.js';
import { SharedChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { SharedChatPromptSubmit } from
  '../chat-prompt-submit/chat-prompt-submit.adapter.js';
import { usePromptControls } from './use-prompt-controls.js';

export function SharedChatPrompt(properties: ChatPromptProps) {
  const {
    label,
    value,
    placeholder,
    description,
    error,
    footer,
    attachments = [],
    onRemoveAttachment,
  } = properties;
  const id = useId();
  const {
    form,
    focus,
    blur,
    keyDown,
    change,
    compositionStart,
    compositionEnd,
    unavailable,
    readOnly,
    status,
    scope,
  } = usePromptControls(properties);
  const busy = status === 'submitted' || status === 'streaming';
  const describedBy = [
    description === undefined ? '' : `${id}-description`,
    status === 'error' ? `${id}-error` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <TrustedFormBoundary>
      <PromptScopeContext.Provider value={scope}>
        <form
          ref={form}
          className="reacd-node reacd-chat-prompt"
          aria-label={label}
          onFocusCapture={focus}
          onBlurCapture={blur}
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            scope.submit();
          }}
        >
          <ChatLoadingScopeContext value={busy}>
            <div className="reacd-chat-prompt-content" aria-busy={busy}>
              <label htmlFor={id}>{label}</label>
              {description !== undefined && (
                <p id={`${id}-description`}>{description}</p>
              )}
              {attachments.length > 0 && (
                <div className="reacd-chat-prompt-files">
                  {attachments.map(({ id: fileId, removable, ...file }) => (
                    <SharedChatAttachment
                      key={fileId}
                      {...file}
                      disabled={unavailable || readOnly}
                      {...(onRemoveAttachment === undefined || removable === false
                        ? {}
                        : {
                            onRemove: () => onRemoveAttachment(fileId),
                          })}
                    />
                  ))}
                </div>
              )}
              <textarea
                id={id}
                value={value}
                placeholder={placeholder}
                rows={CHAT_COMPOSER_POLICY.rows}
                maxLength={CHAT_COMPOSER_POLICY.maxDraftLength}
                disabled={unavailable}
                readOnly={readOnly}
                aria-invalid={status === 'error'}
                aria-describedby={describedBy || undefined}
                onChange={(event) => change(event.currentTarget.value)}
                onKeyDown={keyDown}
                onCompositionStart={compositionStart}
                onCompositionEnd={compositionEnd}
              />
            </div>
          </ChatLoadingScopeContext>
          {busy && <p role="status">{CHAT_COMPOSER_DEFAULTS.pendingLabel}</p>}
          {status === 'error' && (
            <p role="alert" id={`${id}-error`}>
              {error ?? CHAT_COMPOSER_DEFAULTS.errorMessage}
            </p>
          )}
          <div className="reacd-chat-prompt-actions">
            {footer === undefined ? <SharedChatPromptSubmit /> : footer}
          </div>
        </form>
      </PromptScopeContext.Provider>
    </TrustedFormBoundary>
  );
}
