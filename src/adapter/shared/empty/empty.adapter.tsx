import { useId } from 'react';
import type { EmptyProps } from
  '@fastsprout/reacd/adapter-runtime/components/empty/empty.js';
import { EMPTY_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/empty-policy.js';
import { SpinnerSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/spinner/spinner.renderer.js';

export function SharedEmpty({
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
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return (
    <section
      className="reacd-node reacd-empty"
      data-slot="empty"
      data-size={size}
      data-variant={variant}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description === undefined ? undefined : descriptionId}
      data-loading={loading}
    >
      <header className="reacd-empty-header" data-slot="empty-header">
        {leading !== undefined && (
          <div className="reacd-empty-leading" data-slot="empty-media">
            {leading}
          </div>
        )}
        <h2 id={titleId} className="reacd-empty-title" data-slot="empty-title">
          {title}
        </h2>
        {description !== undefined && (
          <p id={descriptionId} data-slot="empty-description">
            {description}
          </p>
        )}
      </header>
      {loading && <SpinnerSurface label={loadingLabel} />}
      {children !== undefined && (
        <div
          className="reacd-empty-content"
          data-slot="empty-content"
          aria-busy={loading}
        >
          {children}
        </div>
      )}
      {actions !== undefined && (
        <div className="reacd-empty-actions" data-slot="empty-actions">
          {actions}
        </div>
      )}
      {footer !== undefined && <footer className="reacd-empty-footer">{footer}</footer>}
    </section>
  );
}
