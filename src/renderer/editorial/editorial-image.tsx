import type { z } from 'zod';
import type { editorialImageSchema } from '../../schema/shared/editorial.js';
import { SafeImage } from '../media/safe-image.js';

export function EditorialImage({ src, alt }: z.infer<typeof editorialImageSchema>) {
  return <SafeImage src={src} alt={alt} presentation="editorial" />;
}
