import type { AlertNodeDeclaration } from './generative.schema.js';
export function alertNodeActionReferences(node: AlertNodeDeclaration) {
  return (
    node.actions?.map((action, index) => ({
      action: action.action,
      property: `actions[${index}].action`,
    })) ?? []
  );
}
