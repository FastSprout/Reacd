import { z } from 'zod';
import { DATE_TIME_POLICY } from '../../core/date-time-policy.js';

export const dateLocaleSchema = z
  .string()
  .min(1)
  .max(DATE_TIME_POLICY.maxLocaleLength)
  .refine((locale) => {
    try {
      return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0;
    } catch {
      return false;
    }
  }, 'Expected a supported BCP 47 date locale.');
