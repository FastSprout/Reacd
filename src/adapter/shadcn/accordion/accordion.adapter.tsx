import { useContext } from 'react';
import type { AccordionProps } from
  '@fastsprout/reacd/adapter-runtime/components/accordion/accordion.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ACCORDION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/accordion-policy.js';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../vendor/ui/accordion.js';

export function ShadcnAccordion({
  label,
  items,
  value,
  onValueChange,
  disabled,
  mode = ACCORDION_DEFAULTS.mode,
  collapsible = ACCORDION_DEFAULTS.collapsible,
  retainContent = ACCORDION_DEFAULTS.retainContent,
}: AccordionProps) {
  const ancestorActive = useContext(PortalActiveContext);
  const content = items.map((item) => (
    <AccordionItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className="reacd-accordion-item"
    >
      <AccordionTrigger className="reacd-accordion-trigger">
        {item.label}
      </AccordionTrigger>
      <AccordionContent
        forceMount={retainContent ? true : undefined}
        hidden={retainContent && !value.includes(item.value)}
        className="reacd-accordion-content"
      >
        <PortalActiveContext.Provider
          value={ancestorActive && value.includes(item.value)}
        >
          {item.content}
        </PortalActiveContext.Provider>
      </AccordionContent>
    </AccordionItem>
  ));
  return mode === 'multiple' ? (
    <Accordion
      type="multiple"
      value={[...value]}
      className="reacd-node reacd-accordion"
      aria-label={label}
      role="group"
      disabled={disabled}
      onValueChange={onValueChange}
    >
      {content}
    </Accordion>
  ) : (
    <Accordion
      type="single"
      value={value[0] ?? ''}
      collapsible={collapsible}
      className="reacd-node reacd-accordion"
      aria-label={label}
      role="group"
      disabled={disabled}
      onValueChange={(next) => onValueChange(next === '' ? [] : [next])}
    >
      {content}
    </Accordion>
  );
}
