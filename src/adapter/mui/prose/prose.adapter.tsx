import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { ProseProps } from
  '@fastsprout/reacd/adapter-runtime/components/prose/prose.props.js';
import { materialSpacing } from '../layout/spacing.js';
import { MuiProseBlocks } from './blocks.js';

export type MuiProseProps = ProseProps;
export function MuiProse({ document }: MuiProseProps) {
  const theme = useTheme();
  return (
    <Stack spacing={materialSpacing(theme)} sx={{ minWidth: 0 }}>
      <MuiProseBlocks nodes={document} />
    </Stack>
  );
}
