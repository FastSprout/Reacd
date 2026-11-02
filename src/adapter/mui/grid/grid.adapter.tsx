import { Children } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import type { GridProps } from
  '@fastsprout/reacd/adapter-runtime/components/grid/grid.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiGridProps = GridProps;

export function MuiGrid(props: MuiGridProps) {
  const theme = useTheme();
  const gap = materialSpacing(theme, props.spacing);
  const requested = `calc((100% - ${props.columns - 1} * ${gap}) / ${props.columns})`;
  const minimum = `min(100%, max(${LAYOUT_POLICY.gridTrackRem}rem, ${requested}))`;
  return (
    <Grid
      container
      sx={{
        display: 'grid',
        gap,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minimum}, 1fr))`,
      }}
    >
      {Children.map(props.children, (child) => (
        <Grid sx={{ minWidth: 0 }}>{child}</Grid>
      ))}
    </Grid>
  );
}
