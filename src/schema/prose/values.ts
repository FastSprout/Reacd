import { z } from 'zod';
import { PROSE_POLICY } from '../../core/prose-policy.js';

export function safeProseUrl(value: string, image: boolean): boolean {
  if (/\s|\\|\p{Cc}/u.test(value) || value.startsWith('//')) return false;
  try {
    const protocol = new URL(value, PROSE_POLICY.relativeOrigin).protocol;
    return (
      protocol === 'https:' ||
      protocol === 'http:' ||
      (!image && protocol === 'mailto:')
    );
  } catch {
    return false;
  }
}
export const proseTextSchema = z.string().max(PROSE_POLICY.maxTextLength);
export const proseUrlSchema = z
  .string()
  .min(1)
  .max(PROSE_POLICY.maxUrlLength)
  .refine((value) => safeProseUrl(value, false), 'Unsafe prose link.');
export const proseImageSchema = z
  .string()
  .min(1)
  .max(PROSE_POLICY.maxUrlLength)
  .refine((value) => safeProseUrl(value, true), 'Unsafe prose image.');
export const proseColorSchema = z
  .string()
  .regex(/^#(?:[\da-fA-F]{3}|[\da-fA-F]{4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/);
export const proseIdSchema = z
  .string()
  .min(1)
  .max(PROSE_POLICY.maxIdLength)
  .regex(/^[\p{L}\p{N}_][\p{L}\p{N}_.:-]*$/u);
