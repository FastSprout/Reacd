import type { ComponentPropsWithRef } from 'react';

export type ControlPartProps = ComponentPropsWithRef<'div'> & {
  readonly part: 'root' | 'control' | 'track' | 'indicator' | 'thumb';
};
