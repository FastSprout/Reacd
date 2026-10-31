import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import type { ReactNode } from 'react';
import { useContext } from 'react';
import {
  validateDocument,
  visitNodes,
} from '../../schema/generative/document.schema.js';
import type { ValidationIssue } from '../../core/render-port.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { ReacdProvider } from '../provider/provider.js';
import { DocumentView } from './document-view.js';
import type { RendererProps } from './renderer.props.js';
import { ApplicationContext } from '../application-context.js';

export function ReacdRenderer({
  document,
  actions,
  adapter,
  store,
  templateId,
  templates,
}: RendererProps): ReactNode {
  const application = useContext(ApplicationContext);
  const result = validateDocument(document);
  if (!result.success) return <Issues issues={result.issues} />;
  const issues: ValidationIssue[] = [];
  visitNodes(result.data.root, (node, path) => {
    if (
      node.type === 'Button' &&
      (!Object.hasOwn(actions, node.action) ||
        typeof actions[node.action] !== 'function')
    ) {
      issues.push({
        path: `${path}.action`,
        message: `Action is not registered: ${node.action}.`,
      });
    }
  });
  if (issues.length > 0) return <Issues issues={issues} />;
  const selectedAdapter = adapter ?? application?.adapter;
  if (selectedAdapter === undefined) {
    return (
      <Issues
        issues={[
          {
            path: 'ReacdRenderer.adapter',
            message: FRAMEWORK_ERRORS.missingAdapter,
          },
        ]}
      />
    );
  }
  return (
    <ReacdProvider
      adapter={selectedAdapter}
      store={store ?? application?.store}
      templates={templates ?? application?.templates}
      templateId={templateId ?? application?.templateId ?? result.data.templateId}
    >
      <DocumentView document={result.data} actions={actions} />
    </ReacdProvider>
  );
}
