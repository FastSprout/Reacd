import type { ChatReasoningProps } from '../../../components/chat-reasoning/index.js';
import { CHAT_FEEDBACK_DEFAULTS } from '../../../core/chat-feedback-policy.js';
import { ChatDisclosure } from '../chat-disclosure/chat-disclosure.js';
import { useReasoningDisclosure } from './use-reasoning-disclosure.js';

export function ShadcnChatReasoning({
  text,
  open,
  onOpenChange,
  label = CHAT_FEEDBACK_DEFAULTS.reasoningLabel,
  streaming = CHAT_FEEDBACK_DEFAULTS.streaming,
  autoOpen = CHAT_FEEDBACK_DEFAULTS.autoOpen,
  autoClose = CHAT_FEEDBACK_DEFAULTS.autoClose,
  disabled = CHAT_FEEDBACK_DEFAULTS.disabled,
}: ChatReasoningProps) {
  const change = useReasoningDisclosure({
    open,
    onOpenChange,
    streaming,
    autoOpen,
    autoClose,
    disabled,
  });
  return (
    <div className="reacd-node reacd-chat-reasoning">
      <ChatDisclosure
        label={label}
        open={open}
        onOpenChange={change}
        disabled={disabled}
        active={streaming}
      >
        <p className="reacd-chat-feedback-text">
          {text.trim() === '' ? CHAT_FEEDBACK_DEFAULTS.emptyReasoning : text}
        </p>
      </ChatDisclosure>
    </div>
  );
}
