import type { z } from 'zod';
import type { bannerSchema } from '../../schema/banner/banner.schema.js';
export type BannerProps = z.infer<typeof bannerSchema>;
