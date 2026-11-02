import { Children, Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { PAGE_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import type { PageListProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-list/page-list.props.js';

export type MuiPageListProps = PageListProps;
export function MuiPageList({ children,
  divide = PAGE_COMPOSITION_DEFAULTS.divide,
}: MuiPageListProps) {
  return (
    <List disablePadding sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {Children.toArray(children).map((child, index) => (
        <Fragment key={index}>
          {divide && index > 0 && <Divider component="li" />}
          <ListItem disableGutters sx={{ minWidth: 0 }}>{child}</ListItem>
        </Fragment>
      ))}
    </List>
  );
}
