import { createEditorNodeSchema } from '../editor/generative.schema.js';
import { carouselNodeSchema } from '../carousel/generative.schema.js';
import { z } from 'zod';
import { createFormNodeSchema } from '../form/generative.schema.js';
import { createFormFieldNodeSchema } from '../form-field/generative.schema.js';
import { chatPromptNodeSchema } from '../chat-prompt/generative.schema.js';
import { chatPaletteNodeSchema } from '../chat-palette/generative.schema.js';
import { cardNodeSchema } from '../card/generative.schema.js';
import { authFormNodeSchema } from '../auth-form/generative.schema.js';
import { pageLogosNodeSchema } from '../page-logos/generative.schema.js';
import { contentSearchNodeSchema } from '../content-search/generative.schema.js';
import { dashboardNodeSchemas } from './dashboard-nodes.schema.js';
import { editorialNodeSchemas } from './editorial-nodes.schema.js';
import { pricingNodeSchemas } from './pricing-nodes.schema.js';
import { drawerNodeSchema } from '../drawer/generative.schema.js';
import { slideoverNodeSchema } from '../slideover/generative.schema.js';
import { contextMenuNodeSchema } from '../context-menu/generative.schema.js';
import { sidebarNodeSchema } from '../sidebar/generative.schema.js';
import { splitterNodeSchema } from '../splitter/generative.schema.js';
import { pageNavigationNodeSchemas } from './page-navigation-nodes.schema.js';
import { footerColumnsNodeSchema } from '../footer-columns/generative.schema.js';
import { stepperNodeSchema } from '../stepper/generative.schema.js';
import { pagePresentationNodeSchemas } from './page-presentation-nodes.schema.js';
import { DOCUMENT_POLICY, LAYOUT_POLICY } from '../../core/policy.js';
import { GENERATIVE_POLICY } from '../../core/state-policy.js';
import { spacingSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { stateDefinitionsSchema } from '../state/definitions.schema.js';
import { leafNodeSchemas } from './leaf-nodes.schema.js';
import { accordionNodeSchema } from '../accordion/generative.schema.js';
import { modalNodeSchema } from '../modal/generative.schema.js';
import { collapsibleNodeSchema } from '../collapsible/generative.schema.js';
import { chipNodeSchema } from '../chip/generative.schema.js';
import { tooltipNodeSchema } from '../tooltip/generative.schema.js';
import { popoverNodeSchema } from '../popover/generative.schema.js';
import { emptyNodeSchema } from '../empty/generative.schema.js';
import { shellNodeSchemas } from './shell-nodes.schema.js';
import { tabsNodeSchema } from '../tabs/generative.schema.js';
import { pageNodeSchemas } from './page-nodes.schema.js';
import type { GenerativeNode } from './generative-node.js';

export type { GenerativeNode } from './generative-node.js';
export { visitGenerativeNodes } from './visit-nodes.js';

export const generativeNodeSchema: z.ZodType<GenerativeNode> = z.lazy(() => {
  const stack = {
    children: z.array(generativeNodeSchema).max(DOCUMENT_POLICY.maxChildren),
    spacing: spacingSchema,
  };
  return z.discriminatedUnion('type', [
    createEditorNodeSchema(generativeNodeSchema),
    createFormNodeSchema(generativeNodeSchema),
    createFormFieldNodeSchema(generativeNodeSchema),
    chatPromptNodeSchema(generativeNodeSchema),
    chatPaletteNodeSchema(generativeNodeSchema),
    carouselNodeSchema(generativeNodeSchema),
    authFormNodeSchema(generativeNodeSchema),
    pageLogosNodeSchema,
    z.strictObject({ type: z.literal('VStack'), ...stack }),
    z.strictObject({ type: z.literal('HStack'), ...stack }),
    cardNodeSchema(generativeNodeSchema),
    z.strictObject({
      type: z.literal('Grid'),
      ...stack,
      columns: z
        .number()
        .int()
        .min(LAYOUT_POLICY.minGridColumns)
        .max(LAYOUT_POLICY.maxGridColumns),
    }),
    ...leafNodeSchemas,
    contentSearchNodeSchema(generativeNodeSchema),
    ...dashboardNodeSchemas(generativeNodeSchema),
    ...editorialNodeSchemas(generativeNodeSchema),
    ...pricingNodeSchemas(generativeNodeSchema),
    drawerNodeSchema(generativeNodeSchema),
    slideoverNodeSchema(generativeNodeSchema),
    contextMenuNodeSchema(generativeNodeSchema),
    sidebarNodeSchema(generativeNodeSchema),
    splitterNodeSchema(generativeNodeSchema),
    ...pageNavigationNodeSchemas(generativeNodeSchema),
    footerColumnsNodeSchema(generativeNodeSchema),
    stepperNodeSchema(generativeNodeSchema),
    ...pagePresentationNodeSchemas(generativeNodeSchema),
    tabsNodeSchema(generativeNodeSchema),
    ...pageNodeSchemas(generativeNodeSchema),
    ...shellNodeSchemas(generativeNodeSchema),
    emptyNodeSchema(generativeNodeSchema),
    chipNodeSchema(generativeNodeSchema),
    tooltipNodeSchema(generativeNodeSchema),
    popoverNodeSchema(generativeNodeSchema),
    accordionNodeSchema(generativeNodeSchema),
    modalNodeSchema(generativeNodeSchema),
    collapsibleNodeSchema(generativeNodeSchema),
  ]);
});

export const generativeDocumentSchema = z.strictObject({
  $schema: z.literal(GENERATIVE_POLICY.schemaId).optional(),
  schemaVersion: z.literal(GENERATIVE_POLICY.version),
  templateId: stateKeySchema.optional(),
  state: stateDefinitionsSchema,
  root: generativeNodeSchema,
});

export type GenerativeDocument = z.infer<typeof generativeDocumentSchema>;
export type GenerativeDeclaration = z.input<typeof generativeDocumentSchema>;
