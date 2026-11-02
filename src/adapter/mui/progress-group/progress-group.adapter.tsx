import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ProgressGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/progress-group/progress-group.props.js';
import {
  PROGRESS_GROUP_DEFAULTS,
  PROGRESS_GROUP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/progress-group-policy.js';
import { progressGroupLayout } from
  '@fastsprout/reacd/adapter-runtime/core/progress-group-layout.js';

export type MuiProgressGroupProps = ProgressGroupProps;
const colors = { primary: 'primary', secondary: 'secondary', danger: 'error' } as const;

export function MuiProgressGroup({
  label,
  items,
  max = PROGRESS_GROUP_DEFAULTS.max,
  showStatus = PROGRESS_GROUP_DEFAULTS.showStatus,
}: ProgressGroupProps) {
  const layout = progressGroupLayout(items, max);
  const remaining =
    PROGRESS_GROUP_POLICY.percent -
    layout.items.reduce((sum, item) => sum + item.percent, 0);
  return (
    <Stack sx={{ minWidth: 0, maxWidth: '100%' }} spacing={1}>
      <Typography>{label}</Typography>
      <Stack
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={layout.value}
        direction="row"
      >
        {layout.items.map((item) => (
          <LinearProgress
            key={item.id}
            aria-hidden
            variant="determinate"
            value={PROGRESS_GROUP_POLICY.percent}
            color={colors[item.intent ?? PROGRESS_GROUP_DEFAULTS.intent]}
            sx={{ width: `${item.percent}%` }}
          />
        ))}
        <LinearProgress
          aria-hidden
          variant="determinate"
          value={0}
          sx={{ width: `${remaining}%` }}
        />
      </Stack>
      {showStatus && <Typography>{`${layout.value} / ${max}`}</Typography>}
      <Stack role="list" aria-label={`${label} categories`} spacing={1}>
        {layout.items.map((item) => (
          <Typography key={item.id} role="listitem" sx={{ overflowWrap: 'anywhere' }}>
            {`${item.label}: ${item.value} / ${max}`}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
