import type { HTMLAttributes } from 'react';

export type AlertPrimitiveProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | null | undefined;
};
