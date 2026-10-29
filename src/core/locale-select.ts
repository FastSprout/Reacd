export function isCanonicalLocale(code: string): boolean {
  try {
    return Intl.getCanonicalLocales(code)[0] === code;
  } catch {
    return false;
  }
}
