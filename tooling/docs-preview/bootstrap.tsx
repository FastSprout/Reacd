import { browserAdapter } from '../../test-support/browser/adapter.js';
import { mountApplication } from '../../src/state/bootstrap.js';
import { DocumentationPreview } from './preview-app.js';

export const root = mountApplication(function Preview() {
  return (
    <DocumentationPreview
      search={window.location.search}
      initialAdapter={browserAdapter.id === 'material-ui' ? 'mui' : 'shadcn'}
    />
  );
});
