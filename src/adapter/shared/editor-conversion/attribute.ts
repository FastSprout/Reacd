export function sdkAttribute(
  entity: { readonly attrs: Readonly<Record<string, unknown>> },
  key: string,
): unknown {
  return entity.attrs[key];
}
