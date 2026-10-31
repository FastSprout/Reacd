export const ADAPTER_PACKAGE_POLICY = {
  name: '@fastsprout/reacd-shadcn',
  styles: '@fastsprout/reacd-shadcn/styles',
} as const;

export const ADAPTER_PACKAGE_ERROR =
  'Concrete adapter packages are selected by applications, not engine modules.';

export function isConcreteAdapterPackage(value: string): boolean {
  return (
    value === ADAPTER_PACKAGE_POLICY.name ||
    value.startsWith(`${ADAPTER_PACKAGE_POLICY.name}/`)
  );
}
