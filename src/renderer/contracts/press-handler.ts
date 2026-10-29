export function pressHandler(action: (() => void) | undefined) {
  return action === undefined ? undefined : () => action();
}
