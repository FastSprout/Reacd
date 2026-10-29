import type { GenerativeNode } from './document.schema.js';
import { chatComposerActionReferences } from '../chat-prompt/composer-contracts.js';
import { chatNodeActionReferences } from '../chat-messages/action-references.js';
import { alertNodeActionReferences } from '../alert/action-references.js';
import { chatFeedbackActionReferences } from '../chat-tool/feedback-contracts.js';
interface ActionReference {
  action: string;
  property: string;
}
export function nodeActionReferences(node: GenerativeNode): ActionReference[] {
  if (node.type === 'Carousel' || node.type === 'Chart' || node.type === 'Table')
    return node.retryAction === undefined ? [] : [{
      action: node.retryAction, property: 'retryAction',
    }];
  if (node.type === 'ChatPrompt' || node.type === 'ChatPromptSubmit')
    return chatComposerActionReferences(node);
  if (node.type === 'Form')
    return [{ action: node.submitAction, property: 'submitAction' }];
  if (node.type === 'Alert') return alertNodeActionReferences(node);
  if (node.type === 'ChatReasoning' || node.type === 'ChatTool' ||
    node.type === 'ChatShimmer')
    return chatFeedbackActionReferences(node);
  if (node.type === 'ChatAttachment' || node.type === 'ChatMessage' ||
    node.type === 'ChatMessages')
    return chatNodeActionReferences(node);
  if (node.type === 'Toast')
    return node.action === undefined ? [] : [{
      action: node.action.action, property: 'action.action',
    }];
  if (node.type === 'AuthForm')
    return [
      { action: node.submitAction, property: 'submitAction' },
      ...(node.providers?.map((provider, index) => ({
        action: provider.action, property: `providers[${index}].action`,
      })) ?? []),
    ];
  if (node.type === 'DropdownMenu' || node.type === 'ContextMenu')
    return menuItemActions(node.items);
  if (node.type === 'DashboardSearchButton')
    return [{ action: node.action, property: 'action' }];
  if (node.type === 'CommandPalette' || node.type === 'DashboardSearch' ||
    node.type === 'ContentSearch')
    return node.groups.flatMap((group, groupIndex) =>
      group.items.flatMap((item, index) =>
        item.action === undefined
          ? []
          : [
              {
                action: item.action,
                property: `groups[${groupIndex}].items[${index}].action`,
              },
            ],
      ),
    );
  if (node.type === 'FooterColumns')
    return node.columns.flatMap((column, columnIndex) =>
      column.children.flatMap((item, index) =>
        item.action === undefined
          ? []
          : [
              {
                action: item.action,
                property: `columns[${columnIndex}].children[${index}].action`,
              },
            ],
      ),
    );
  if (node.type === 'NavigationMenu')
    return node.items.flatMap((item, index) => [
      ...(item.action === undefined
        ? []
        : [
            {
              action: item.action,
              property: `items[${index}].action`,
            },
          ]),
      ...(item.children?.flatMap((child, childIndex) =>
        child.action === undefined
          ? []
          : [
              {
                action: child.action,
                property: `items[${index}].children[${childIndex}].action`,
              },
            ],
      ) ?? []),
    ]);
  if (
    (node.type === 'PageFeature' || node.type === 'PageCard' ||
      node.type === 'BlogPost' || node.type === 'ChangelogVersion') &&
    node.action !== undefined
  )
    return [{ action: node.action, property: 'action' }];
  if (node.type === 'Button') return [{ action: node.action, property: 'action' }];
  if (node.type === 'User' && node.action !== undefined)
    return [{ action: node.action, property: 'action' }];
  if (node.type === 'PinInput' && node.completeAction !== undefined)
    return [{ action: node.completeAction, property: 'completeAction' }];
  if (node.type === 'Breadcrumb')
    return node.items.flatMap((item, index) =>
      item.action === undefined
        ? []
        : [{ action: item.action, property: `items[${index}].action` }],
    );
  return [];
}
import { menuItemActions } from '../action-menu/bindings.js';
