import type { ProgressGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/progress-group/progress-group.props.js';
import {
  PROGRESS_GROUP_DEFAULTS,
  PROGRESS_GROUP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/progress-group-policy.js';
import { progressGroupLayout } from
  '@fastsprout/reacd/adapter-runtime/core/progress-group-layout.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldContent, FieldDescription, FieldTitle } from '../vendor/ui/field.js';
import { Progress } from '../vendor/ui/progress.js';

export type ShadcnProgressGroupProps = ProgressGroupProps;
const colors = {
  primary: '[&>div]:bg-primary',
  secondary: '[&>div]:bg-secondary',
  danger: '[&>div]:bg-destructive',
};

export function ShadcnProgressGroup({
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
    <FieldContent className="min-w-0 max-w-full">
      <FieldTitle>{label}</FieldTitle>
      <CardContent
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={layout.value}
        className="flex min-w-0 max-w-full gap-0 p-0"
      >
        {layout.items.map((item) => (
          <Progress
            key={item.id}
            aria-hidden
            value={PROGRESS_GROUP_POLICY.percent}
            className={`rounded-none ${
              colors[item.intent ?? PROGRESS_GROUP_DEFAULTS.intent]
            }`}
            style={{ width: `${item.percent}%` }}
          />
        ))}
        <Progress
          aria-hidden
          value={0}
          className="rounded-none"
          style={{ width: `${remaining}%` }}
        />
      </CardContent>
      {showStatus && <FieldDescription>{`${layout.value} / ${max}`}</FieldDescription>}
      <CardContent
        role="list"
        aria-label={`${label} categories`}
        className="grid min-w-0 max-w-full gap-2 p-0"
      >
        {layout.items.map((item) => (
          <FieldDescription
            key={item.id}
            role="listitem"
            className="[overflow-wrap:anywhere]"
          >
            {`${item.label}: ${item.value} / ${max}`}
          </FieldDescription>
        ))}
      </CardContent>
    </FieldContent>
  );
}
