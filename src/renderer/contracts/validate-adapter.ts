import { COMPONENT_NAMES } from '../../components/component-names.js';
import { isRecord } from '../../core/value.js';
import type { ThemeAdapter } from './theme-adapter.js';

const COMPONENT_SET = new Set<string>(COMPONENT_NAMES);

function isComponent(value: unknown): boolean {
  if (typeof value === 'function') return true;
  return (
    isRecord(value) &&
    (value['$$typeof'] === Symbol.for('react.forward_ref') ||
      value['$$typeof'] === Symbol.for('react.memo'))
  );
}

export function isThemeAdapter(value: unknown): value is ThemeAdapter {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    value['id'].trim().length === 0 ||
    !isComponent(value['Surface'])
  )
    return false;
  const components = value['components'];
  return (
    isRecord(components) &&
    Object.entries(components).every(([name, entry]) => {
      return (
        COMPONENT_SET.has(name) &&
        isRecord(entry) &&
        entry['name'] === name &&
        typeof entry['render'] === 'function'
      );
    })
  );
}

export function defineThemeAdapter(adapter: ThemeAdapter): ThemeAdapter {
  if (!isThemeAdapter(adapter)) {
    throw new Error('A theme adapter must declare valid SDK-backed component entries.');
  }
  Object.freeze(adapter.components);
  return Object.freeze(adapter);
}
