import type { TimelineProps } from
  '@fastsprout/reacd/adapter-runtime/components/timeline/timeline.js';
import {
  TIMELINE_DEFAULTS,
  TIMELINE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/timeline-policy.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnTimeline({
  label,
  items,
  value,
  onValueChange,
  orientation = TIMELINE_DEFAULTS.orientation,
  reverse = TIMELINE_DEFAULTS.reverse,
  intent = TIMELINE_DEFAULTS.intent,
}: TimelineProps) {
  const current =
    value === undefined ? 0 : items.findIndex((item) => item.id === value);
  const events = items.map(
    (item, index) =>
      ({
        ...item,
        status:
          index < current ? 'completed' : index === current ? 'current' : 'upcoming',
      }) as const,
  );
  if (reverse) events.reverse();
  return (
    <ol
      className="reacd-node reacd-timeline"
      aria-label={label}
      data-slot="timeline"
      data-orientation={orientation}
      data-intent={intent}
    >
      {events.map((item) => (
        <li
          key={item.id}
          data-state={item.status}
          aria-current={item.status === 'current' ? 'step' : undefined}
        >
          <span className="reacd-timeline-state">
            {TIMELINE_POLICY.statuses[item.status]}
          </span>
          {item.date !== undefined && (
            <span className="reacd-timeline-date">{item.date}</span>
          )}
          {onValueChange === undefined ? (
            <p className="reacd-timeline-title">{item.title}</p>
          ) : (
            <Button
              className="reacd-button reacd-timeline-title"
              type="button"
              variant="ghost"
              disabled={item.disabled}
              onClick={() => onValueChange(item.id)}
            >
              {item.title}
            </Button>
          )}
          {item.description !== undefined && (
            <p className="reacd-timeline-description">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
