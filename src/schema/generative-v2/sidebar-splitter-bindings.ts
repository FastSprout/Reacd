import { z } from 'zod';
import { panelLayoutSchemaFor } from '../splitter/splitter.schema.js';
import type { GenerativeNode } from './document.schema.js';
import type { BindingContract } from './binding-contract.js';

export function sidebarSplitterBindings(node: GenerativeNode): BindingContract[] {
  if (node.type === 'Splitter')
    return [
      {
        reference: node.value,
        property: 'value',
        kinds: ['panelLayout'],
        mode: 'readWrite',
        schema: panelLayoutSchemaFor(node.panels),
      },
    ];
  if (node.type === 'Sidebar')
    return ['open', 'mobileOpen'].map((property) => ({
      reference: property === 'open' ? node.open : node.mobileOpen,
      property,
      kinds: ['boolean'],
      mode: 'readWrite',
      schema: z.boolean(),
    }));
  return [];
}
