import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface ShellLayout {
  readonly height: number;
  readonly reportHeight?: (height: number) => void;
}

export const ShellLayoutContext = createContext<ShellLayout>({ height: 0 });

export function ShadcnShellLayout({ children }: { readonly children: ReactNode }) {
  const [height, reportHeight] = useState(0);
  const layout = useMemo(() => ({ height, reportHeight }), [height]);
  return (
    <ShellLayoutContext.Provider value={layout}>{children}</ShellLayoutContext.Provider>
  );
}
