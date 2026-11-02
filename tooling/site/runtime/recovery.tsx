import { createRoot } from 'react-dom/client';
import { Alert, App, Button, ReacdProvider, VStack } from '@fastsprout/reacd';
import { SITE_POLICY } from '../policy.js';

export function renderSiteFailure(document: Document, reload: () => void) {
  const mount = document.getElementById(SITE_POLICY.rootId) ?? document.body;
  const root = createRoot(mount);
  root.render(
    <ReacdProvider>
      <App>
        <VStack>
          <Alert
            title="This page could not start"
            intent="error"
            message="Reload the page to try loading the documentation again."
          />
          <Button label="Reload page" onPress={reload} />
        </VStack>
      </App>
    </ReacdProvider>,
  );
  return root;
}
