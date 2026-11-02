export interface RegistrationScope {
  declare: (name: string) => void;
  commit: (name: string, restore: () => void) => () => void;
  prepare: () => void;
}

export function createRegistrationScope(
  unregister: (names: string[]) => void,
): RegistrationScope {
  const declared = new Set<string>();
  const committed = new Map<string, () => void>();
  return {
    declare: (name) => {
      declared.add(name);
    },
    commit: (name, restore) => {
      committed.set(name, restore);
      restore();
      return () => {
        committed.delete(name);
      };
    },
    prepare: () => {
      const abandoned = [...declared].filter((name) => !committed.has(name));
      if (abandoned.length > 0) {
        unregister(abandoned);
        for (const name of abandoned) declared.delete(name);
      }
      for (const restore of committed.values()) restore();
    },
  };
}
