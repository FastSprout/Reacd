import { ReacdProvider } from 'reacd';
import { Workbench } from './workbench.js';

export function App() {
  return (
    <ReacdProvider>
      <Workbench />
    </ReacdProvider>
  );
}
