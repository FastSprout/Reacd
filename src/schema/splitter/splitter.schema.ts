import { z } from 'zod';
import { SPLITTER_ORIENTATIONS, SPLITTER_POLICY } from '../../core/splitter-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { panelLayoutValueSchema } from '../state/panel-layout/panel-layout.schema.js';
import type { PanelLayout } from '../state/panel-layout/panel-layout.schema.js';
import type { PanelConstraint } from '../../core/splitter.js';
import { validPanelRange, validCollapsedShare } from '../../core/splitter.js';

export const splitterPanelSchema = z
  .strictObject({
    id: stateKeySchema,
    label: labelSchema,
    content: childrenSchema,
    minShare: z
      .number()
      .finite()
      .min(SPLITTER_POLICY.zero)
      .max(SPLITTER_POLICY.total)
      .default(SPLITTER_POLICY.minShare),
    maxShare: z
      .number()
      .finite()
      .min(SPLITTER_POLICY.zero)
      .max(SPLITTER_POLICY.total)
      .default(SPLITTER_POLICY.maxShare),
    collapsedShare: z
      .number()
      .finite()
      .min(SPLITTER_POLICY.zero)
      .max(SPLITTER_POLICY.total)
      .optional(),
  })
  .refine(validPanelRange, 'A panel minimum cannot exceed its maximum.')
  .refine(
    validCollapsedShare,
    'A collapsed share must be smaller than its expanded minimum.',
  );

export const splitterPanelsSchema = z
  .array(splitterPanelSchema)
  .min(SPLITTER_POLICY.minPanels)
  .max(SPLITTER_POLICY.maxPanels)
  .refine(
    (panels) => new Set(panels.map((panel) => panel.id)).size === panels.length,
    'Panel identities must be unique.',
  )
  .readonly();

export function panelLayoutSchemaFor(panels: readonly PanelConstraint[]) {
  return panelLayoutValueSchema.refine(
    (layout) =>
      layout.length === panels.length &&
      layout.every((item, index) => {
        const panel = panels[index];
        return (
          panel !== undefined &&
          item.id === panel.id &&
          (item.share === panel.collapsedShare ||
            (item.share >= panel.minShare && item.share <= panel.maxShare))
        );
      }),
    'Panel layout must match the declared identities and constraints.',
  );
}

export const splitterSchema = z
  .strictObject({
    label: labelSchema,
    panels: splitterPanelsSchema,
    value: panelLayoutValueSchema,
    onValueChange: z.custom<(value: PanelLayout) => void>(
      (value) => typeof value === 'function',
      'Expected a panel-layout callback.',
    ),
    orientation: z.enum(SPLITTER_ORIENTATIONS).optional(),
    disabled: z.boolean().optional(),
  })
  .superRefine((properties, context) => {
    const result = panelLayoutSchemaFor(properties.panels).safeParse(properties.value);
    if (!result.success)
      for (const issue of result.error.issues)
        context.addIssue({ code: 'custom', path: ['value'], message: issue.message });
  });
