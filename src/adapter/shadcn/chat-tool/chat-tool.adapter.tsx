import type { ChatToolProps } from '../../../components/chat-tool/index.js';
import {
  CHAT_FEEDBACK_DEFAULTS,
  CHAT_TOOL_LABELS,
} from '../../../core/chat-feedback-policy.js';
import { ChatDisclosure } from '../chat-disclosure/chat-disclosure.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnChatTool({
  label,
  status,
  open,
  onOpenChange,
  input,
  output,
  error,
  disabled,
  onApprove,
  onReject,
  onRetry,
}: ChatToolProps) {
  return (
    <section className="reacd-node reacd-chat-tool" aria-label={label}>
      <p role={status === 'error' ? 'alert' : 'status'}>{CHAT_TOOL_LABELS[status]}</p>
      <ChatDisclosure
        label={label}
        open={open}
        onOpenChange={onOpenChange}
        disabled={disabled}
        active={status === 'running'}
      >
        {input !== undefined && <pre className="reacd-chat-feedback-text">{input}</pre>}
        {output !== undefined && (
          <pre className="reacd-chat-feedback-text">{output}</pre>
        )}
        {error !== undefined && <p className="reacd-chat-feedback-text">{error}</p>}
        {input === undefined && output === undefined && error === undefined && (
          <p>{CHAT_FEEDBACK_DEFAULTS.emptyTool}</p>
        )}
      </ChatDisclosure>
      {status === 'approval' && onApprove !== undefined && onReject !== undefined && (
        <div className="reacd-chat-actions" role="group" aria-label="Tool approval">
          <Button
            className="reacd-button"
            type="button"
            onClick={() => onApprove()}
            disabled={disabled}
          >
            {CHAT_FEEDBACK_DEFAULTS.approveLabel}
          </Button>
          <Button
            className="reacd-button"
            variant="outline"
            type="button"
            onClick={() => onReject()}
            disabled={disabled}
          >
            {CHAT_FEEDBACK_DEFAULTS.rejectLabel}
          </Button>
        </div>
      )}
      {status === 'error' && onRetry !== undefined && (
        <Button
          className="reacd-button"
          type="button"
          onClick={() => onRetry()}
          disabled={disabled}
        >
          {CHAT_FEEDBACK_DEFAULTS.retryLabel}
        </Button>
      )}
    </section>
  );
}
