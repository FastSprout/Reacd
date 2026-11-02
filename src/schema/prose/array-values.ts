export function proseArrayValues(value: readonly unknown[]): readonly unknown[] | null {
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Array.prototype) return null;
  if (
    Object.getOwnPropertyNames(value).length !== value.length + 1 ||
    Object.getOwnPropertySymbols(value).length > 0
  )
    return null;
  const result: unknown[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const property = Object.getOwnPropertyDescriptor(value, String(index));
    if (
      property === undefined ||
      property.get !== undefined ||
      property.set !== undefined
    )
      return null;
    const child: unknown = property.value;
    result.push(child);
  }
  return result;
}
