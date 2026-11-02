import type { ThemeAdapter } from '@fastsprout/reacd';

let pending: Promise<ThemeAdapter> | undefined;

export function loadMaterialAdapter(): Promise<ThemeAdapter> {
  pending ??= import('@fastsprout/reacd-mui').then((module) => module.muiAdapter);
  return pending;
}
