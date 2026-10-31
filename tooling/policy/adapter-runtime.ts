export const ADAPTER_RUNTIME_POLICY = {
  namespace: '@fastsprout/reacd/adapter-runtime',
  prefix: '@fastsprout/reacd/adapter-runtime/',
  layers: new Set(['core', 'schema', 'components', 'renderer']),
  segment: /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/,
  extension: '.js',
} as const;

export const ADAPTER_RUNTIME_ERROR =
  'Adapter runtime exposes core, schema, components and renderer modules only.';

export function adapterRuntimeError(value: string): string | null {
  const policy = ADAPTER_RUNTIME_POLICY;
  if (value !== policy.namespace && !value.startsWith(policy.prefix)) return null;
  const path = value.slice(policy.prefix.length);
  const segments = path.split('/');
  if (
    !policy.layers.has(segments.slice(0, 1).join('/')) ||
    !path.endsWith(policy.extension) ||
    segments.some((segment) => !policy.segment.test(segment))
  )
    return ADAPTER_RUNTIME_ERROR;
  return null;
}
