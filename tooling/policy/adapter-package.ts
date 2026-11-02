import { relative } from 'node:path';

export const ADAPTER_PACKAGE_POLICY = {
  name: '@fastsprout/reacd-shadcn',
  styles: '@fastsprout/reacd-shadcn/styles',
  packages: ['@fastsprout/reacd-shadcn', '@fastsprout/reacd-mui'],
} as const;

export const ADAPTER_PACKAGE_ERROR =
  'Concrete adapters belong to the default composition boundary or applications.';

export function isDefaultAdapterBinding(file: string, value: string, root: string) {
  const path = relative(root, file);
  return (
    (path === 'src/state/provider/default-adapter.ts' &&
      value === ADAPTER_PACKAGE_POLICY.name) ||
    (path === 'src/styles.ts' && value === ADAPTER_PACKAGE_POLICY.styles)
  );
}

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
