export function emitTabValue(change: (value: string) => void, value: unknown): void {
  if (typeof value === 'string') change(value);
}
