export interface EscapeScope {
  register: (dismiss: () => void) => () => void;
  dismiss: () => boolean;
}
export function createEscapeScope(): EscapeScope {
  const layers = new Map<symbol, () => void>();
  return {
    register(dismiss) {
      const key = Symbol('escape-layer');
      layers.set(key, dismiss);
      return () => {
        layers.delete(key);
      };
    },
    dismiss() {
      const handler = Array.from(layers.values()).at(-1);
      if (handler === undefined) return false;
      handler();
      return true;
    },
  };
}
