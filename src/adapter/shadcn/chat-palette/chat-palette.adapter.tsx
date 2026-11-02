import type { ChatPaletteProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-palette/chat-palette.props.js';
import { CHAT_COMPOSER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chat-composer-policy.js';
import { Card, CardContent, CardFooter } from '../vendor/ui/card.js';
import { ScrollArea } from '../vendor/ui/scroll-area.js';

export type ShadcnChatPaletteProps = ChatPaletteProps;

export function ShadcnChatPalette({ label, children, prompt }: ChatPaletteProps) {
  return (
    <Card role="region" aria-label={label} className="min-w-0 max-w-full">
      <ScrollArea
        style={{
          blockSize:
            `min(${CHAT_COMPOSER_POLICY.paletteBlockRem}rem, ` +
            `${CHAT_COMPOSER_POLICY.paletteViewportPercent}dvh)`,
        }}
        viewportProps={{ tabIndex: 0, 'aria-label': `${label} conversation` }}
      >
        <CardContent className="min-w-0 pt-6">{children}</CardContent>
      </ScrollArea>
      {prompt !== undefined && <CardFooter className="min-w-0">{prompt}</CardFooter>}
    </Card>
  );
}
