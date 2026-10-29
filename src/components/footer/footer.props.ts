import type { z } from 'zod';
import type { footerSchema } from '../../schema/footer/footer.schema.js';

export type FooterProps = z.infer<typeof footerSchema>;
