import { ChatPrompt } from '../../src/components/chat-prompt/index.js';
import { ChatPromptSubmit } from '../../src/components/chat-prompt-submit/index.js';
import { ChatPalette } from '../../src/components/chat-palette/index.js';
import { Text } from '../../src/components/text/index.js';

export const CHAT_COMPOSER_EXAMPLES = {
  ChatPrompt: (
    <ChatPrompt
      label="Message"
      value="Draft"
      onValueChange={() => undefined}
      onSubmit={() => undefined}
    />
  ),
  ChatPromptSubmit: <ChatPromptSubmit onSubmit={() => undefined} />,
  ChatPalette: (
    <ChatPalette label="Conversation">
      <Text>Transcript</Text>
    </ChatPalette>
  ),
} as const;
