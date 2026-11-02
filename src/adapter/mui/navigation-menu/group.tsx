import { useContext, useId, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import { NAVIGATION_COMPOSITION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativeField } from '../native-field.js';
import { menuTarget } from './target.js';
import type { NavigationTarget } from './target.js';

export function MuiNavigationGroup({
  item,
  targets,
}: {
  readonly item: NavigationMenuProps['items'][number];
  readonly targets: readonly NavigationTarget[];
}) {
  const id = useId();
  const theme = useTheme();
  const popupWidth = NAVIGATION_COMPOSITION_POLICY.popupWidthRem;
  const host = useContext(PortalHostContext);
  const field = useNativeField({ disabled: item.disabled });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [previousBlocked, setPreviousBlocked] = useState(field.blocked);
  if (previousBlocked !== field.blocked) {
    setPreviousBlocked(field.blocked);
    if (field.blocked) setAnchor(null);
  }
  const open = anchor !== null && !field.blocked;
  const close = () => setAnchor(null);
  return (
    <>
      <Button
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        disabled={field.blocked}
        onClick={(event) => setAnchor(event.currentTarget)}
        variant={item.active ? 'contained' : 'text'}
      >
        {item.label}
      </Button>
      <Menu
        id={id}
        anchorEl={anchor}
        open={open}
        onClose={close}
        container={host}
        disableRestoreFocus={field.blocked}
        slotProps={{
          list: { role: 'group', 'aria-label': item.label },
          paper: {
            dir: theme.direction,
            sx: {
              minWidth: 0,
              maxInlineSize: `min(100%, ${popupWidth}rem)`,
              overflowWrap: 'anywhere',
            },
          },
        }}
      >
        {item.description && (
          <MenuItem disabled role="presentation">
            <Typography variant="body2">{item.description}</Typography>
          </MenuItem>
        )}
        {targets.map((target) => menuTarget(target, field.blocked, close))}
      </Menu>
    </>
  );
}
