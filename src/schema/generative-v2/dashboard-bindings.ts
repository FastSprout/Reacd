import { z } from 'zod';
import type { GenerativeNode } from './document.schema.js';
import type { BindingContract } from './binding-contract.js';
import { commandQuerySchema } from '../command-palette/command-palette.schema.js';
import { commandSelectionSchema } from '../command-palette/generative.schema.js';
import { panelLayoutSchemaFor } from '../splitter/splitter.schema.js';

export function dashboardBindings(node: GenerativeNode): BindingContract[] {
  if (node.type === 'DashboardGroup')
    return [
      {
        reference: node.value,
        property: 'value',
        kinds: ['panelLayout'],
        mode: 'readWrite',
        schema: panelLayoutSchemaFor(node.regions),
      },
      ...(['open', 'mobileOpen'] as const).map((property) => ({
        reference: node[property],
        property,
        kinds: ['boolean'] as const,
        mode: 'readWrite' as const,
        schema: z.boolean(),
      })),
    ];
  if (node.type === 'DashboardSearch')
    return [
      {
        reference: node.open,
        property: 'open',
        kinds: ['boolean'],
        mode: 'readWrite',
        schema: z.boolean(),
      },
      {
        reference: node.query,
        property: 'query',
        kinds: ['text'],
        mode: 'readWrite',
        schema: commandQuerySchema,
      },
      ...(node.selection === undefined
        ? []
        : [
            {
              reference: node.selection,
              property: 'selection',
              kinds: ['text'] as const,
              mode: 'readWrite' as const,
              schema: commandSelectionSchema(node.groups),
            },
          ]),
    ];
  return [];
}
