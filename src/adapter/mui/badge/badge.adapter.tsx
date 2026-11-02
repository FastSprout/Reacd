import Chip from '@mui/material/Chip';
import type { BadgeProps } from
  '@fastsprout/reacd/adapter-runtime/components/badge/badge.props.js';
import { MuiIcon } from '../icon/icon.adapter.js';

export type MuiBadgeProps = BadgeProps;

export function MuiBadge(props: MuiBadgeProps) {
  return (
    <Chip
      label={props.label}
      color={
        props.intent === 'danger'
          ? 'error'
          : props.intent === 'primary'
            ? 'primary'
            : 'default'
      }
      size={props.size === 'small' ? 'small' : 'medium'}
      icon={
        props.leadingIcon ? <MuiIcon name={props.leadingIcon} decorative /> : undefined
      }
    />
  );
}
