import type { ReactNode } from 'react';
import type { ChatShimmerProps } from './chat-shimmer.props.js';
import { chatShimmerSchema } from '../../schema/chat-shimmer/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatShimmerProps } from './chat-shimmer.props.js';
export function ChatShimmer(props: ChatShimmerProps): ReactNode {
  return useDeclaration('ChatShimmer', chatShimmerSchema, props);
}
