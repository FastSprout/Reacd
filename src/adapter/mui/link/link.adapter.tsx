import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';
import type { LinkProps } from
  '@fastsprout/reacd/adapter-runtime/components/link/link.props.js';
import { useNativeField } from '../native-field.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

export type MuiLinkProps = LinkProps;

export function MuiLink(props: MuiLinkProps) {
  const field = useNativeField(props);
  const opensWindow = !field.blocked && props.newWindow;
  return (
    <ButtonBase
      component={Link}
      href={field.blocked ? undefined : props.href}
      role="link"
      disabled={field.blocked}
      target={opensWindow ? '_blank' : undefined}
      rel={opensWindow ? 'noopener noreferrer' : undefined}
      aria-current={props.active ? 'page' : undefined}
      sx={{
        minWidth: 0,
        maxWidth: '100%',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
      }}
    >
      {props.label}
    </ButtonBase>
  );
}
