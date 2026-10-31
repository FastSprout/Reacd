const TRUSTED_UI_SCOPES = [
  '@mui/',
  '@emotion/',
  '@radix-ui/',
  '@base-ui/',
  '@tiptap/',
  '@react-aria/',
  '@react-stately/',
  '@tailwindcss/',
] as const;

const TRUSTED_UI_PACKAGES = [
  '@daypicker/react',
  'react-aria-components',
  'react-dom',
  'lucide-react',
  'input-otp',
  'clsx',
  'class-variance-authority',
  'tailwind-merge',
  'tailwindcss',
] as const;

export function isTrustedUiDependency(value: string): boolean {
  return (
    TRUSTED_UI_SCOPES.some((scope) => value.startsWith(scope)) ||
    TRUSTED_UI_PACKAGES.some((name) => value === name || value.startsWith(`${name}/`))
  );
}
