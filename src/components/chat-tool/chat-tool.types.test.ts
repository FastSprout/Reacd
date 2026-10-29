import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatTool } from './chat-tool.js';
import type { ChatToolProps } from './chat-tool.props.js';

it('exposes closed named ChatTool properties', () => {
  expectTypeOf<Parameters<typeof ChatTool>[0]>().toEqualTypeOf<ChatToolProps>();
  expectTypeOf<ReturnType<typeof ChatTool>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatToolProps>
  >().toBeNever();
});
