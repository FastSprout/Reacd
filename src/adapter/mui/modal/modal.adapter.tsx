import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { ModalProps } from
  '@fastsprout/reacd/adapter-runtime/components/modal/modal.props.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativeField } from '../native-field.js';

export type MuiModalProps = ModalProps;

export function MuiModal(props: MuiModalProps) {
  const id = useId();
  const field = useNativeField(props);
  if (props.modal === false)
    throw new UnsupportedAdapterComponentError('material-ui', 'Modal');
  const dismissible = props.dismissible ?? MODAL_DEFAULTS.dismissible;
  return (
    <>
      {props.triggerLabel && (
        <Button
          disabled={field.blocked}
          onClick={() => emitNativeValue(props.onOpenChange, true, field.blocked)}
        >
          {props.triggerLabel}
        </Button>
      )}
      <Dialog
        open={props.open && !field.blocked}
        disableRestoreFocus={field.blocked}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        hideBackdrop={props.overlay === false}
        fullScreen={Boolean(props.fullscreen)}
        keepMounted={Boolean(props.retainContent)}
        onClose={() => {
          if (dismissible) emitNativeValue(props.onOpenChange, false, field.blocked);
        }}
      >
        <PortalActiveContext value={!field.blocked && props.open}>
          <DialogTitle id={`${id}-title`}>{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id={`${id}-description`}>
              {props.description}
            </DialogContentText>
            {props.children}
          </DialogContent>
          <DialogActions>
            {props.footer}
            <Button
              disabled={field.blocked}
              onClick={() => emitNativeValue(props.onOpenChange, false, field.blocked)}
            >
              {props.closeLabel ?? MODAL_DEFAULTS.closeLabel}
            </Button>
          </DialogActions>
        </PortalActiveContext>
      </Dialog>
    </>
  );
}
