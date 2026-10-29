import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatMessage } from './chat-message.js';
import type { ChatMessageProps } from './chat-message.props.js';

it('exposes closed named ChatMessage properties', () => {
  expectTypeOf<Parameters<typeof ChatMessage>[0]>().toEqualTypeOf<ChatMessageProps>();
  expectTypeOf<ReturnType<typeof ChatMessage>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatMessageProps>
  >().toBeNever();
});
