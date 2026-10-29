import type { ColorMode, ResolvedColorMode } from './color-mode-policy.js';

export function resolveColorMode(
  preference: ColorMode,
  systemMode: ResolvedColorMode,
): ResolvedColorMode {
  return preference === 'system' ? systemMode : preference;
}

export function oppositeColorMode(mode: ResolvedColorMode): ResolvedColorMode {
  return mode === 'dark' ? 'light' : 'dark';
}

export function consistentColorMode(properties: {
  value: ColorMode;
  resolvedMode: ResolvedColorMode;
}): boolean {
  return properties.value === 'system' || properties.value === properties.resolvedMode;
}
