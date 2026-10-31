import { useContext } from 'react';
import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import { ChevronDownIcon } from 'lucide-react';
import type { CollapsibleProps } from
  '@fastsprout/reacd/adapter-runtime/components/collapsible/collapsible.js';
import { COLLAPSIBLE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/collapsible-policy.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Button } from '../primitives/button.js';

export function SharedCollapsible({
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
