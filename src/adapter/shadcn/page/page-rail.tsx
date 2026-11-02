import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useContext, useState } from 'react';
import { DOCUMENTATION_LAYOUT_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';
import type { ReactNode } from 'react';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ScrollArea } from '../vendor/ui/scroll-area.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../vendor/ui/accordion.js';

export function ShadcnPageRail({
  children,
  label,
  wide,
}: {
  readonly children: ReactNode;
  readonly label: string;
  readonly wide: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const active = useContext(PortalActiveContext);
  const interactive = useInteractionState().interactive;
  const open = wide || expanded;
  return (
    <Accordion
      type="single"
      collapsible
      disabled={!interactive}
      value={open ? 'content' : ''}
      onValueChange={(value) => setExpanded(value !== '')}
    >
      <AccordionItem value="content" className="border-0">
        <AccordionTrigger className="reacd-page-rail-toggle">{label}</AccordionTrigger>
        <AccordionContent forceMount hidden={!open} className="p-0">
          <ScrollArea
            className="min-w-0 max-w-full"
            viewportProps={{
              role: 'region',
              'aria-label': label,
              tabIndex: 0,
              style: {
                overflowY: POLICY.railOverflow,
                maxBlockSize:
                  'min(100dvh, max(var(--page-rail-minimum), ' +
                  'calc(100dvh - var(--shell-block-size) - ' +
                  '2 * var(--page-gutter))))',
              },
            }}
          >
            <PortalActiveContext.Provider value={active && open}>
              {children}
            </PortalActiveContext.Provider>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
