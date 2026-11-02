import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

export type NavigationTarget = NonNullable<
  NavigationMenuProps['items'][number]['children']
>[number];
const layout = {
  minWidth: 0,
  maxWidth: '100%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  minBlockSize: LAYOUT_POLICY.controlTargetPx,
} as const;

export function flatTarget(item: NavigationTarget, protectedScope: boolean) {
  const blocked = protectedScope || Boolean(item.disabled);
  if (item.href !== undefined)
    return (
      <ButtonBase
        key={item.key}
        component={Link}
        role="link"
        disabled={blocked}
        href={blocked ? undefined : item.href}
        sx={layout}
        aria-current={item.active ? 'page' : undefined}
        target={!blocked && item.newWindow ? '_blank' : undefined}
        rel={!blocked && item.newWindow ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </ButtonBase>
    );
  const action = item.onPress;
  if (action)
    return (
      <Button
        key={item.key}
        disabled={blocked}
        sx={layout}
        variant={item.active ? 'contained' : 'text'}
        onClick={() => action()}
      >
        {item.label}
      </Button>
    );
  return <Typography key={item.key}>{item.label}</Typography>;
}

export function menuTarget(
  item: NavigationTarget,
  protectedScope: boolean,
  close: () => void,
) {
  const blocked = protectedScope || Boolean(item.disabled);
  if (item.href !== undefined)
    return (
      <MenuItem
        key={item.key}
        component={Link}
        role="link"
        disabled={blocked}
        href={blocked ? undefined : item.href}
        sx={layout}
        aria-current={item.active ? 'page' : undefined}
        target={!blocked && item.newWindow ? '_blank' : undefined}
        rel={!blocked && item.newWindow ? 'noopener noreferrer' : undefined}
        onClick={close}
      >
        {item.label}
      </MenuItem>
    );
  const action = item.onPress;
  if (action)
    return (
      <MenuItem
        key={item.key}
        component="button"
        role="button"
        disabled={blocked}
        sx={layout}
        onClick={() => {
          close();
          action();
        }}
      >
        {item.label}
      </MenuItem>
    );
  return (
    <MenuItem key={item.key} disabled role="presentation" sx={layout}>
      {item.label}
    </MenuItem>
  );
}
