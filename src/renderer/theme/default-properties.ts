export function defaultProperties(
  properties: unknown,
  defaults: object | undefined,
): object {
  const supplied =
    typeof properties === 'object' && properties !== null
      ? Object.fromEntries(
          Object.entries(properties).filter(([, value]) => value !== undefined),
        )
      : {};
  return { ...defaults, ...supplied };
}
