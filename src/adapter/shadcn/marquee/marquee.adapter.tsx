import type { CSSProperties } from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import type { MarqueeProps } from '../../../components/marquee/index.js';
import { MARQUEE_DEFAULTS, MARQUEE_POLICY } from '../../../core/marquee-policy.js';
import { useReducedMotion } from '../../../renderer/motion/use-reduced-motion.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnMarquee({
  label,
  items,
  paused,
  onPausedChange,
  pace = MARQUEE_DEFAULTS.pace,
  direction: motion = MARQUEE_DEFAULTS.direction,
  readOnly = MARQUEE_DEFAULTS.readOnly,
  emptyMessage = MARQUEE_DEFAULTS.emptyMessage,
}: MarqueeProps) {
  const direction = useDirection();
  const reduced = useReducedMotion();
  const staticView = reduced !== false || readOnly;
  const variables: CSSProperties & { '--reacd-marquee-duration': string } = {
    '--reacd-marquee-duration': `var(--reacd-marquee-${pace})`,
  };
  const content = (
    <ul aria-label={label} className="reacd-marquee-reading-list">
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
  return (
    <section role="region" aria-label={label} className="reacd-node reacd-marquee">
      {items.length === 0 ? (
        <p role="status">{emptyMessage}</p>
      ) : (
        <>
          <p role="status">
            {staticView
              ? reduced === undefined
                ? MARQUEE_DEFAULTS.unknownLabel
                : reduced
                  ? MARQUEE_DEFAULTS.reducedLabel
                  : MARQUEE_DEFAULTS.readonlyLabel
              : paused
                ? MARQUEE_DEFAULTS.pausedLabel
                : MARQUEE_DEFAULTS.enabledLabel}
          </p>
          {staticView ? (
            content
          ) : (
            <>
              <div
                className="reacd-marquee-viewport"
                aria-hidden="true"
                inert
                dir="ltr"
              >
                <div
                  className="reacd-marquee-track"
                  data-paused={paused}
                  data-reverse={(direction === 'rtl') !== (motion === 'backward')}
                  style={variables}
                >
                  {Array.from({ length: MARQUEE_POLICY.visualCopies }, (_, copy) => (
                    <div key={copy} className="reacd-marquee-copy">
                      {items.map((item) => (
                        <span key={item.id} dir={direction}>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                className="reacd-button"
                variant="outline"
                onClick={() => onPausedChange(!paused)}
              >
                {paused ? MARQUEE_DEFAULTS.resumeLabel : MARQUEE_DEFAULTS.pauseLabel}
              </Button>
              <details className="reacd-marquee-reading">
                <summary>{MARQUEE_DEFAULTS.readLabel}</summary>
                {content}
              </details>
            </>
          )}
        </>
      )}
    </section>
  );
}
