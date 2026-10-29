import { createContext, useContext, useState } from 'react';
import { Menu } from '@base-ui/react/menu';
import type { DropdownMenuProps } from '../../../components/dropdown-menu/index.js';
import {
  ACTION_MENU_DEFAULTS,
  menuDecision,
  invokeMenuRadio,
} from '../../../core/action-menu-policy.js';
import { MenuSurface } from './menu-surface.js';

type Item = DropdownMenuProps['items'][number];
export const MenuSelectionContext = createContext({
  finish: (_result: unknown, _close: boolean): void => {
    throw new Error('Menu items require a selection frame.');
  },
});
export function MenuItems({ items }: Pick<DropdownMenuProps, 'items'>) {
  return items.map((item) => <MenuItem key={item.key} item={item} />);
}
function MenuItem({ item }: { item: Item }) {
  const { finish } = useContext(MenuSelectionContext);
  switch (item.type) {
    case 'separator':
      return <Menu.Separator className="reacd-action-separator" />;
    case 'label':
      return <div className="reacd-action-label">{item.label}</div>;
    case 'submenu':
      return <Submenu item={item} />;
    case 'action':
      return (
        <Menu.Item
          className="reacd-action-item"
          label={item.label}
          disabled={item.disabled}
          data-intent={item.intent}
          closeOnClick={false}
          onClick={() =>
            finish(
              item.onPress(),
              item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction,
            )
          }
        >
          {item.label}
        </Menu.Item>
      );
    case 'link':
      return item.disabled ? (
        <Menu.Item disabled className="reacd-action-item">
          {item.label}
        </Menu.Item>
      ) : (
        <Menu.LinkItem
          className="reacd-action-item"
          href={item.href}
          target={item.newWindow ? '_blank' : undefined}
          rel={item.newWindow ? 'noopener noreferrer' : undefined}
          closeOnClick={item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeAction}
        >
          {item.label}
        </Menu.LinkItem>
      );
    case 'checkbox':
      return (
        <Menu.CheckboxItem
          className="reacd-action-item"
          label={item.label}
          checked={item.checked}
          disabled={item.disabled}
          closeOnClick={false}
          onCheckedChange={(value, details) => {
            const result: unknown = item.onCheckedChange(value);
            if (menuDecision(result) !== 'accept') details.cancel();
            finish(result, item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice);
          }}
        >
          <Menu.CheckboxItemIndicator className="reacd-action-indicator">
            ✓
          </Menu.CheckboxItemIndicator>
          {item.label}
        </Menu.CheckboxItem>
      );
    case 'radio':
      return (
        <Menu.RadioGroup
          aria-label={item.label}
          value={item.value}
          disabled={item.disabled}
          onValueChange={(value: unknown, details) => {
            const result = invokeMenuRadio(item, value);
            if (menuDecision(result) !== 'accept') details.cancel();
            finish(result, item.closeOnSelect ?? ACTION_MENU_DEFAULTS.closeChoice);
          }}
        >
          <div className="reacd-action-label">{item.label}</div>
          {item.options.map((option) => (
            <Menu.RadioItem
              key={option.value}
              className="reacd-action-item"
              value={option.value}
              disabled={option.disabled}
              label={option.label}
              closeOnClick={false}
            >
              <Menu.RadioItemIndicator className="reacd-action-indicator">
                ●
              </Menu.RadioItemIndicator>
              {option.label}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      );
  }
}
function Submenu({ item }: { item: Extract<Item, { type: 'submenu' }> }) {
  const [open, setOpen] = useState(false);
  return (
    <Menu.SubmenuRoot open={open} onOpenChange={setOpen} disabled={item.disabled}>
      <Menu.SubmenuTrigger className="reacd-action-item" label={item.label}>
        {item.label}
        <span aria-hidden="true"> ›</span>
      </Menu.SubmenuTrigger>
      <MenuSurface label={item.label} submenu>
        <MenuItems items={item.items} />
      </MenuSurface>
    </Menu.SubmenuRoot>
  );
}
