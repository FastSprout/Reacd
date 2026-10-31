import ButtonBase from '@mui/material/ButtonBase';
import * as Tabs from '@radix-ui/react-tabs';
import type { TabsTriggerPrimitiveProps } from
  '../../../shared/primitives/tabs-trigger/tabs-trigger.props.js';
import { MUI_TABS_TRIGGER_STYLE } from '../styles.js';

export function MuiTabsTriggerPrimitive({
  children,
  ...properties
}: TabsTriggerPrimitiveProps) {
  return (
    <Tabs.Trigger {...properties} asChild>
      <ButtonBase sx={MUI_TABS_TRIGGER_STYLE}>{children}</ButtonBase>
    </Tabs.Trigger>
  );
}
