import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import type { ChatToolProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-tool/chat-tool.props.js';
import {
  CHAT_FEEDBACK_DEFAULTS,
  CHAT_FEEDBACK_POLICY,
  CHAT_TOOL_LABELS,
} from '@fastsprout/reacd/adapter-runtime/core/chat-feedback-policy.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../vendor/ui/collapsible.js';
import { CardContent, CardFooter } from '../vendor/ui/card.js';
import { FieldContent, FieldDescription } from '../vendor/ui/field.js';
import { ScrollArea } from '../vendor/ui/scroll-area.js';
import { Badge } from '../vendor/ui/badge.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnChatToolProps = ChatToolProps;

export function ShadcnChatTool({
  label,
  status,
  input,
  output,
  error,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onRetry,
  disabled,
}: ChatToolProps) {
  const field = useNativeField({ disabled });
  return (
    <Collapsible open={open} disabled={field.blocked} onOpenChange={onOpenChange}>
      <CardContent className="flex min-w-0 flex-wrap items-center gap-2 p-0">
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
            {label}
          </Button>
        </CollapsibleTrigger>
        <Badge>{CHAT_TOOL_LABELS[status]}</Badge>
      </CardContent>
      <CollapsibleContent>
        <ScrollArea
          viewportProps={{
            role: 'region',
            tabIndex: 0,
            'aria-label': `${label} details`,
            'aria-busy': status === 'running',
            style: { maxBlockSize: `${CHAT_FEEDBACK_POLICY.detailsRem}rem` },
          }}
        >
          <FieldContent className="min-w-0 max-w-full whitespace-pre-wrap">
            {input !== undefined && <FieldDescription>{input}</FieldDescription>}
            {output !== undefined && <FieldDescription>{output}</FieldDescription>}
            {error !== undefined && (
              <FieldDescription role="alert">{error}</FieldDescription>
            )}
            {input === undefined && output === undefined && error === undefined && (
              <FieldDescription>{CHAT_FEEDBACK_DEFAULTS.emptyTool}</FieldDescription>
            )}
          </FieldContent>
        </ScrollArea>
      </CollapsibleContent>
      <CardFooter className="flex-wrap gap-2 p-0">
        {onApprove !== undefined && (
          <Button
            type="button"
            disabled={field.blocked}
            className={WRAPPING_BUTTON_CLASSES}
            style={{
              minBlockSize: LAYOUT_POLICY.controlTargetPx,
              minInlineSize: LAYOUT_POLICY.controlTargetPx,
            }}
            onClick={() => onApprove()}
          >
            {CHAT_FEEDBACK_DEFAULTS.approveLabel}
          </Button>
        )}
        {onReject !== undefined && (
          <Button
            type="button"
            variant="outline"
            className={WRAPPING_BUTTON_CLASSES}
            style={{
              minBlockSize: LAYOUT_POLICY.controlTargetPx,
              minInlineSize: LAYOUT_POLICY.controlTargetPx,
            }}
            disabled={field.blocked}
            onClick={() => onReject()}
          >
            {CHAT_FEEDBACK_DEFAULTS.rejectLabel}
          </Button>
        )}
        {onRetry !== undefined && (
          <Button
            type="button"
            disabled={field.blocked}
            className={WRAPPING_BUTTON_CLASSES}
            style={{
              minBlockSize: LAYOUT_POLICY.controlTargetPx,
              minInlineSize: LAYOUT_POLICY.controlTargetPx,
            }}
            onClick={() => onRetry()}
          >
            {CHAT_FEEDBACK_DEFAULTS.retryLabel}
          </Button>
        )}
      </CardFooter>
    </Collapsible>
  );
}
