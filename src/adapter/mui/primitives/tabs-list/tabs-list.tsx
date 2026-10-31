import Paper from '@mui/material/Paper';
import * as Tabs from '@radix-ui/react-tabs';
import type { TabsListPrimitiveProps } from
  '../../../shared/primitives/tabs-list/tabs-list.props.js';
import { MUI_PRIMITIVE_DEFAULTS } from '../appearance.js';

export function MuiTabsListPrimitive({
  children,
  ...properties
}: TabsListPrimitiveProps) {
  return (
    <Tabs.List {...properties} asChild>
      <Paper elevation={MUI_PRIMITIVE_DEFAULTS.flatElevation}>{children}</Paper>
    </Tabs.List>
  );
}
