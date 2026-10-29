import type { z } from 'zod';
import type {
  footerColumnsSchema,
} from '../../schema/footer-columns/footer-columns.schema.js';
export type FooterColumnsProps = z.infer<typeof footerColumnsSchema>;
