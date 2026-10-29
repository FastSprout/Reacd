import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatPromptSubmit } from './chat-prompt-submit.js';
import type { ChatPromptSubmitProps } from './chat-prompt-submit.props.js';

it('exposes closed named ChatPromptSubmit properties', () => {
  expectTypeOf<
    Parameters<typeof ChatPromptSubmit>[0]
  >().toEqualTypeOf<ChatPromptSubmitProps>();
  expectTypeOf<ReturnType<typeof ChatPromptSubmit>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onKeyDown', keyof ChatPromptSubmitProps>
  >().toBeNever();
});
