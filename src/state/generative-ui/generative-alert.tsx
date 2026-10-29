import { Alert } from '../../components/alert/alert.js';
import type { AlertNodeDeclaration } from '../../schema/alert/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { alertProperties } from './alert-properties.js';
import { BoundAlertVisibility } from './bound-alert-visibility.js';

export function GenerativeAlert({
  node,
  registry,
  actions,
}: {
  node: AlertNodeDeclaration;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const { type: _type, open, ...properties } = node;
  return typeof open === 'object' ? (
    <BoundAlertVisibility
      node={properties}
      reference={open}
      registry={registry}
      actions={actions}
    />
  ) : (
    <Alert {...alertProperties(properties, registry, actions, open)} />
  );
}
