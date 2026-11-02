import { useId } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { UserProps } from
  '@fastsprout/reacd/adapter-runtime/components/user/user.props.js';
import { USER_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/user-policy.js';
import { MuiAvatar } from '../avatar/avatar.adapter.js';
import { useNativeField } from '../native-field.js';

export type MuiUserProps = UserProps;

export function MuiUser({
  name,
  description,
  avatar,
  href,
  onPress,
  disabled,
  size = USER_DEFAULTS.size,
  orientation = USER_DEFAULTS.orientation,
}: UserProps) {
  const id = useId();
  const field = useNativeField({ disabled });
  const content = (
    <Stack
      direction={orientation === 'vertical' ? 'column' : 'row'}
      spacing={1}
      sx={{ minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' }}
    >
      {avatar && <MuiAvatar name={name} size={size} {...avatar} />}
      <Stack sx={{ minWidth: 0 }}>
        <Typography>{name}</Typography>
        {description !== undefined && (
          <Typography id={id} variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
  const describedBy = description === undefined ? undefined : id;
  if (onPress !== undefined)
    return (
      <Button
        type="button"
        aria-label={name}
        aria-describedby={describedBy}
        disabled={field.blocked}
        sx={{ maxWidth: '100%', textTransform: 'none' }}
        onClick={() => onPress()}
      >
        {content}
      </Button>
    );
  if (href !== undefined)
    return (
      <Link href={href} aria-label={name} aria-describedby={describedBy}>
        {content}
      </Link>
    );
  return content;
}
