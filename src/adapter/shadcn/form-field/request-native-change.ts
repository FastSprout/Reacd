export function requestNativeChange(blocked: boolean, request: () => void): void {
  if (!blocked) request();
}
