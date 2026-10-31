import { useContext } from 'react';
import type { MainProps } from
  '@fastsprout/reacd/adapter-runtime/components/main/main.js';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';

export function SharedMain({ children }: MainProps) {
  const nested = useContext(MainScopeContext);
  return (
    <MainScopeContext.Provider value>
      {nested ? (
        <section className="reacd-node reacd-main">{children}</section>
      ) : (
        <main className="reacd-node reacd-main">{children}</main>
      )}
    </MainScopeContext.Provider>
  );
}
