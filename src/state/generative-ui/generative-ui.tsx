import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { GenerativeApplication } from './application.js';
import type { GenerativeUIProps } from './generative-ui.props.js';

export function GenerativeUI({
  document,
  ...properties
}: GenerativeUIProps): ReactNode {
  const result = useMemo(() => validateGenerativeDocument(document), [document]);
  if (!result.success) return <Issues issues={result.issues} />;
  return <GenerativeApplication {...properties} document={result.data} />;
}
