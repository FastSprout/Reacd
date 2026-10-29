import { useId } from 'react';
import type { ChatPromptProps } from '../../../components/chat-prompt/index.js';
import {
  CHAT_COMPOSER_DEFAULTS,
  CHAT_COMPOSER_POLICY,
} from '../../../core/chat-composer-policy.js';
import {
  ChatLoadingScopeContext,
} from '../../../renderer/chat-feedback/loading-scope.js';
import { PromptScopeContext } from '../../../renderer/chat-prompt/prompt-context.js';
import { TrustedFormBoundary } from '../../../renderer/form/form-boundary.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import {
  ShadcnChatPromptSubmit,
} from '../chat-prompt-submit/chat-prompt-submit.adapter.js';
import { usePromptControls } from './use-prompt-controls.js';

export function ShadcnChatPrompt(properties: ChatPromptProps) {
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
                    <ShadcnChatAttachment
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
            {footer === undefined ? <ShadcnChatPromptSubmit /> : footer}
          </div>
        </form>
      </PromptScopeContext.Provider>
    </TrustedFormBoundary>
  );
}
