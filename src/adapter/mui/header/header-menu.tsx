import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.props.js';
import { SHELL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { useNativeField } from '../native-field.js';
import { emitNativeValue } from '../native-value.js';

export function MuiHeaderMenu(props: NonNullable<HeaderProps['menu']>) {
  const field = useNativeField({});
  const close = () => emitNativeValue(props.onOpenChange, false, field.blocked);
  const mode = props.mode ?? SHELL_DEFAULTS.menuMode;
  const open = props.open && !field.blocked;
  const closeButton = (
    <Button onClick={close}>{props.closeLabel ?? SHELL_DEFAULTS.closeLabel}</Button>
  );
  if (mode === 'modal')
    return (
      <Dialog open={open} onClose={close} aria-label={SHELL_DEFAULTS.menuDescription}>
        <DialogTitle>{SHELL_DEFAULTS.menuDescription}</DialogTitle>
        <DialogContent>{props.content}</DialogContent>
        <DialogActions>{closeButton}</DialogActions>
      </Dialog>
    );
  return (
    <Drawer
      open={open}
      onClose={close}
      anchor={mode === 'drawer' ? 'bottom' : 'right'}
      slotProps={{
        paper: { role: 'dialog', 'aria-label': SHELL_DEFAULTS.menuDescription },
      }}
    >
      <Stack>
        <Typography variant="h6">{SHELL_DEFAULTS.menuDescription}</Typography>
        {props.content}
        {closeButton}
      </Stack>
    </Drawer>
  );
}
