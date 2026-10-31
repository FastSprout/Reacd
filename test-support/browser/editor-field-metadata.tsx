import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'jotai';
import { ReacdProvider } from '@fastsprout/reacd';
import { EditorFieldView } from './editor-field-view.js';
import '@fastsprout/reacd-shadcn/styles';

function Root() {
  const [store] = useState(createStore);
  const [compact, setCompact] = useState(false);
  return (
    <ReacdProvider
      adapter={shadcnAdapter}
      store={store}
      templateId={compact ? 'erp-compact' : 'saas-modern-light'}
    >
      <EditorFieldView onTemplate={() => setCompact(!compact)} />
    </ReacdProvider>
  );
}
const root = document.getElementById('root');
if (root === null) throw new Error('Missing Editor field proof root.');
createRoot(root).render(<Root />);
