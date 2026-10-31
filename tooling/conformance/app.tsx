import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { Workbench } from './workbench.js';

export function App() {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <Workbench />
    </ReacdProvider>
  );
}
