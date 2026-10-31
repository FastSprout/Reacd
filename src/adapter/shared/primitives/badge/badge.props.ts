import type { HTMLAttributes } from 'react';

export type BadgePrimitiveProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
};
