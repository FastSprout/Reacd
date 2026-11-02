export function emitNativeValue<Value>(
  change: ((value: Value) => void) | undefined,
  value: Value,
  blocked: boolean,
): void {
  if (!blocked && change) change(value);
}
