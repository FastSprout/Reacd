import { FRAMEWORK_ERRORS } from '../../core/errors.js';

export function assertComponent(type: unknown): void {
  if (typeof type === 'string') {
    throw new Error(FRAMEWORK_ERRORS.nativeElement);
  }
}
