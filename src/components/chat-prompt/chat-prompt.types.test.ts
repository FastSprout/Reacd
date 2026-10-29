import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatPrompt } from './chat-prompt.js';
import type { ChatPromptProps } from './chat-prompt.props.js';

it('exposes closed named ChatPrompt properties', () => {
  expectTypeOf<Parameters<typeof ChatPrompt>[0]>().toEqualTypeOf<ChatPromptProps>();
  expectTypeOf<ReturnType<typeof ChatPrompt>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onKeyDown', keyof ChatPromptProps>
  >().toBeNever();
});
