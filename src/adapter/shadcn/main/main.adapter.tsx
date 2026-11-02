import { useContext } from 'react';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import type { MainProps } from
  '@fastsprout/reacd/adapter-runtime/components/main/main.props.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnMainProps = MainProps;
export function ShadcnMain({ children }: MainProps) {
  const insideMain = useContext(MainScopeContext);
  return (
    <CardContent role={insideMain ? undefined : 'main'} className="min-w-0 p-0">
      <MainScopeContext.Provider value={true}>{children}</MainScopeContext.Provider>
    </CardContent>
  );
}
