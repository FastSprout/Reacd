import { useDirection } from '@base-ui/react/direction-provider';
import type { DropdownMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/dropdown-menu/dropdown-menu.props.js';
import {
  ACTION_MENU_DEFAULTS,
  ACTION_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../vendor/ui/dropdown-menu.js';
import { selectNativeMenuItem } from './native-selection.js';
import { SUBMENU_COLLISION_AVOIDANCE } from './position-policy.js';

interface MenuItemsProps {
  readonly items: DropdownMenuProps['items'];
  readonly host: HTMLElement | null;
  readonly report: (message: string) => void;
}

export function ShadcnMenuItems({ items, host, report }: MenuItemsProps) {
  const theme = useShadcnTheme();
  const direction = useDirection();
  return (
    <DropdownMenuGroup>
      {items.map((item) => {
        switch (item.type) {
          case 'label':
            return <DropdownMenuLabel key={item.key}>{item.label}</DropdownMenuLabel>;
          case 'separator':
            return <DropdownMenuSeparator key={item.key} />;
          case 'action':
            return (
              <DropdownMenuItem
                key={item.key}
                disabled={item.disabled}
                variant={item.intent === 'danger' ? 'destructive' : 'default'}
                closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction}
                onClick={(event) =>
                  selectNativeMenuItem(
                    event,
                    item.onPress,
                    item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction,
                    report,
                  )
                }
              >
                {item.label}
              </DropdownMenuItem>
            );
          case 'link':
            return (
              <DropdownMenuItem
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
              </DropdownMenuItem>
            );
          case 'checkbox':
            return (
              <DropdownMenuCheckboxItem
                key={item.key}
                checked={item.checked}
                disabled={item.disabled}
                closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice}
                onClick={(event) =>
                  selectNativeMenuItem(
                    event,
                    () => item.onCheckedChange(!item.checked),
                    item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice,
                    report,
                  )
                }
              >
                {item.label}
              </DropdownMenuCheckboxItem>
            );
          case 'radio':
            return (
              <DropdownMenuRadioGroup
                key={item.key}
                value={item.value}
                aria-label={item.label}
              >
                <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                {item.options.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    disabled={item.disabled || option.disabled}
                    closeOnClick={
                      item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice
                    }
                    onClick={(event) =>
                      selectNativeMenuItem(
                        event,
                        () => item.onValueChange(option.value),
                        item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice,
                        report,
                      )
                    }
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            );
          case 'submenu':
            return (
              <DropdownMenuSub key={item.key}>
                <DropdownMenuSubTrigger disabled={item.disabled}>
                  {item.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  aria-label={item.label}
                  dir={direction}
                  container={host ?? undefined}
                  collisionPadding={ACTION_MENU_POLICY.collisionPaddingPx}
                  collisionAvoidance={SUBMENU_COLLISION_AVOIDANCE}
                  className="min-w-0 overflow-y-auto [overflow-wrap:anywhere]"
                  style={{
                    ...theme,
                    maxInlineSize: 'var(--available-width)',
                    maxBlockSize: 'var(--available-height)',
                  }}
                >
                  <ShadcnMenuItems items={item.items} host={host} report={report} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
        }
      })}
    </DropdownMenuGroup>
  );
}
