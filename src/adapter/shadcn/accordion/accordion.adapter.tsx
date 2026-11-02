import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import type { AccordionProps } from
  '@fastsprout/reacd/adapter-runtime/components/accordion/accordion.props.js';
import { ACCORDION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/accordion-policy.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../vendor/ui/accordion.js';

export type ShadcnAccordionProps = AccordionProps;
export function ShadcnAccordion({
  label,
  items,
  value,
  onValueChange,
  mode = ACCORDION_DEFAULTS.mode,
  collapsible = ACCORDION_DEFAULTS.collapsible,
  retainContent,
  disabled,
}: AccordionProps) {
  const { active, interactive } = useInteractionState();
  const children = items.map((item) => (
    <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
      <AccordionTrigger>{item.label}</AccordionTrigger>
      <AccordionContent
        forceMount={retainContent ? true : undefined}
        hidden={retainContent && !value.includes(item.value)}
      >
        <PortalActiveContext value={active && value.includes(item.value)}>
          {item.content}
        </PortalActiveContext>
      </AccordionContent>
    </AccordionItem>
  ));
  return mode === 'multiple' ? (
    <Accordion
      type="multiple"
      aria-label={label}
      disabled={disabled || !interactive}
      value={[...value]}
      onValueChange={onValueChange}
    >
      {children}
    </Accordion>
  ) : (
    <Accordion
      type="single"
      aria-label={label}
      disabled={disabled || !interactive}
      value={value[0] ?? ''}
      collapsible={collapsible}
      onValueChange={(next) => onValueChange(next ? [next] : [])}
    >
      {children}
    </Accordion>
  );
}
