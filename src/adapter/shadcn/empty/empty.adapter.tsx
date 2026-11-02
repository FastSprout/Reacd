import { useId } from 'react';
import type { EmptyProps } from
  '@fastsprout/reacd/adapter-runtime/components/empty/empty.props.js';
import {
  EMPTY_DEFAULTS,
  EMPTY_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/empty-policy.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../vendor/ui/empty.js';
import { ShadcnSpinner } from '../spinner/spinner.adapter.js';

export type ShadcnEmptyProps = EmptyProps;
const variants = {
  outline: 'border',
  solid: 'border bg-primary text-primary-foreground',
  soft: 'bg-muted',
  subtle: 'bg-muted/50',
  naked: 'border-0 p-0 md:p-0',
} as const;
export function ShadcnEmpty({
  title,
  description,
  leading,
  children,
  actions,
  footer,
  size = EMPTY_DEFAULTS.size,
  variant = EMPTY_DEFAULTS.variant,
  loading = EMPTY_DEFAULTS.loading,
  loadingLabel = EMPTY_DEFAULTS.loadingLabel,
}: EmptyProps) {
  const id = useId();
  return (
    <Empty
      role="region"
      aria-labelledby={id}
      aria-busy={loading}
      className={variants[variant]}
    >
      <EmptyHeader>
        {(leading || loading) && (
          <EmptyMedia>
            {leading}
            {loading && <ShadcnSpinner label={loadingLabel} />}
          </EmptyMedia>
        )}
        <EmptyTitle id={id} style={{ fontSize: `${EMPTY_POLICY.titleScale[size]}em` }}>
          {title}
        </EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {children != null && (
        <EmptyContent style={{ maxWidth: `${EMPTY_POLICY.contentWidthRem}rem` }}>
          {children}
        </EmptyContent>
      )}
      {actions != null && <EmptyContent>{actions}</EmptyContent>}
      {footer != null && <EmptyContent>{footer}</EmptyContent>}
    </Empty>
  );
}
