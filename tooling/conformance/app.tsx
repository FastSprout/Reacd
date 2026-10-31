import { browserAdapter } from '../../test-support/browser/adapter.js';
import { ReacdProvider } from '@fastsprout/reacd';
import { Workbench } from './workbench.js';

export function App() {
  return (
    <ReacdProvider adapter={browserAdapter}>
      <Workbench />
    </ReacdProvider>
  );
}
