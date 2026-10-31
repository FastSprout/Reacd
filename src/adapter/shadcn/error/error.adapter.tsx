import { useId } from 'react';
import type { ErrorProps } from
  '@fastsprout/reacd/adapter-runtime/components/error/error.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';

export function ShadcnError({
  statusCode,
  title,
  message,
  children,
  leading,
  actions,
  redirect,
  recoveryLabel = APPLICATION_DEFAULTS.recoveryLabel,
}: ErrorProps) {
  const id = useId();
  const titleId = `${id}-error-title`;
  const messageId = `${id}-error-message`;
  return (
    <section
      className="reacd-node reacd-error"
      role="region"
      aria-labelledby={titleId}
      aria-describedby={message === undefined ? undefined : messageId}
    >
      {leading !== undefined && <div>{leading}</div>}
      <p className="reacd-error-status">{statusCode}</p>
      <h2 id={titleId}>{title}</h2>
      {message !== undefined && <p id={messageId}>{message}</p>}
      {children}
      <div className="reacd-error-actions">
        {actions}
        {redirect !== undefined && (
          <a className="reacd-node reacd-button" href={redirect}>
            {recoveryLabel}
          </a>
        )}
      </div>
    </section>
  );
}
