import { createContext, useCallback, useState } from 'react';

export interface BoundaryDefinition {
  readonly key: string;
  readonly label: string | undefined;
  readonly disabled: boolean | undefined;
}
interface BoundaryContextValue {
  readonly definitions: ReadonlyMap<string, readonly BoundaryDefinition[]>;
  readonly register: (region: string, definition: BoundaryDefinition) => () => void;
}
export const BoundaryContext = createContext<BoundaryContextValue | null>(null);
export function useBoundaryDefinitions(): BoundaryContextValue {
  const [definitions, setDefinitions] = useState<
    ReadonlyMap<string, readonly BoundaryDefinition[]>
  >(() => new Map());
  const register = useCallback((region: string, definition: BoundaryDefinition) => {
    setDefinitions((previous) => {
      const next = new Map(previous);
      next.set(region, [...(previous.get(region) ?? []), definition]);
      return next;
    });
    return () =>
      setDefinitions((previous) => {
        const next = new Map(previous);
        for (const [id, entries] of previous)
          if (id === region)
            next.set(
              id,
              entries.filter((entry) => entry.key !== definition.key),
            );
        return next;
      });
  }, []);
  return { definitions, register };
}
