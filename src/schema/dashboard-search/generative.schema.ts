import { z } from 'zod';
import { commandPaletteNodeSchema } from '../command-palette/generative.schema.js';
import { dashboardSearchSchema } from './dashboard-search.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export const dashboardSearchNodeSchema = z
  .strictObject({
    ...commandPaletteNodeSchema.shape,
    type: z.literal('DashboardSearch'),
    open: writeStateBindingSchema,
    title: dashboardSearchSchema.shape.title,
    description: dashboardSearchSchema.shape.description,
  })
  .refine(
    (node) =>
      node.selection !== undefined ||
      node.groups.every((group) =>
        group.items.every(
          (item) => item.href !== undefined || item.action !== undefined,
        ),
      ),
    'Every command needs a target or a selection binding.',
  )
  .refine(
    (node) => node.selection === undefined || node.selection.state !== node.query.state,
    {
      path: ['selection'],
      message: 'Query and selected-command state keys must differ.',
    },
  );
