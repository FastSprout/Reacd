import type { ErrorProps } from
  '@fastsprout/reacd/adapter-runtime/components/error/error.props.js';
import { useId } from 'react';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../vendor/ui/empty.js';
import { Badge } from '../vendor/ui/badge.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/policy.js';

export type ShadcnErrorProps = ErrorProps;
export function ShadcnError({
  statusCode,
  title,
  message,
  leading,
  actions,
  children,
  redirect,
  recoveryLabel = APPLICATION_DEFAULTS.recoveryLabel,
}: ErrorProps) {
  const titleId = useId();
  return (
    <Empty role="region" aria-labelledby={titleId}>
      <EmptyHeader>
        {leading && <EmptyMedia>{leading}</EmptyMedia>}
        <Badge variant="destructive">{statusCode}</Badge>
        <EmptyTitle id={titleId}>{title}</EmptyTitle>
        {message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>
      {children != null && <EmptyContent>{children}</EmptyContent>}
      {actions != null && <EmptyContent>{actions}</EmptyContent>}
      {redirect && (
        <EmptyContent>
          <Button asChild variant="outline" className={WRAPPING_BUTTON_CLASSES}
            style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}>
            <a href={redirect}>{recoveryLabel}</a>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
