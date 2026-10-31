export const ADAPTER_PACKAGE_POLICY = {
  name: '@fastsprout/reacd-shadcn',
  styles: '@fastsprout/reacd-shadcn/styles',
  packages: ['@fastsprout/reacd-shadcn', '@fastsprout/reacd-mui'],
} as const;

export const ADAPTER_PACKAGE_ERROR =
  'Concrete adapter packages are selected by applications, not engine modules.';

export function isConcreteAdapterPackage(value: string): boolean {
  return ADAPTER_PACKAGE_POLICY.packages.some(
    (name) => value === name || value.startsWith(`${name}/`),
  );
}

export function isAdapterEntry(value: string): boolean {
  return ADAPTER_PACKAGE_POLICY.packages.some(
    (name) => value === name || value === `${name}/styles`,
  );
}
