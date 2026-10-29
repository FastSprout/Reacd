import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatAttachment } from './chat-attachment.js';
import type { ChatAttachmentProps } from './chat-attachment.props.js';

it('exposes closed named ChatAttachment properties', () => {
  expectTypeOf<
    Parameters<typeof ChatAttachment>[0]
  >().toEqualTypeOf<ChatAttachmentProps>();
  expectTypeOf<ReturnType<typeof ChatAttachment>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatAttachmentProps>
  >().toBeNever();
});
