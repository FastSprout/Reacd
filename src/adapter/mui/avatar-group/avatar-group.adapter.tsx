import { useId, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { AvatarGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar-group/avatar-group.props.js';
import {
  AVATAR_DEFAULTS,
  AVATAR_DIMENSIONS,
} from '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { avatarInitials } from '@fastsprout/reacd/adapter-runtime/core/avatar-text.js';
import { useNativeField } from '../native-field.js';

export type MuiAvatarGroupProps = AvatarGroupProps;

export function MuiAvatarGroup(props: MuiAvatarGroupProps) {
  const id = useId();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const field = useNativeField({});
  const max = props.max ?? AVATAR_DEFAULTS.max;
  const visible = props.items.slice(0, max);
  const hidden = props.items.slice(max);
  const dimension = AVATAR_DIMENSIONS[props.size ?? AVATAR_DEFAULTS.size].rem;
  return (
    <Stack role="group" aria-labelledby={id}>
      <Typography id={id}>{props.label}</Typography>
      {props.items.length === 0 && (
        <Typography>{props.emptyMessage ?? AVATAR_DEFAULTS.emptyMessage}</Typography>
      )}
      <Stack direction="row">
        <AvatarGroup max={max + 1}>
          {visible.map((item) => (
            <Avatar
              key={item.id}
              src={item.src}
              role="img"
              aria-label={item.name}
              slotProps={{ img: { alt: '', 'aria-hidden': true } }}
              sx={{ width: `${dimension}rem`, height: `${dimension}rem` }}
            >
              {item.fallback ?? avatarInitials(item.name)}
            </Avatar>
          ))}
        </AvatarGroup>
        {hidden.length > 0 && (
          <Button
            disabled={field.blocked}
            aria-label={`Show ${hidden.length} more people`}
            aria-haspopup="dialog"
            aria-expanded={anchor !== null}
            onClick={(event) => setAnchor(event.currentTarget)}
          >
            +{hidden.length}
          </Button>
        )}
      </Stack>
      <Popover
        open={anchor !== null && !field.blocked}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        disableRestoreFocus={field.blocked}
        slotProps={{
          paper: { role: 'dialog', 'aria-label': `${props.label} overflow` },
        }}
      >
        <List>
          {hidden.map((item) => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar src={item.src} alt="">
                  {item.fallback ?? avatarInitials(item.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </Stack>
  );
}
