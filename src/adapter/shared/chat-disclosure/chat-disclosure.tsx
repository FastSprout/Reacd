import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { SharedChatShimmer } from '../chat-shimmer/chat-shimmer.adapter.js';
import { Button } from '../primitives/button.js';

export function ChatDisclosure({
  label,
  open,
  onOpenChange,
  disabled,
  active,
  children,
}: {
  label: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  disabled: boolean | undefined;
  active: boolean;
  children: ReactNode;
}) {
  const ancestorActive = useContext(PortalActiveContext);
  return (
    <Primitive.Root
      className="reacd-node reacd-collapsible reacd-chat-disclosure"
      open={open}
      disabled={disabled}
      onOpenChange={(value) => onOpenChange(value)}
    >
      <Primitive.Trigger
        aria-label={label}
        className="reacd-collapsible-trigger"
        render={<Button variant="outline" />}
      >
        <SharedChatShimmer text={label} active={active} />
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </Primitive.Trigger>
      <Primitive.Panel
        className="reacd-collapsible-panel reacd-chat-feedback-details"
        role="region"
        aria-label={label}
        hidden={!open}
        aria-busy={active}
      >
        <PortalActiveContext.Provider value={open && ancestorActive}>
          {children}
        </PortalActiveContext.Provider>
      </Primitive.Panel>
    </Primitive.Root>
  );
}
