import type { TimelineProps } from
  '@fastsprout/reacd/adapter-runtime/components/timeline/timeline.props.js';
import {
  TIMELINE_DEFAULTS,
  TIMELINE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/timeline-policy.js';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from '../vendor/ui/field.js';
import { CardContent } from '../vendor/ui/card.js';
import { Badge } from '../vendor/ui/badge.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnTimelineProps = TimelineProps;
const variants = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;

function Event({
  item,
  current,
  status,
  onValueChange,
  intent,
}: {
  item: TimelineProps['items'][number];
  current: boolean;
  status: string;
  onValueChange: TimelineProps['onValueChange'];
  intent: NonNullable<TimelineProps['intent']>;
}) {
  const field = useNativeField({ disabled: item.disabled });
  const active = current ? 'step' : undefined;
  return (
    <Field role="listitem" aria-current={active} className="w-auto min-w-0 max-w-full">
      <Badge variant={variants[intent]}>{status}</Badge>
      <FieldContent className="min-w-0 max-w-full [overflow-wrap:anywhere]">
        {onValueChange === undefined ? (
          <FieldTitle aria-current={active}>{item.title}</FieldTitle>
        ) : (
          <Button
            type="button"
            variant="link"
            aria-current={active}
            disabled={field.blocked}
            onClick={() => onValueChange(item.id)}
            className="h-auto min-w-0 max-w-full whitespace-normal p-0"
          >
            {item.title}
          </Button>
        )}
        {item.date !== undefined && <FieldDescription>{item.date}</FieldDescription>}
        {item.description !== undefined && (
          <FieldDescription>{item.description}</FieldDescription>
        )}
      </FieldContent>
    </Field>
  );
}

export function ShadcnTimeline({
  label,
  items,
  value,
  onValueChange,
  orientation = TIMELINE_DEFAULTS.orientation,
  reverse = TIMELINE_DEFAULTS.reverse,
  intent = TIMELINE_DEFAULTS.intent,
}: TimelineProps) {
  const currentIndex = value === undefined ? 0 : items.findIndex((i) => i.id === value);
  const entries = items.map((item, index) => ({ item, index }));
  if (reverse) entries.reverse();
  return (
    <CardContent
      role="list"
      aria-label={label}
      className={
        'flex min-w-0 max-w-full gap-4 p-0 ' +
        (orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col')
      }
    >
      {entries.map(({ item, index }) => (
        <Event
          key={item.id}
          item={item}
          current={index === currentIndex}
          onValueChange={onValueChange}
          intent={intent}
          status={
            index < currentIndex
              ? TIMELINE_POLICY.statuses.completed
              : index === currentIndex
                ? TIMELINE_POLICY.statuses.current
                : TIMELINE_POLICY.statuses.upcoming
          }
        />
      ))}
    </CardContent>
  );
}
