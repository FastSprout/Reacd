import { useId } from 'react';
import type {
  ContentSurroundProps,
} from '../../../components/content-surround/index.js';
import { CONTENT_SURROUND_DEFAULTS } from '../../../core/content-surround-policy.js';

export function ShadcnContentSurround({
  label = CONTENT_SURROUND_DEFAULTS.label,
  emptyLabel = CONTENT_SURROUND_DEFAULTS.emptyLabel,
  previous,
  next,
}: ContentSurroundProps) {
  const id = useId();
  return (
    <nav className="reacd-node reacd-content-surround" aria-label={label}>
      {previous === undefined && next === undefined ? (
        <p>{emptyLabel}</p>
      ) : (
        [previous, next].map((neighbor, index) => {
          if (neighbor === undefined) return null;
          const prefix =
            index === 0
              ? CONTENT_SURROUND_DEFAULTS.previousLabel
              : CONTENT_SURROUND_DEFAULTS.nextLabel;
          return (
            <a
              key={index}
              className="reacd-node reacd-surround-link"
              href={neighbor.href}
              aria-label={`${prefix} ${neighbor.title}`}
              aria-describedby={
                neighbor.description === undefined ? undefined : `${id}-${index}`
              }
              target={neighbor.newWindow ? '_blank' : undefined}
              rel={neighbor.newWindow ? 'noopener noreferrer' : undefined}
            >
              <span className="reacd-surround-direction">{prefix}</span>
              <span className="reacd-surround-title">{neighbor.title}</span>
              {neighbor.description !== undefined && (
                <span id={`${id}-${index}`}>{neighbor.description}</span>
              )}
            </a>
          );
        })
      )}
    </nav>
  );
}
