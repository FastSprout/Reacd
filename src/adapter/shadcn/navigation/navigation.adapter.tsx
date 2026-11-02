import type { NavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation/navigation.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../vendor/ui/button.js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';

export type ShadcnNavigationProps = NavigationProps;

export function ShadcnNavigation(props: ShadcnNavigationProps) {
  const field = useNativeField({});
  return (
    <NavigationMenu
      aria-label={props.label}
      viewport={false}
      className="min-w-0 max-w-full"
    >
      <NavigationMenuList className="min-w-0 max-w-full flex-wrap">
        {props.items.map((item) => (
          <NavigationMenuItem key={item.value} className="min-w-0 max-w-full">
            <Button
              type="button"
              variant={item.value === props.value ? 'secondary' : 'ghost'}
              disabled={field.blocked}
              aria-current={item.value === props.value ? 'page' : undefined}
              onClick={() => props.onValueChange(item.value)}
              className="min-w-0 max-w-full whitespace-normal break-words"
              style={{
                height: 'auto',
                minBlockSize: LAYOUT_POLICY.controlTargetPx,
                overflowWrap: 'anywhere',
              }}
            >
              {item.label}
            </Button>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
