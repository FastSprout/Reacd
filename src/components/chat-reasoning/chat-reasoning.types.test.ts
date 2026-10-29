import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatReasoning } from './chat-reasoning.js';
import type { ChatReasoningProps } from './chat-reasoning.props.js';

it('exposes closed named ChatReasoning properties', () => {
  expectTypeOf<
    Parameters<typeof ChatReasoning>[0]
  >().toEqualTypeOf<ChatReasoningProps>();
  expectTypeOf<ReturnType<typeof ChatReasoning>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatReasoningProps>
  >().toBeNever();
});
