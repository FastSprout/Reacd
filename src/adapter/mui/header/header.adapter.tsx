import { Children } from 'react';
import { DOCUMENTATION_LAYOUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.props.js';
import { SHELL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { useNativeField } from '../native-field.js';
import { emitNativeValue } from '../native-value.js';
import { MuiHeaderMenu } from './header-menu.js';

export type MuiHeaderProps = HeaderProps;

export function MuiHeader(props: MuiHeaderProps) {
  const field = useNativeField({});
  const menu = props.menu;
  const replacement =
    (menu?.replacesNavigation ?? SHELL_DEFAULTS.replacesNavigation) &&
    Children.toArray(props.children).length + Children.toArray(props.bottom).length > 0;
  const threshold = DOCUMENTATION_LAYOUT_POLICY.headerNavigationAtRem;
  const wide = `@container (min-width: ${threshold}rem)`;
  return (
    <AppBar
      component="header"
      position="static"
      color="default"
      data-navigation-replacement={replacement ? true : undefined}
      sx={{ containerType: 'inline-size' }}
    >
      {props.top}
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        {props.start}
        {props.href ? (
          <Link href={props.href} color="inherit">
            {props.title}
          </Link>
        ) : (
          <Typography variant="h6">{props.title}</Typography>
        )}
        <Stack
          direction="row"
          sx={{
            flex: 1,
            minWidth: 0,
            flexWrap: 'wrap',
            display: replacement ? 'none' : 'flex',
            [wide]: { display: 'flex' },
          }}
        >
          {props.children}
        </Stack>
        {props.end}
        {menu && (
          <Button
            sx={replacement ? { [wide]: { display: 'none' } } : undefined}
            disabled={field.blocked}
            aria-expanded={menu.open}
            onClick={() => emitNativeValue(menu.onOpenChange, true, field.blocked)}
          >
            {menu.toggleLabel ?? SHELL_DEFAULTS.toggleLabel}
          </Button>
        )}
      </Toolbar>
      <Stack
        sx={{ display: replacement ? 'none' : 'flex', [wide]: { display: 'flex' } }}
      >
        {props.bottom}
      </Stack>
      {menu && <MuiHeaderMenu {...menu} />}
    </AppBar>
  );
}
