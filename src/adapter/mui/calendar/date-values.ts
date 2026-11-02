import { format, isValid, parseISO } from 'date-fns';
import * as locales from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { DATE_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/date-time-policy.js';
import { isIsoDate } from '@fastsprout/reacd/adapter-runtime/core/date-time.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';

export function nativeDate(value: string): Date;
export function nativeDate(value: string | null): Date | null;
export function nativeDate(value: string | null): Date | null {
  return value === null ? null : parseISO(value);
}

export function canonicalDate(value: Date | null): string | null | undefined {
  if (value === null) return null;
  if (!isValid(value)) return undefined;
  const canonical = format(value, 'yyyy-MM-dd');
  return isIsoDate(canonical) ? canonical : undefined;
}

export function nativeDateLocale(component: string, code?: string): Locale {
  const requested = (code ?? DATE_TIME_POLICY.locale).toLowerCase();
  const available = Object.values(locales);
  const locale = available.find((item) => item.code.toLowerCase() === requested) ??
    available.find((item) =>
      item.code.toLowerCase().split('-')[0] === requested.split('-')[0]);
  if (!locale) throw new UnsupportedAdapterComponentError('material-ui', component);
  return locale;
}

export function emitNativeDate(
  onValueChange: (value: string | null) => void,
  value: Date | null,
  blocked: boolean,
) {
  const canonical = canonicalDate(value);
  if (!blocked && canonical !== undefined) onValueChange(canonical);
}
