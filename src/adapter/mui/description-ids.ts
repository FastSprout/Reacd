export function materialDescriptionIds(
  inherited: readonly string[],
  localId: string,
  localText?: string,
): string | undefined {
  return [...inherited, ...(localText ? [localId] : [])].join(' ') || undefined;
}
