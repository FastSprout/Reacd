import type { ComponentProps } from 'react';

export type ButtonPrimitiveProps = ComponentProps<'button'> & {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
};
