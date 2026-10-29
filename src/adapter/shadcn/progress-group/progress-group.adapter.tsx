import { useId } from 'react';
import type { ProgressGroupProps } from '../../../components/progress-group/index.js';
import { PROGRESS_GROUP_DEFAULTS } from '../../../core/progress-group-policy.js';
import { progressGroupLayout } from '../../../core/progress-group-layout.js';

export function ShadcnProgressGroup({
  label,
  items,
  max = PROGRESS_GROUP_DEFAULTS.max,
  showStatus = PROGRESS_GROUP_DEFAULTS.showStatus,
}: ProgressGroupProps) {
  const identity = useId();
  const layout = progressGroupLayout(items, max);
  return (
    <div className="reacd-node reacd-progress-group" data-slot="progress-group">
      <p id={identity} className="reacd-progress-group-label">
        {label}
      </p>
      {showStatus && (
        <p className="reacd-progress-group-status">
          {layout.value} / {max}
        </p>
      )}
      <div
        className="reacd-progress-group-track"
        role="progressbar"
        aria-labelledby={identity}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={layout.value}
      >
        {layout.items.map((item) => (
          <span
            key={item.id}
            className="reacd-progress-group-segment"
            data-intent={item.intent ?? PROGRESS_GROUP_DEFAULTS.intent}
            style={{ inlineSize: `${item.percent}%` }}
          />
        ))}
      </div>
      <ul className="reacd-progress-group-legend" aria-label={`${label} breakdown`}>
        {layout.items.map((item) => (
          <li key={item.id}>
            <span
              className="reacd-progress-group-item"
              data-intent={item.intent ?? PROGRESS_GROUP_DEFAULTS.intent}
            >
              {item.label}
            </span>
            <span>
              {item.value} / {max}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
