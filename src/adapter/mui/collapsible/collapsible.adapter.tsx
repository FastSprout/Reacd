import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useContext, useId } from 'react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import type { CollapsibleProps } from
  '@fastsprout/reacd/adapter-runtime/components/collapsible/collapsible.props.js';
import { COLLAPSIBLE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/collapsible-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiCollapsibleProps = CollapsibleProps;

export function MuiCollapsible(props: MuiCollapsibleProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  const field = useNativeField(props);
  return (
    <Stack>
      {(props.showTrigger ?? COLLAPSIBLE_DEFAULTS.showTrigger) && (
        <Button
          aria-expanded={props.open}
          aria-controls={id}
          disabled={field.blocked}
          onClick={() => props.onOpenChange(!props.open)}
        >
          {props.label}
        </Button>
      )}
      <Collapse
        id={id}
        role="region"
        aria-label={props.label}
        in={props.open}
        unmountOnExit={!(props.retainContent ?? COLLAPSIBLE_DEFAULTS.retainContent)}
      >
        <PortalActiveContext value={active && props.open}>
          {props.children}
        </PortalActiveContext>
      </Collapse>
    </Stack>
  );
}
