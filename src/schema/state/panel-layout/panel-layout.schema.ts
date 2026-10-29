import { z } from 'zod';
import { SPLITTER_POLICY } from '../../../core/splitter-policy.js';
import { stateDefinitionShape, stateKeySchema } from '../shared/definition.js';

export const panelShareSchema = z.strictObject({
  id: stateKeySchema,
  share: z.number().finite().min(SPLITTER_POLICY.zero).max(SPLITTER_POLICY.total),
});

export const panelLayoutValueSchema = z
  .array(panelShareSchema)
  .min(SPLITTER_POLICY.minPanels)
  .max(SPLITTER_POLICY.maxPanels)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    'Panel identities must be unique.',
  )
  .refine(
    (items) =>
      Math.abs(
        items.reduce<number>(
          (total, item) => total + item.share,
          SPLITTER_POLICY.zero,
        ) - SPLITTER_POLICY.total,
      ) <= SPLITTER_POLICY.tolerance,
    'Panel shares must total 100.',
  )
  .readonly();

export const panelLayoutStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('panelLayout'),
    initial: panelLayoutValueSchema,
  })
  .readonly();

export type PanelLayout = z.infer<typeof panelLayoutValueSchema>;
