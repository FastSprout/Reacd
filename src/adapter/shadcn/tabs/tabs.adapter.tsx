import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import type { TabsProps } from
  '@fastsprout/reacd/adapter-runtime/components/tabs/tabs.props.js';
import { TABS_POLICY } from '@fastsprout/reacd/adapter-runtime/core/tabs-policy.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../vendor/ui/tabs.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnTabsProps = TabsProps;
export function ShadcnTabs({
  label,
  items,
  value,
  onValueChange,
  orientation = TABS_POLICY.orientation,
  activationMode = TABS_POLICY.activationMode,
  children,
}: TabsProps) {
  const { active, interactive } = useInteractionState();
  const selected = items.find((item) => item.value === value);
  const sharedActive = active && selected !== undefined && selected.content == null;
  return (
    <Tabs
      value={value}
      {...(interactive ? { onValueChange } : {})}
      orientation={orientation}
      activationMode={activationMode}
      className="min-w-0 max-w-full"
    >
      <TabsList
        aria-label={label}
        className={orientation === 'vertical'
          ? 'flex h-auto w-full min-w-0 flex-col items-stretch'
          : 'flex h-auto w-full min-w-0 flex-wrap'}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={!interactive || item.disabled}
            className="min-w-0 flex-1 whitespace-normal [overflow-wrap:anywhere]"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}
          forceMount hidden={item.value !== value}>
          <PortalActiveContext value={active && item.value === value}>
            {item.content}
          </PortalActiveContext>
        </TabsContent>
      ))}
      <CardContent hidden={!sharedActive} className="p-0">
        <PortalActiveContext value={sharedActive}>
          {children}
        </PortalActiveContext>
      </CardContent>
    </Tabs>
  );
}
