import type { ReactNode } from 'react';
import { BoundReadValue } from './bound-read-value.js';
import type { ReadValueProps } from './read-value.props.js';
export function ResolveReadValue<Value>(props: ReadValueProps<Value>): ReactNode {
  return props.reference === undefined ? (
    props.children(props.literal)
  ) : (
    <BoundReadValue {...props} reference={props.reference} />
  );
}
