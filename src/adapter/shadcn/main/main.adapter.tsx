import { useContext } from 'react';
import type { MainProps } from '../../../components/main/main.js';
import { MainScopeContext } from '../../../renderer/main/main-scope.js';

export function ShadcnMain({ children }: MainProps) {
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
