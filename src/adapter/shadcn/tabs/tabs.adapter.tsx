import { useContext, useId } from 'react';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import type { TabsProps } from '../../../components/tabs/tabs.js';
import { TABS_POLICY } from '../../../core/tabs-policy.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../vendor/ui/tabs.js';

export function ShadcnTabs({
  children,
  label,
  value,
  items,
  onValueChange,
  orientation = TABS_POLICY.orientation,
  activationMode = TABS_POLICY.activationMode,
}: TabsProps) {
  const sharedPanelId = useId();
  const active = useContext(PortalActiveContext);
  const explicit = items.some(
    (item) => item.value === value && item.content !== undefined,
  );
  const selectedIndex = items.findIndex((item) => item.value === value);
  return (
    <Tabs
      className="reacd-node reacd-tabs"
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
    >
      <TabsList aria-label={label}>
        {items.map((item, index) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            {...(item.content === undefined
              ? {
                  id: `${sharedPanelId}-${index}`,
                  'aria-controls': sharedPanelId,
                }
              : {})}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) =>
        item.content === undefined ? null : (
          <TabsContent
            key={item.value}
            value={item.value}
            forceMount
            hidden={item.value !== value}
          >
            <PortalActiveContext value={active && item.value === value}>
              {item.content}
            </PortalActiveContext>
          </TabsContent>
        ),
      )}
      <div
        role="tabpanel"
        id={sharedPanelId}
        tabIndex={0}
        hidden={explicit}
        aria-labelledby={explicit ? undefined : `${sharedPanelId}-${selectedIndex}`}
      >
        <PortalActiveContext value={active && !explicit}>
          {children}
        </PortalActiveContext>
      </div>
    </Tabs>
  );
}
