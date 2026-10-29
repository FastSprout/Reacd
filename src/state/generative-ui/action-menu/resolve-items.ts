import type { Getter } from 'jotai/vanilla';
import { z } from 'zod';
import type { DropdownMenuProps } from '../../../components/dropdown-menu/index.js';
import type { Result } from '../../../core/result.js';
import type { ValidationIssue } from '../../../core/render-port.js';
import type { MenuNodeItems } from '../../../schema/action-menu/generative.schema.js';
import type { StateBindingReference } from '../../../schema/state/binding.schema.js';
import type { StateRegistry } from '../../registry/registry.types.js';
import type { GenerativeActions } from '../generative-ui.props.js';
import { parseBoundValue } from '../binding-value.js';
import { stateFailure } from '../../registry/transaction.js';

export function menuChoice<Value extends boolean | string>(
  reference: StateBindingReference,
  schema: z.ZodType<Value>,
  registry: StateRegistry,
  get: Getter,
  report: (issues: readonly ValidationIssue[]) => void,
) {
  const binding = registry.bind(reference, {
    kinds: ['boolean', 'text'],
    mode: reference.mode,
  });
  if (!binding.success) return binding;
  const parsed = parseBoundValue(reference.state, schema, get(binding.data.atom).value);
  if (!parsed.success) return parsed;
  return {
    success: true as const,
    data: {
      value: parsed.data,
      readOnly: reference.mode === 'read',
      change: (value: Value) => {
        const changed =
          binding.data.mode === 'read'
            ? stateFailure(reference.state, 'This binding is read-only.')
            : binding.data.write(value);
        report(changed.success ? [] : changed.issues);
        return changed.success;
      },
    },
  };
}
export function resolveMenuItems(
  items: MenuNodeItems,
  registry: StateRegistry,
  actions: GenerativeActions,
  get: Getter,
  report: (issues: readonly ValidationIssue[]) => void,
): Result<DropdownMenuProps['items']> {
  const resolved: DropdownMenuProps['items'][number][] = [];
  for (const item of items) {
    switch (item.type) {
      case 'submenu': {
        const children = resolveMenuItems(item.items, registry, actions, get, report);
        if (!children.success) return children;
        // The source contract permits exactly one submenu level.
        const leaves = children.data.filter((child) => child.type !== 'submenu');
        resolved.push({ ...item, items: leaves });
        break;
      }
      case 'action': {
        const { action, ...properties } = item;
        resolved.push({
          ...properties,
          onPress() {
            const handler = Object.hasOwn(actions, action)
              ? actions[action]
              : undefined;
            if (typeof handler === 'function') handler({ state: registry });
          },
        });
        break;
      }
      case 'checkbox': {
        const choice = menuChoice(item.checked, z.boolean(), registry, get, report);
        if (!choice.success) return choice;
        resolved.push({
          ...item,
          checked: choice.data.value,
          disabled: item.disabled || choice.data.readOnly,
          onCheckedChange: choice.data.change,
        });
        break;
      }
      case 'radio': {
        const schema = z
          .string()
          .refine((value) => item.options.some((option) => option.value === value));
        const choice = menuChoice(item.value, schema, registry, get, report);
        if (!choice.success) return choice;
        resolved.push({
          ...item,
          value: choice.data.value,
          disabled: item.disabled || choice.data.readOnly,
          onValueChange: choice.data.change,
        });
        break;
      }
      default:
        resolved.push(item);
    }
  }
  return { success: true, data: resolved };
}
