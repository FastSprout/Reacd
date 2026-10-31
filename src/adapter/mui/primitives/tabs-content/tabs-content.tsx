import Box from '@mui/material/Box';
import * as Tabs from '@radix-ui/react-tabs';
import type { TabsContentPrimitiveProps } from
  '../../../shared/primitives/tabs-content/tabs-content.props.js';

export function MuiTabsContentPrimitive({
  children,
  ...properties
}: TabsContentPrimitiveProps) {
  return (
    <Tabs.Content {...properties} asChild>
      <Box>{children}</Box>
    </Tabs.Content>
  );
}
