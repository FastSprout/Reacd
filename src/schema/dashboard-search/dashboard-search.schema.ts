import { z } from 'zod';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { commandPaletteSchema } from '../command-palette/command-palette.schema.js';

export const dashboardSearchSchema = z
  .strictObject({
    ...commandPaletteSchema.shape,
    title: labelSchema.optional(),
    description: labelSchema.optional(),
    open: z.boolean(),
    onOpenChange: booleanChangeSchema,
  })
  .refine(
    (properties) =>
      commandPaletteSchema.safeParse({
        label: properties.label,
        query: properties.query,
        onQueryChange: properties.onQueryChange,
        groups: properties.groups,
        onSelect: properties.onSelect,
        filtering: properties.filtering,
        status: properties.status,
        disabled: properties.disabled,
        emptyMessage: properties.emptyMessage,
        loadingMessage: properties.loadingMessage,
        errorMessage: properties.errorMessage,
      }).success,
    'Every search command needs a target or a selection callback.',
  );
