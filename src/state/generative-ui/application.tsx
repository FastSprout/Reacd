import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { useContext, useState } from 'react';
import { definitionSignature } from '../../schema/state/definition-signature.js';
import { visitGenerativeNodes } from '../../schema/generative-v2/document.schema.js';
import { nodeActionReferences } from '../../schema/generative-v2/action-references.js';
import type { GenerativeDocument } from '../../schema/generative-v2/document.schema.js';
import type { ValidationIssue } from '../../core/render-port.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { ApplicationContext } from '../application-context.js';
import { ReacdProvider } from '../provider/provider.js';
import { initializeStateRegistry } from '../registry/initialize-registry.js';
import { GenerativeNodeView } from './node-view.js';
import type { GenerativeUIProps } from './generative-ui.props.js';

const EMPTY_ACTIONS = Object.freeze({});

export function GenerativeApplication({
  document,
  registry,
  actions = EMPTY_ACTIONS,
  adapter,
  templateId,
  templates,
}: Omit<GenerativeUIProps, 'document'> & { document: GenerativeDocument }) {
  const application = useContext(ApplicationContext);
  const [localRegistry] = useState(() =>
    initializeStateRegistry(document.state, application?.store),
  );
  const state = registry ?? localRegistry;
  const issues: ValidationIssue[] = [];
  if (state.definitionSignature !== definitionSignature(document.state)) {
    issues.push({
      path: '$.state',
      message: 'State definitions changed. Supply an explicitly migrated registry.',
    });
  }
  visitGenerativeNodes(document.root, (node, path) => {
    for (const { action, property } of nodeActionReferences(node)) {
      if (!Object.hasOwn(actions, action) || typeof actions[action] !== 'function') {
        issues.push({
          path: `${path}.${property}`,
          message: `Action is not registered: ${action}.`,
        });
      }
    }
  });
  if (issues.length > 0) return <Issues issues={issues} />;
  const selectedAdapter = adapter ?? application?.adapter;
  if (selectedAdapter === undefined) {
    return (
      <Issues
        issues={[
          {
            path: 'GenerativeUI.adapter',
            message: FRAMEWORK_ERRORS.missingAdapter,
          },
        ]}
      />
    );
  }
  return (
    <ReacdProvider
      store={state.store}
      adapter={selectedAdapter}
      templateId={templateId ?? application?.templateId ?? document.templateId}
      templates={templates ?? application?.templates}
    >
      <GenerativeNodeView node={document.root} registry={state} actions={actions} />
    </ReacdProvider>
  );
}
