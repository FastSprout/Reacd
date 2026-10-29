import { useContext } from 'react';
import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import type { CollapsibleProps } from '../../../components/collapsible/collapsible.js';
import { COLLAPSIBLE_DEFAULTS } from '../../../core/collapsible-policy.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnCollapsible({
  label,
  open,
  onOpenChange,
  children,
  disabled,
  showTrigger = COLLAPSIBLE_DEFAULTS.showTrigger,
  retainContent = COLLAPSIBLE_DEFAULTS.retainContent,
}: CollapsibleProps) {
  const ancestorActive = useContext(PortalActiveContext);
  return (
    <Primitive.Root
      className="reacd-node reacd-collapsible"
      data-slot="collapsible"
      open={open}
      disabled={disabled}
      onOpenChange={(next) => onOpenChange(next)}
    >
      {showTrigger && (
        <Primitive.Trigger
          data-slot="collapsible-trigger"
          className="reacd-node reacd-collapsible-trigger"
          render={<Button variant="outline" />}
        >
          <span>{label}</span>
          <ChevronDownIcon aria-hidden="true" />
        </Primitive.Trigger>
      )}
      <Primitive.Panel
        data-slot="collapsible-content"
        className="reacd-collapsible-panel"
        keepMounted={retainContent}
        hidden={!open}
        role="region"
        aria-label={label}
      >
        <PortalActiveContext.Provider value={open && ancestorActive}>
          {children}
        </PortalActiveContext.Provider>
      </Primitive.Panel>
    </Primitive.Root>
  );
}
