import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useId } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { TabsProps } from
  '@fastsprout/reacd/adapter-runtime/components/tabs/tabs.props.js';
import { emitTabValue } from './tabs-change.js';
import { TABS_POLICY } from '@fastsprout/reacd/adapter-runtime/core/tabs-policy.js';

export type MuiTabsProps = TabsProps;

export function MuiTabs(props: MuiTabsProps) {
  const id = useId();
  const { active, interactive } = useInteractionState();
  return (
    <Box>
      <Tabs
        value={props.value}
        aria-label={props.label}
        orientation={props.orientation ?? TABS_POLICY.orientation}
        selectionFollowsFocus={props.activationMode !== 'manual'}
        onChange={(_event, value: unknown) => {
          emitTabValue(props.onValueChange, value);
        }}
      >
        {props.items.map((item, index) => (
          <Tab
            key={item.value}
            value={item.value}
            label={item.label}
            disabled={!interactive || Boolean(item.disabled)}
            id={`${id}-${index}-tab`}
            aria-controls={`${id}-${index}-panel`}
          />
        ))}
      </Tabs>
      {props.items.map((item, index) => (
        <Box
          key={item.value}
          role="tabpanel"
          id={`${id}-${index}-panel`}
          aria-labelledby={`${id}-${index}-tab`}
          hidden={item.value !== props.value}
        >
          <PortalActiveContext value={active && item.value === props.value}>
            {item.content}
          </PortalActiveContext>
        </Box>
      ))}
      {props.children}
    </Box>
  );
}
