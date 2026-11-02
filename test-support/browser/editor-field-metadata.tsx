import { browserAdapter } from './adapter.js';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'jotai';
import { ReacdProvider } from '@fastsprout/reacd';
import { EditorFieldView } from './editor-field-view.js';
import { ViewBoundary } from '../../tooling/conformance/loading/view-boundary.js';
import '@fastsprout/reacd-shadcn/styles';

function Root() {
  const [store] = useState(createStore);
  const [compact, setCompact] = useState(false);
  return (
    <ReacdProvider
      adapter={browserAdapter}
      store={store}
      templateId={compact ? 'erp-compact' : 'saas-modern-light'}
    >
      <ViewBoundary label="Editor metadata">
        <EditorFieldView onTemplate={() => setCompact(!compact)} />
      </ViewBoundary>
    </ReacdProvider>
  );
}
const root = document.getElementById('root');
if (root === null) throw new Error('Missing Editor field proof root.');
createRoot(root).render(<Root />);
