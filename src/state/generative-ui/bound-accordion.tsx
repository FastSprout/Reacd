import { useMemo } from 'react';
import { Accordion } from '../../components/accordion/accordion.js';
import type { AccordionProps } from '../../components/accordion/accordion.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import {
  accordionValuesSchema,
  validAccordionSelection,
} from '../../schema/accordion/accordion.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['selection'], mode: 'readWrite' } as const;
export function BoundAccordion({
  node,
  registry,
  items,
}: {
  node: Extract<GenerativeNode, { type: 'Accordion' }>;
  registry: StateRegistry;
  items: AccordionProps['items'];
}) {
  const schema = useMemo(
    () =>
      accordionValuesSchema.refine((value) =>
        validAccordionSelection({
          items: node.items,
          mode: node.mode,
          collapsible: node.collapsible,
          value,
        }),
      ),
    [node.items, node.mode, node.collapsible],
  );
  const result = useBoundValue(registry, node.value, TARGET, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Accordion
      label={node.label}
      items={items}
      mode={node.mode}
      collapsible={node.collapsible}
      retainContent={node.retainContent}
      disabled={node.disabled}
      value={result.data.value}
      onValueChange={result.data.write}
    />
  );
}
