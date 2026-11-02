import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import type { ToolbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/toolbar/toolbar.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiToolbarProps = ToolbarProps;

export function MuiToolbar(props: MuiToolbarProps) {
  const theme = useTheme();
  return (
    <Toolbar
      role="toolbar"
      aria-label={props.label}
      sx={{ flexWrap: 'wrap', gap: materialSpacing(theme) }}
    >
      {props.children}
    </Toolbar>
  );
}
