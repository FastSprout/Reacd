import type { AriaAttributes } from 'react';

export function materialFieldError(value: AriaAttributes['aria-invalid']): boolean {
  return value !== undefined && value !== false && value !== 'false';
}
