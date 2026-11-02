import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TimelineProps } from
  '@fastsprout/reacd/adapter-runtime/components/timeline/timeline.props.js';
import {
  TIMELINE_DEFAULTS,
  TIMELINE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/timeline-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiTimelineProps = TimelineProps;
const colors = { primary: 'primary', secondary: 'default', danger: 'error' } as const;

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
    <Stack
      role="listitem"
      aria-current={active}
      spacing={1}
      sx={{ minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' }}
    >
      <Chip color={colors[intent]} label={status} />
      {onValueChange === undefined ? (
        <Typography aria-current={active}>{item.title}</Typography>
      ) : (
        <Button
          type="button"
          aria-current={active}
          disabled={field.blocked}
          onClick={() => onValueChange(item.id)}
          sx={{ textTransform: 'none' }}
        >
          {item.title}
        </Button>
      )}
      {item.date !== undefined && (
        <Typography variant="caption">{item.date}</Typography>
      )}
      {item.description !== undefined && <Typography>{item.description}</Typography>}
    </Stack>
  );
}

export function MuiTimeline({
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
    <Stack
      role="list"
      aria-label={label}
      useFlexGap
      spacing={2}
      direction={orientation === 'horizontal' ? 'row' : 'column'}
      sx={{ minWidth: 0, maxWidth: '100%', flexWrap: 'wrap' }}
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
    </Stack>
  );
}
