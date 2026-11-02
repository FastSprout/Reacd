import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useEffect, useRef } from 'react';
import type { ChatReasoningProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-reasoning/chat-reasoning.props.js';
import {
  CHAT_FEEDBACK_DEFAULTS,
  CHAT_FEEDBACK_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-feedback-policy.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../vendor/ui/collapsible.js';
import { FieldDescription } from '../vendor/ui/field.js';
import { ScrollArea } from '../vendor/ui/scroll-area.js';
import { Button } from '../vendor/ui/button.js';
import { ShadcnChatShimmer } from '../chat-shimmer/chat-shimmer.adapter.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatReasoningProps = ChatReasoningProps;

export function ShadcnChatReasoning({
  text,
  open,
  onOpenChange,
  label = CHAT_FEEDBACK_DEFAULTS.reasoningLabel,
  streaming = CHAT_FEEDBACK_DEFAULTS.streaming,
  autoOpen = CHAT_FEEDBACK_DEFAULTS.autoOpen,
  autoClose = CHAT_FEEDBACK_DEFAULTS.autoClose,
  disabled,
}: ChatReasoningProps) {
  const field = useNativeField({ disabled });
  const previousStream = useRef(false);
  const manuallyChanged = useRef(false);
  useEffect(() => {
    const changed = previousStream.current !== streaming;
    previousStream.current = streaming;
    if (!changed) return;
    if (streaming) {
      manuallyChanged.current = false;
      if (autoOpen && !field.blocked && !open) onOpenChange(true);
    } else if (autoClose && !field.blocked && !manuallyChanged.current && open) {
      onOpenChange(false);
    }
  }, [streaming, autoOpen, autoClose, field.blocked, open, onOpenChange]);
  return (
    <Collapsible
      open={open}
      disabled={field.blocked}
      onOpenChange={(next) => {
        if (streaming) manuallyChanged.current = true;
        onOpenChange(next);
      }}
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          style={{
            minBlockSize: LAYOUT_POLICY.controlTargetPx,
            minInlineSize: LAYOUT_POLICY.controlTargetPx,
          }}
          className={WRAPPING_BUTTON_CLASSES}
        >
          <ShadcnChatShimmer text={label} active={streaming} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea
          viewportProps={{
            role: 'region',
            tabIndex: 0,
            'aria-label': label,
            'aria-busy': streaming,
            style: { maxBlockSize: `${CHAT_FEEDBACK_POLICY.detailsRem}rem` },
          }}
        >
          <FieldDescription className="whitespace-pre-wrap [overflow-wrap:anywhere]">
            {text || CHAT_FEEDBACK_DEFAULTS.emptyReasoning}
          </FieldDescription>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
