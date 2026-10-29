import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatMessages } from './chat-messages.js';
import type { ChatMessagesProps } from './chat-messages.props.js';

it('exposes closed named ChatMessages properties', () => {
  expectTypeOf<Parameters<typeof ChatMessages>[0]>().toEqualTypeOf<ChatMessagesProps>();
  expectTypeOf<ReturnType<typeof ChatMessages>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatMessagesProps>
  >().toBeNever();
});
