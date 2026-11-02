import type { ContextMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/context-menu/context-menu.props.js';
import { ACTION_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import {
  ContextMenuCheckboxItem,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
} from '../vendor/ui/context-menu.js';
import { selectContextItem } from './selection.js';
import { contextMenuGroups } from './groups.js';
import { ShadcnContextSubmenu } from './submenu.js';

export interface ContextItemsProps {
  readonly items: ContextMenuProps['items'];
  readonly host: HTMLElement | null;
  readonly report: (message: string) => void;
}

export function ShadcnContextItems({ items, host, report }: ContextItemsProps) {
  return contextMenuGroups(items).map((group) => (
    <ContextMenuGroup key={group.key}>
      {group.label && <ContextMenuLabel>{group.label}</ContextMenuLabel>}
      {group.items.map((item) => {
        switch (item.type) {
          case 'separator':
            return <ContextMenuSeparator key={item.key} />;
          case 'action':
            return (
              <ContextMenuItem
                key={item.key}
                disabled={item.disabled}
                variant={item.intent === 'danger' ? 'destructive' : 'default'}
                closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction}
                onClick={(event) => selectContextItem(event, item.onPress, report)}
              >
                {item.label}
              </ContextMenuItem>
            );
          case 'link':
            return (
              <ContextMenuItem
                key={item.key}
                disabled={item.disabled}
                closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction}
                render={
                  <a
                    href={item.disabled ? undefined : item.href}
                    target={!item.disabled && item.newWindow ? '_blank' : undefined}
                    rel={
                      !item.disabled && item.newWindow
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  />
                }
              >
                {item.label}
              </ContextMenuItem>
            );
          case 'checkbox':
            return (
              <ContextMenuCheckboxItem
                key={item.key}
                checked={item.checked}
                disabled={item.disabled}
                closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice}
                onClick={(event) =>
                  selectContextItem(
                    event,
                    () => item.onCheckedChange(!item.checked),
                    report,
                  )
                }
              >
                {item.label}
              </ContextMenuCheckboxItem>
            );
          case 'radio':
            return (
              <ContextMenuRadioGroup
                key={item.key}
                value={item.value}
                disabled={item.disabled}
                aria-label={item.label}
              >
                <ContextMenuLabel>{item.label}</ContextMenuLabel>
                {item.options.map((option) => (
                  <ContextMenuRadioItem
                    key={option.value}
                    value={option.value}
                    disabled={item.disabled || option.disabled}
                    closeOnClick={
                      item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice
                    }
                    onClick={(event) =>
                      selectContextItem(
                        event,
                        () => item.onValueChange(option.value),
                        report,
                      )
                    }
                  >
                    {option.label}
                  </ContextMenuRadioItem>
                ))}
              </ContextMenuRadioGroup>
            );
          case 'submenu':
            return (
              <ShadcnContextSubmenu key={item.key} item={item} host={host}>
                <ShadcnContextItems items={item.items} host={host} report={report} />
              </ShadcnContextSubmenu>
            );
        }
      })}
    </ContextMenuGroup>
  ));
}
