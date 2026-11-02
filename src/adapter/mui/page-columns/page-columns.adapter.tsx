import { Children } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { PageColumnsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-columns/page-columns.props.js';
import { PAGE_COMPOSITION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageColumnsProps = PageColumnsProps;
export function MuiPageColumns({ children }: MuiPageColumnsProps) {
  const gap = materialSpacing(useTheme());
  return (
    <Box sx={{ minWidth: 0, overflowWrap: 'anywhere',
      columnCount: PAGE_COMPOSITION_POLICY.maximumColumns,
      columnWidth: `${PAGE_COMPOSITION_POLICY.columnTrackRem}rem`, columnGap: gap,
    }}>
      {Children.map(children, (child) => child == null ? null : (
        <Box sx={{ minWidth: 0, breakInside: 'avoid', marginBlockEnd: gap }}>
          {child}
        </Box>
      ))}
    </Box>
  );
}
