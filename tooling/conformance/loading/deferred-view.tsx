import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Skeleton } from '@fastsprout/reacd';
import { ViewBoundary } from './view-boundary.js';

interface DeferredViewProps {
  label: string;
  children: ReactNode;
}
export function DeferredView({ label, children }: DeferredViewProps): ReactNode {
  return (
    <ViewBoundary key={label} label={label}>
      <Suspense fallback={<Skeleton label={`Loading ${label}`} />}>{children}</Suspense>
    </ViewBoundary>
  );
}
