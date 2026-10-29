import type { z } from 'zod';
import { fieldGroupNodeSchema } from '../field-group/generative.schema.js';
import { containerNodeSchema } from '../container/generative.schema.js';
import { mainNodeSchema } from '../main/generative.schema.js';
import { headerNodeSchema } from '../header/generative.schema.js';
import { footerNodeSchema } from '../footer/generative.schema.js';
import { separatorNodeSchema } from '../separator/generative.schema.js';
import { bannerNodeSchema } from '../banner/generative.schema.js';
import { appNodeSchema } from '../app/generative.schema.js';
import { errorNodeSchema } from '../error/generative.schema.js';
import { themeNodeSchema } from '../theme/generative.schema.js';
import { scrollAreaNodeSchema } from '../scroll-area/generative.schema.js';

export function shellNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    fieldGroupNodeSchema(content),
    appNodeSchema(content),
    errorNodeSchema(content),
    themeNodeSchema(content),
    scrollAreaNodeSchema(content),
    containerNodeSchema(content),
    mainNodeSchema(content),
    headerNodeSchema(content),
    footerNodeSchema(content),
    separatorNodeSchema(content),
    bannerNodeSchema(content),
  ] as const;
}
